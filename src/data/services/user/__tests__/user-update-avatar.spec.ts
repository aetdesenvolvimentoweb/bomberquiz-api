/**
 * Testes unitários para a classe UserUpdateAvatarService
 *
 * Este arquivo contém testes que verificam o comportamento do serviço
 * de atualização de avatar do usuário, incluindo o fluxo feliz e cenários de erro.
 *
 * @group Unit
 * @group Services
 * @group User
 */

import { UserUpdateAvatarService } from "@/data/services";
import { UserAvatarData } from "@/domain/entities";
import { InvalidParamError } from "@/domain/errors";
import { LoggerProvider } from "@/domain/providers";
import { UserRepository } from "@/domain/repositories";
import { UserAvatarDataSanitizerUseCase } from "@/domain/sanitizers";
import { UserAvatarDataValidatorUseCase } from "@/domain/validators";

// Mocks
const mockUserRepository: jest.Mocked<UserRepository> = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  list: jest.fn(),
  findById: jest.fn(),
  updateAvatar: jest.fn(),
};

const mockUserAvatarDataSanitizer: jest.Mocked<UserAvatarDataSanitizerUseCase> =
  {
    sanitize: jest.fn(),
  };

const mockUserAvatarDataValidator: jest.Mocked<UserAvatarDataValidatorUseCase> =
  {
    validate: jest.fn(),
  };

const mockLoggerProvider: jest.Mocked<LoggerProvider> = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
  withContext: jest.fn().mockReturnThis(),
};

