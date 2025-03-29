import { AuthenticateService } from "@/data/services";
import { LoggerProvider } from "@/domain/providers";
import { makeAuthenticateService } from "@/infra/factories";

describe("makeUserAuthenticateService", () => {
  it("should create and return a UserAuthenticateService instance with correct dependencies", () => {
    // Arrange - Preparar tudo o que é necessário para o teste
    const loggerProvider = jest.mocked<LoggerProvider>({
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      log: jest.fn(),
      trace: jest.fn(),
      withContext: jest.fn(),
    });

    // Act - Executar a ação que queremos testar
    const sut = makeAuthenticateService(loggerProvider);

    // Assert - Verificar se o resultado é o esperado
    expect(sut).toBeInstanceOf(AuthenticateService);
    expect(sut).toHaveProperty("authenticate");
  });
});
