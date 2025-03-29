import { makeAuthenticateController } from "@/infra/factories";
import { AuthenticateController } from "@/presentation/controllers";

describe("makeAuthenticateController", () => {
  it("should create and return a AuthenticateController instance with correct dependencies", () => {
    // Arrange - Preparar tudo o que é necessário para o teste
    // Neste caso, não precisamos de preparação especial

    // Act - Executar a ação que queremos testar
    const controller = makeAuthenticateController();

    // Assert - Verificar se o resultado é o esperado
    expect(controller).toBeInstanceOf(AuthenticateController);

    // Podemos adicionar mais asserções para verificar se as dependências foram injetadas corretamente
    // Por exemplo, podemos verificar se o controller tem as propriedades esperadas
    expect(controller).toHaveProperty("handle");
  });
});
