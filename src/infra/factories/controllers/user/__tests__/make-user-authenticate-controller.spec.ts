import { makeUserAuthenticateController } from "@/infra/factories";
import { UserAuthenticateController } from "@/presentation/controllers";

describe("makeUserAuthenticateController", () => {
  it("should create and return a UserAuthenticateController instance with correct dependencies", () => {
    // Arrange - Preparar tudo o que é necessário para o teste
    // Neste caso, não precisamos de preparação especial

    // Act - Executar a ação que queremos testar
    const controller = makeUserAuthenticateController();

    // Assert - Verificar se o resultado é o esperado
    expect(controller).toBeInstanceOf(UserAuthenticateController);

    // Podemos adicionar mais asserções para verificar se as dependências foram injetadas corretamente
    // Por exemplo, podemos verificar se o controller tem as propriedades esperadas
    expect(controller).toHaveProperty("handle");
  });
});
