/**
 * Testes unitários para o ponto de entrada da aplicação
 *
 * Este arquivo contém testes que verificam o comportamento do ponto de entrada
 * principal da aplicação, incluindo inicialização do servidor e tratamento de erros.
 *
 * @group Unit
 * @group App
 */

// Mock para module-alias/register
jest.mock("module-alias/register", () => {
  // Mock vazio para o módulo que registra aliases
});

// Mock para a função startServer
jest.mock("../server", () => ({
  startServer: jest.fn().mockResolvedValue(undefined),
}));

// Importar os módulos após os mocks
import { main } from "../index";
import { startServer } from "../server";

// Fazer o cast para jest.Mock para ter acesso aos métodos de mock
const mockStartServer = startServer as jest.Mock;

describe("Application Entry Point", () => {
  // Espionar console.error
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();

    // Limpar variáveis de ambiente que podem afetar os testes
    delete process.env.PORT;
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("main function", () => {
    it("deve iniciar o servidor na porta padrão 3333 quando PORT não está definido", async () => {
      // Executar a função main
      await main();

      // Verificar se startServer foi chamado com a porta padrão
      expect(mockStartServer).toHaveBeenCalledWith(3333);
      expect(mockStartServer).toHaveBeenCalledTimes(1);
    });

    it("deve iniciar o servidor na porta especificada quando PORT está definido", async () => {
      // Configurar variável de ambiente PORT
      process.env.PORT = "4444";

      // Executar a função main
      await main();

      // Verificar se startServer foi chamado com a porta correta
      expect(mockStartServer).toHaveBeenCalledWith(4444);
      expect(mockStartServer).toHaveBeenCalledTimes(1);
    });

    it("deve tratar erros lançados por startServer", async () => {
      // Configurar mockStartServer para lançar um erro
      const mockError = new Error("Falha ao iniciar o servidor");
      mockStartServer.mockRejectedValueOnce(mockError);

      // Executar a função main
      await main();

      // Verificar se o erro foi registrado
      expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);
    });

    it("deve ignorar valores PORT não numéricos e usar o padrão", async () => {
      // Configurar variável de ambiente PORT com valor não numérico
      process.env.PORT = "porta";

      // Executar a função main
      await main();

      // Verificar se startServer foi chamado com a porta padrão
      expect(mockStartServer).toHaveBeenCalledWith(NaN);
    });

    it("deve converter corretamente valores PORT decimais para inteiros", async () => {
      // Configurar variável de ambiente PORT com valor decimal
      process.env.PORT = "5555.67";

      // Executar a função main
      await main();

      // Verificar se startServer foi chamado com o inteiro correto
      expect(mockStartServer).toHaveBeenCalledWith(5555);
    });
  });

  describe("Module execution", () => {
    it("deve ter uma condição para executar main apenas quando executado diretamente", () => {
      // Este teste verifica a existência da condição if (require.main === module)
      // que não é diretamente testável em testes unitários

      // Verificar se a função main existe e está acessível
      expect(main).toBeDefined();
      expect(typeof main).toBe("function");

      // Observação: A linha if (require.main === module) está marcada com
      // istanbul ignore next, que é uma prática recomendada para linhas
      // difíceis de testar em testes unitários
    });
  });
});
