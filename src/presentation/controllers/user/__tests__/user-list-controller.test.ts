import { InMemoryUserRepository } from "@/data/repositories";
import { UserListService } from "@/data/services";
import { UserCreateData, UserMapped } from "@/domain/entities";
import { LoggerProvider } from "@/domain/providers";
import { UserRepository } from "@/domain/repositories";
import { UserListController } from "@/presentation/controllers";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/presentation/protocols";

interface SutResponse {
  sut: Controller;
  userRepository: UserRepository;
  userListService: UserListService;
}

const makeSut = (): SutResponse => {
  // Arrange - Preparação dos mocks e dependências
  const loggerProvider = jest.mocked<LoggerProvider>({
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
    withContext: jest.fn(),
  });
  const userRepository = new InMemoryUserRepository();
  const userListService = new UserListService({
    loggerProvider,
    userRepository,
  });
  const sut = new UserListController({
    userListService,
  });

  return { sut, userRepository, userListService };
};

describe("UserListController", () => {
  describe("handle", () => {
    it("should return a list of users with status 200", async () => {
      // Arrange
      const { sut } = makeSut();
      const httpRequest = {} as HttpRequest;

      // Act
      const httpResponse: HttpResponse<UserMapped[]> =
        await sut.handle(httpRequest);

      // Assert
      expect(httpResponse.statusCode).toBe(200);
      expect(httpResponse.body.data).toEqual(expect.any(Array));
      expect(httpResponse.body.data).toBeDefined();
    });

    it("should return user data with correct properties", async () => {
      // Arrange
      const { sut, userRepository } = makeSut();
      const userCreateData: UserCreateData = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "(11) 99999-9999",
        birthdate: new Date("1990-01-01"),
        password: "P@ssw0rd",
      };
      await userRepository.create(userCreateData);
      const httpRequest = {} as HttpRequest;

      // Act
      const httpResponse: HttpResponse<UserMapped[]> =
        await sut.handle(httpRequest);
      const user = httpResponse.body.data?.[0];

      // Assert
      expect(user).toBeDefined();
      expect(user).toHaveProperty("id");
      expect(user?.name).toEqual(userCreateData.name);
      expect(user?.email).toBe(userCreateData.email);
      expect(user?.phone).toBe(userCreateData.phone);
      expect(user?.birthdate).toBe(userCreateData.birthdate);
      // Verificação adicional importante: garantir que a senha não está sendo retornada
      expect(user).not.toHaveProperty("password");
    });

    it("should handle errors and return status 500 when service throws", async () => {
      // Arrange
      const { sut, userListService } = makeSut();
      const httpRequest = {} as HttpRequest;
      const expectedError = new Error("unexpected error");
      jest.spyOn(userListService, "list").mockRejectedValueOnce(expectedError);

      // Act
      const httpResponse: HttpResponse = await sut.handle(httpRequest);

      // Assert
      expect(httpResponse.statusCode).toBe(500);
      expect(httpResponse.body.errorMessage).toBe(expectedError.message);
      expect(httpResponse.body.success).toBe(false);
    });
  });
});
