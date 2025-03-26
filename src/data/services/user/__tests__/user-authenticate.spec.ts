/**
 * @file user-authenticate.spec.ts
 * @description Testes unitários para o serviço UserAuthenticateService.
 * Verifica o comportamento do serviço de autenticação de usuários em diferentes cenários.
 */

import {
  User,
  USER_DEFAULT_AVATAR_URL,
  USER_DEFAULT_ROLE,
} from "@/domain/entities";
import { InvalidParamError } from "@/domain/errors";
import { HashProvider, JwtProvider, LoggerProvider } from "@/domain/providers";
import { UserRepository } from "@/domain/repositories";

import { UserAuthenticateService } from "../user-authenticate";

/**
 * @description Suite de testes para o UserAuthenticateService
 * Testa a autenticação de usuários com casos de sucesso e falha
 */
describe("UserAuthenticateService", () => {
  /**
   * @description Mock do repositório de usuários
   * Contém funções simuladas para operações de usuário
   */
  const mockUserRepository: jest.Mocked<UserRepository> = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    list: jest.fn(),
  };

  /**
   * @description Mock do provedor de hash
   * Simula operações de hash e comparação de senhas
   */
  const mockHashProvider: jest.Mocked<HashProvider> = {
    hash: jest.fn(),
    compare: jest.fn(),
    withOptions: jest.fn(),
  };

  /**
   * @description Mock do provedor JWT
   * Simula operações de criação e verificação de tokens JWT
   */
  const mockJwtProvider: jest.Mocked<JwtProvider> = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  /**
   * @description Mock do provedor de logs
   * Simula operações de logging em diferentes níveis
   */
  const mockLoggerProvider: jest.Mocked<LoggerProvider> = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    log: jest.fn(),
    trace: jest.fn(),
    withContext: jest.fn(),
  };

  /**
   * @description Dados de usuário de teste
   * Representa um usuário válido no sistema para testes
   */
  const mockUser: User = {
    id: "user-id-1",
    name: "Test User",
    email: "test@example.com",
    phone: "(62) 99999-9999",
    birthdate: new Date(),
    avatarUrl: USER_DEFAULT_AVATAR_URL,
    role: USER_DEFAULT_ROLE,
    password: "hashed-password",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  /**
   * @description Dados de autenticação para testes
   * Contém email e senha para tentativas de login
   */
  const mockAuthData = {
    email: "test@example.com",
    password: "password123",
  };

  /**
   * @description Token de acesso simulado
   * Representa um JWT válido retornado após autenticação
   */
  const mockAccessToken = "mock-jwt-token";

  /**
   * @description Instância do serviço a ser testado
   */
  let userAuthenticateService: UserAuthenticateService;

  /**
   * @description Configuração executada antes de cada teste
   * Limpa todos os mocks e instancia o serviço com as dependências mockadas
   */
  beforeEach(() => {
    jest.clearAllMocks();

    userAuthenticateService = new UserAuthenticateService({
      userRepository: mockUserRepository,
      hashProvider: mockHashProvider,
      jwtProvider: mockJwtProvider,
      loggerProvider: mockLoggerProvider,
    });
  });

  /**
   * @description Testes para o método authenticate
   */
  describe("authenticate", () => {
    /**
     * @description Testa a autenticação bem-sucedida de um usuário
     * Verifica se o serviço retorna os dados do usuário (sem a senha) e um token de acesso válido
     */
    it("should authenticate user successfully and return user data with access token", async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockHashProvider.compare.mockResolvedValue(true);
      mockJwtProvider.sign.mockResolvedValue(mockAccessToken);

      // Act
      const result = await userAuthenticateService.authenticate(mockAuthData);

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        mockAuthData.email,
      );
      expect(mockHashProvider.compare).toHaveBeenCalledWith(
        mockAuthData.password,
        mockUser.password,
      );
      expect(mockJwtProvider.sign).toHaveBeenCalledWith({
        userId: mockUser.id,
        role: mockUser.role,
      });
      expect(mockLoggerProvider.debug).toHaveBeenCalled();
      expect(mockLoggerProvider.info).toHaveBeenCalled();

      expect(result).toEqual({
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          phone: mockUser.phone,
          birthdate: mockUser.birthdate,
          avatarUrl: mockUser.avatarUrl,
          role: mockUser.role,
          createdAt: mockUser.createdAt,
          updatedAt: mockUser.updatedAt,
        },
        accessToken: mockAccessToken,
      });

      // Password should not be included in the response
      expect(result.user).not.toHaveProperty("password");
    });

    /**
     * @description Testa o cenário onde o usuário não é encontrado
     * Verifica se o serviço lança um InvalidParamError quando o email não existe
     */
    it("should throw InvalidParamError when user is not found", async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(
        userAuthenticateService.authenticate(mockAuthData),
      ).rejects.toThrow(InvalidParamError);

      expect(mockLoggerProvider.error).toHaveBeenCalled();
      expect(mockHashProvider.compare).not.toHaveBeenCalled();
      expect(mockJwtProvider.sign).not.toHaveBeenCalled();
    });

    /**
     * @description Testa o cenário onde a senha está incorreta
     * Verifica se o serviço lança um InvalidParamError quando a senha não corresponde
     */
    it("should throw InvalidParamError when password is incorrect", async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockHashProvider.compare.mockResolvedValue(false);

      // Act & Assert
      await expect(
        userAuthenticateService.authenticate(mockAuthData),
      ).rejects.toThrow(InvalidParamError);

      expect(mockLoggerProvider.error).toHaveBeenCalled();
      expect(mockHashProvider.compare).toHaveBeenCalled();
      expect(mockJwtProvider.sign).not.toHaveBeenCalled();
    });

    /**
     * @description Testa a propagação e o registro de erros durante a autenticação
     * Verifica se o serviço propaga adequadamente erros e registra informações detalhadas
     */
    it("should propagate and log errors that occur during authentication", async () => {
      // Arrange
      const testError = new Error("Test error");
      mockUserRepository.findByEmail.mockRejectedValue(testError);

      // Act & Assert
      await expect(
        userAuthenticateService.authenticate(mockAuthData),
      ).rejects.toThrow(testError);

      expect(mockLoggerProvider.error).toHaveBeenCalled();
      expect(mockLoggerProvider.error).toHaveBeenCalledWith(
        "Erro ao autenticar usuário",
        expect.objectContaining({
          metadata: expect.objectContaining({
            error: expect.objectContaining({
              name: testError.name,
              message: testError.message,
              stack: testError.stack,
            }),
          }),
        }),
      );
    });
  });
});