describe("UserUpdateAvatarService", () => {
  let userUpdateAvatarService: UserUpdateAvatarService;
  let avatarData: UserAvatarData;
  let sanitizedAvatarData: UserAvatarData;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create service instance with mocked dependencies
    userUpdateAvatarService = new UserUpdateAvatarService({
      userRepository: mockUserRepository,
      userAvatarDataSanitizer: mockUserAvatarDataSanitizer,
      userAvatarDataValidator: mockUserAvatarDataValidator,
      loggerProvider: mockLoggerProvider,
    });

    // Sample avatar data
    avatarData = {
      id: "user-123",
      avatarUrl: "https://example.com/avatar.jpg",
    };

    // Sample sanitized data (no changes for this example)
    sanitizedAvatarData = {
      id: "user-123",
      avatarUrl: "https://example.com/avatar.jpg",
    };

    // Configure default mock behavior
    mockUserAvatarDataSanitizer.sanitize.mockReturnValue(sanitizedAvatarData);
    mockUserAvatarDataValidator.validate.mockResolvedValue(undefined);
    mockUserRepository.updateAvatar.mockResolvedValue(undefined);
  });

  describe("updateAvatar method", () => {
    it("deve atualizar o avatar do usuário com sucesso quando todos os dados são válidos", async () => {
      // Act
      await userUpdateAvatarService.updateAvatar(avatarData);

      // Assert
      expect(mockUserAvatarDataSanitizer.sanitize).toHaveBeenCalledWith(
        avatarData,
      );
      expect(mockUserAvatarDataValidator.validate).toHaveBeenCalledWith(
        sanitizedAvatarData,
      );
      expect(mockUserRepository.updateAvatar).toHaveBeenCalledWith(
        sanitizedAvatarData,
      );

      // Verify logs
      expect(mockLoggerProvider.debug).toHaveBeenCalledWith(
        "Iniciando processo de atualização do avatar do usuário",
        expect.objectContaining({
          service: "UserUpdateAvatarService",
          method: "updateAvatar",
          metadata: expect.objectContaining({
            userId: avatarData.id,
          }),
        }),
      );

      expect(mockLoggerProvider.trace).toHaveBeenCalledWith(
        "Dados sanitizados com sucesso",
        expect.objectContaining({
          metadata: expect.objectContaining({
            sanitizedData: sanitizedAvatarData,
          }),
        }),
      );

      expect(mockLoggerProvider.debug).toHaveBeenCalledWith(
        "Dados validados com sucesso",
        expect.anything(),
      );

      expect(mockLoggerProvider.info).toHaveBeenCalledWith(
        "Avatar do usuário atualizado com sucesso",
        expect.objectContaining({
          metadata: expect.objectContaining({
            userId: sanitizedAvatarData.id,
          }),
        }),
      );
    });

    it("deve propagar erro quando a validação falha", async () => {
      // Arrange
      const validationError = new InvalidParamError(
        "avatarUrl",
        "formato inválido",
      );
      mockUserAvatarDataValidator.validate.mockRejectedValue(validationError);

      // Act & Assert
      await expect(
        userUpdateAvatarService.updateAvatar(avatarData),
      ).rejects.toThrow(validationError);

      // Verify sanitization was called
      expect(mockUserAvatarDataSanitizer.sanitize).toHaveBeenCalledWith(
        avatarData,
      );

      // Verify validation was called
      expect(mockUserAvatarDataValidator.validate).toHaveBeenCalledWith(
        sanitizedAvatarData,
      );

      // Verify repository was NOT called (because validation failed)
      expect(mockUserRepository.updateAvatar).not.toHaveBeenCalled();

      // Verify error was logged
      expect(mockLoggerProvider.error).toHaveBeenCalledWith(
        "Erro ao atualizar o avatar do usuário",
        expect.objectContaining({
          metadata: expect.objectContaining({
            error: expect.objectContaining({
              name: validationError.name,
              message: validationError.message,
            }),
          }),
        }),
      );
    });

    it("deve propagar erro quando o repositório falha", async () => {
      // Arrange
      const repositoryError = new Error(
        "Falha na conexão com o banco de dados",
      );
      mockUserRepository.updateAvatar.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(
        userUpdateAvatarService.updateAvatar(avatarData),
      ).rejects.toThrow(repositoryError);

      // Verify sanitization and validation were called
      expect(mockUserAvatarDataSanitizer.sanitize).toHaveBeenCalledWith(
        avatarData,
      );
      expect(mockUserAvatarDataValidator.validate).toHaveBeenCalledWith(
        sanitizedAvatarData,
      );

      // Verify repository was called
      expect(mockUserRepository.updateAvatar).toHaveBeenCalledWith(
        sanitizedAvatarData,
      );

      // Verify error was logged
      expect(mockLoggerProvider.error).toHaveBeenCalledWith(
        "Erro ao atualizar o avatar do usuário",
        expect.objectContaining({
          metadata: expect.objectContaining({
            error: expect.objectContaining({
              name: repositoryError.name,
              message: repositoryError.message,
            }),
          }),
        }),
      );
    });

    it("deve lidar com dados nulos ou indefinidos", async () => {
      // Arrange
      const nullData = null as unknown as UserAvatarData;
      mockUserAvatarDataSanitizer.sanitize.mockReturnValue(
        {} as UserAvatarData,
      );

      // Configure o validador para rejeitar o objeto vazio
      const validationError = new InvalidParamError("id", "é obrigatório");
      mockUserAvatarDataValidator.validate.mockRejectedValue(validationError);

      // Act & Assert
      await expect(
        userUpdateAvatarService.updateAvatar(nullData),
      ).rejects.toThrow(validationError);

      // Verify sanitization was called with null data
      expect(mockUserAvatarDataSanitizer.sanitize).toHaveBeenCalledWith(
        nullData,
      );

      // Verify validation was called with empty object
      expect(mockUserAvatarDataValidator.validate).toHaveBeenCalledWith({});

      // Verify repository was NOT called
      expect(mockUserRepository.updateAvatar).not.toHaveBeenCalled();

      // Verify error was logged
      expect(mockLoggerProvider.error).toHaveBeenCalledWith(
        "Erro ao atualizar o avatar do usuário",
        expect.objectContaining({
          metadata: expect.objectContaining({
            error: expect.objectContaining({
              name: validationError.name,
              message: validationError.message,
            }),
          }),
        }),
      );
    });

    it("deve registrar logs de trace com dados sanitizados", async () => {
      // Act
      await userUpdateAvatarService.updateAvatar(avatarData);

      // Assert - verify trace log with sanitized data
      expect(mockLoggerProvider.trace).toHaveBeenCalledWith(
        "Dados sanitizados com sucesso",
        expect.objectContaining({
          metadata: expect.objectContaining({
            sanitizedData: sanitizedAvatarData,
          }),
        }),
      );
    });

    it("deve tratar corretamente erros na sanitização", async () => {
      // Arrange
      const sanitizationError = new Error("Erro na sanitização");
      mockUserAvatarDataSanitizer.sanitize.mockImplementation(() => {
        throw sanitizationError;
      });

      // Act & Assert
      await expect(
        userUpdateAvatarService.updateAvatar(avatarData),
      ).rejects.toThrow(sanitizationError);

      // Verify sanitization was attempted
      expect(mockUserAvatarDataSanitizer.sanitize).toHaveBeenCalledWith(
        avatarData,
      );

      // Verify validation and repository were NOT called
      expect(mockUserAvatarDataValidator.validate).not.toHaveBeenCalled();
      expect(mockUserRepository.updateAvatar).not.toHaveBeenCalled();

      // Verify error was logged
      expect(mockLoggerProvider.error).toHaveBeenCalledWith(
        "Erro ao atualizar o avatar do usuário",
        expect.objectContaining({
          metadata: expect.objectContaining({
            error: expect.objectContaining({
              name: sanitizationError.name,
              message: sanitizationError.message,
            }),
          }),
        }),
      );
    });
  });
});
