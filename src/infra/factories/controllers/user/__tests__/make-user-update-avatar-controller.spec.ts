import { makeUserUpdateAvatarController } from "@/infra/factories";
import { UserUpdateAvatarController } from "@/presentation/controllers";

describe("makeUserUpdateAvatarController", () => {
  it("should create and return an UserUpdateAvatarController instance with correct dependencies", () => {
    // Arrange - Preparar tudo o que é necessário para o teste
    // Neste caso, não precisamos de preparação especial

    // Act - Executar a ação que queremos testar
    const controller = makeUserUpdateAvatarController();

    // Assert - Verificar se o resultado é o esperado
    expect(controller).toBeInstanceOf(UserUpdateAvatarController);
    expect(controller).toHaveProperty("handle");
  });
});
