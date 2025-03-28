import { UserListService } from "@/data/services";
import { LoggerProvider } from "@/domain/providers";
import { makeUserListService } from "@/infra/factories";

describe("makeUserListService", () => {
  it("should create and return a UserListService instance", () => {
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
    const userListService = makeUserListService(loggerProvider);

    // Assert that the factory returns the correct instance
    expect(userListService).toBeInstanceOf(UserListService);
    expect(userListService).toHaveProperty("list");
  });
});
