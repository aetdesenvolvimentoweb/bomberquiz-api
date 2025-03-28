import { makeUserCreateController } from "@/infra/factories";
import { UserCreateController } from "@/presentation/controllers";

describe("makeUserCreateController", () => {
  it("should create and return a UserCreateController instance with correct dependencies", () => {
    // Arrange - Preparar tudo o que é necessário para o teste
    // Neste caso, não precisamos de preparação especial

    // Act - Executar a ação que queremos testar
    const controller = makeUserCreateController();

    // Assert - Verificar se o resultado é o esperado
    expect(controller).toBeInstanceOf(UserCreateController);
    expect(controller).toHaveProperty("handle");
  });
});
