/**
 * Testes unitários para o UserUpdateAvatarController
 *
 * Este arquivo contém testes que verificam o comportamento do controlador
 * responsável pela atualização do avatar do usuário, incluindo o fluxo feliz e
 * cenários de erro.
 *
 * @group Unit
 * @group Controllers
 * @group User
 */

import { UserUpdateAvatarService } from "@/data/services";
import { UserAvatarData } from "@/domain/entities";
import { DuplicateResourceError } from "@/domain/errors";
import { UserUpdateAvatarController } from "@/presentation/controllers";
import { HttpRequest } from "@/presentation/protocols";

// Mock do serviço de atualização de avatar do usuário
const mockUpdateAvatar = jest.fn();
const mockUserUpdateAvatarService = {
  updateAvatar: mockUpdateAvatar,
};

describe("UserUpdateAvatarController", () => {
  let userUpdateAvatarController: UserUpdateAvatarController;
  let avatarData: UserAvatarData;
  let httpRequest: HttpRequest<UserAvatarData>;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create controller instance with mocked dependencies
    // Usamos um type assertion para contornar o problema de tipagem
    // Isso é seguro no contexto de testes, pois estamos apenas mockando a interface
    userUpdateAvatarController = new UserUpdateAvatarController({
      userUpdateAvatarService:
        mockUserUpdateAvatarService as unknown as UserUpdateAvatarService,
    });

    // Sample avatar data
    avatarData = {
      id: "user-123",
      avatarUrl: "https://example.com/avatar.jpg",
    };

    // Sample HTTP request
    httpRequest = {
      body: avatarData,
    };

    // Default mock implementation
    mockUpdateAvatar.mockResolvedValue(undefined);
  });

  describe("handle method", () => {
    /**
     * Verifica se o controlador retorna status 201 e resposta de sucesso
     * quando o avatar do usuário é atualizado com sucesso
     */
    it("deve retornar 201 e success=true quando o avatar é atualizado com sucesso", async () => {
      // Act
      const httpResponse = await userUpdateAvatarController.handle(httpRequest);

      // Assert
      expect(httpResponse.statusCode).toBe(201);
      expect(httpResponse.body.success).toBe(true);
      expect(httpResponse.body.metadata.timestamp).toBeDefined();

      // Verify service was called with correct data
      expect(mockUpdateAvatar).toHaveBeenCalledWith(avatarData);
    });

    /**
     * Verifica se o controlador retorna status 400 quando não há corpo na requisição
     */
    it("deve retornar 400 quando a requisição não contém um corpo", async () => {
      // Arrange
      const requestWithoutBody: HttpRequest = {};

      // Act
      const httpResponse =
        await userUpdateAvatarController.handle(requestWithoutBody);

      // Assert
      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body.success).toBe(false);
      expect(httpResponse.body.errorMessage).toBe(
        "Parâmetro obrigatório não informado: Corpo da requisição não informado",
      );

      // Verify service was not called
      expect(mockUpdateAvatar).not.toHaveBeenCalled();
    });

    it("deve retornar o status adequado quando ocorre um ApplicationError", async () => {
      // Arrange
      const duplicateError = new DuplicateResourceError("avatar");
      mockUpdateAvatar.mockRejectedValue(duplicateError);

      // Act
      const httpResponse = await userUpdateAvatarController.handle(httpRequest);

      // Assert
      expect(httpResponse.statusCode).toBe(409); // Conflict status from DuplicateResourceError
      expect(httpResponse.body.success).toBe(false);
      expect(httpResponse.body.errorMessage).toBe(
        "Avatar já cadastrado no sistema",
      );
    });

    it("deve retornar 500 quando ocorre um erro não tratado (Error)", async () => {
      // Arrange
      const unexpectedError = new Error("Erro inesperado");
      mockUpdateAvatar.mockRejectedValue(unexpectedError);

      // Act
      const httpResponse = await userUpdateAvatarController.handle(httpRequest);

      // Assert
      expect(httpResponse.statusCode).toBe(500);
      expect(httpResponse.body.success).toBe(false);
      expect(httpResponse.body.errorMessage).toContain("Erro inesperado");
    });

    it("deve retornar 500 quando ocorre um erro não tratado (não-Error)", async () => {
      // Arrange - usando um objeto simples como erro
      const nonErrorObject = { message: "Erro inesperado" };
      mockUpdateAvatar.mockRejectedValue(nonErrorObject);

      // Act
      const httpResponse = await userUpdateAvatarController.handle(httpRequest);

      // Assert
      expect(httpResponse.statusCode).toBe(500);
      expect(httpResponse.body.success).toBe(false);
      expect(httpResponse.body.errorMessage).toContain("Erro inesperado");
    });

    it("deve incluir timestamp na resposta em todos os cenários", async () => {
      // Act - Success case
      const successResponse =
        await userUpdateAvatarController.handle(httpRequest);

      // Arrange error case
      mockUpdateAvatar.mockRejectedValue(new Error("Qualquer erro"));

      // Act - Error case
      const errorResponse =
        await userUpdateAvatarController.handle(httpRequest);

      // Assert
      expect(successResponse.body.metadata.timestamp).toBeDefined();
      expect(errorResponse.body.metadata.timestamp).toBeDefined();

      // Verify timestamps are in ISO format
      expect(Date.parse(successResponse.body.metadata.timestamp)).not.toBeNaN();
      expect(Date.parse(errorResponse.body.metadata.timestamp)).not.toBeNaN();
    });
  });
});
