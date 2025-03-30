/**
 * Testes unitários para a classe UnregisterParamError
 *
 * Este arquivo contém testes que verificam o comportamento da classe
 * UnregisterParamError, que é utilizada para indicar erros de validação
 * quando parâmetros não estão registrados no sistema.
 *
 * @group Unit
 * @group Errors
 * @group Validation
 */

import { ApplicationError, UnregisteredParamError } from "@/domain/errors";

describe("UnregisterParamError", () => {
  describe("constructor", () => {
    it("deve criar uma instância com a mensagem formatada corretamente", () => {
      // Act
      const error = new UnregisteredParamError("id");

      // Assert
      expect(error.message).toBe(
        "Não foram encontrados registros para esse(a) Id.",
      );
    });

    it("deve definir o statusCode como 404 (Not Found)", () => {
      // Arrange & Act
      const error = new UnregisteredParamError("id");

      // Assert
      expect(error.statusCode).toBe(404);
    });

    it("deve ser uma instância de ApplicationError", () => {
      // Arrange & Act
      const error = new UnregisteredParamError("id");

      // Assert
      expect(error).toBeInstanceOf(ApplicationError);
    });

    it("deve definir o nome da propriedade como o nome da classe", () => {
      // Arrange & Act
      const error = new UnregisteredParamError("id");

      // Assert
      expect(error.name).toBe("UnregisteredParamError");
    });
  });
});
