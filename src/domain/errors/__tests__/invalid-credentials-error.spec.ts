/**
 * Testes unitários para a classe InvalidCredentialsError
 *
 * Este arquivo contém testes que verificam o comportamento da classe
 * InvalidCredentialsError, que é utilizada para indicar erros de validação
 * quando parâmetros fornecidos contêm valores inválidos.
 *
 * @group Unit
 * @group Errors
 * @group Validation
 */

import { ApplicationError, InvalidCredentialsError } from "@/domain/errors";

describe("InvalidCredentialsError", () => {
  describe("constructor", () => {
    it("deve criar uma instância com a mensagem formatada corretamente sem razão", () => {
      // Act
      const error = new InvalidCredentialsError();

      // Assert
      expect(error.message).toBe(`Credenciais inválidas: Email/Senha.`);
    });

    it("deve criar uma instância com a mensagem formatada corretamente com razão", () => {
      // Arrange
      const reason = "Erro inesperado";

      // Act
      const error = new InvalidCredentialsError(reason);

      // Assert
      expect(error.message).toBe(
        `Credenciais inválidas: Email/Senha. Erro inesperado.`,
      );
    });

    it("deve definir o statusCode como 401 (Unauthorized)", () => {
      // Arrange & Act
      const error = new InvalidCredentialsError();

      // Assert
      expect(error.statusCode).toBe(401);
    });

    it("deve ser uma instância de ApplicationError", () => {
      // Arrange & Act
      const error = new InvalidCredentialsError("senha");

      // Assert
      expect(error).toBeInstanceOf(ApplicationError);
    });

    it("deve definir o nome da propriedade como o nome da classe", () => {
      // Arrange & Act
      const error = new InvalidCredentialsError();

      // Assert
      expect(error.name).toBe("InvalidCredentialsError");
    });
  });
});
