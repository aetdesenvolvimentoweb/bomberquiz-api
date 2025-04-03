import { UserCreateService } from "@/data/services";
import { LoggerProvider } from "@/domain/providers";
import { makeUserCreateService } from "@/infra/factories";

describe("makeUserCreateService", () => {
  it("should create and return a UserCreateService instance", () => {
    // Create a mock for the LoggerProvider
    const loggerProvider = jest.mocked<LoggerProvider>({
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      log: jest.fn(),
      trace: jest.fn(),
      withContext: jest.fn(),
    });

    // Call the factory function
    const userCreateService = makeUserCreateService(loggerProvider);

    // Assert that the factory returns the correct instance
    expect(userCreateService).toBeInstanceOf(UserCreateService);
    expect(userCreateService).toHaveProperty("create");
  });
});
