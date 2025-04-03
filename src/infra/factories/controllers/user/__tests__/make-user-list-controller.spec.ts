import { makeUserListController } from "@/infra/factories";
import { UserListController } from "@/presentation/controllers";

describe("makeUserListController", () => {
  it("should create and return an UserListController instance with correct dependencies", () => {
    // Arrange - Preparar tudo o que é necessário para o teste
    // Neste caso, não precisamos de preparação especial

    // Act - Executar a ação que queremos testar
    const controller = makeUserListController();

    // Assert - Verificar se o resultado é o esperado
    expect(controller).toBeInstanceOf(UserListController);
    expect(controller).toHaveProperty("handle");
  });
});
