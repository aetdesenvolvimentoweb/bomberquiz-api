import { AuthenticateService } from "@/data/services";
import { makeAuthenticateService } from "@/infra/factories";

describe("makeUserAuthenticateService", () => {
  it("should create and return a UserAuthenticateService instance with correct dependencies", () => {
    // Act - Executar a ação que queremos testar
    const sut = makeAuthenticateService();

    // Assert - Verificar se o resultado é o esperado
    expect(sut).toBeInstanceOf(AuthenticateService);
    expect(sut).toHaveProperty("authenticate");
  });
});
