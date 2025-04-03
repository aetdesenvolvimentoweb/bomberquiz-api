/**
 * Testes unitários para a classe MongoIdValidatorAdapter
 *
 * Este arquivo contém testes que verificam o comportamento da implementação
 * MongoIdValidatorAdapter do contrato IdValidatorUseCase.
 *
 * @group Unit
 * @group Adapters
 * @group Validators
 */

import { ObjectId } from "mongodb";

import { InvalidParamError, ServerError } from "@/domain/errors";
import { MongoIdValidatorAdapter } from "@/infra/adapters";

// Mock da biblioteca mongodb
jest.mock("mongodb", () => ({
  ObjectId: {
    isValid: jest.fn(),
  },
}));

describe("MongoIdValidatorAdapter", () => {
  let validator: MongoIdValidatorAdapter;

  beforeEach(() => {
    // Limpar mocks antes de cada teste
    jest.clearAllMocks();

    // Criar instância do validador
    validator = new MongoIdValidatorAdapter();

    // Configuração padrão para o mock
    (ObjectId.isValid as jest.Mock).mockReturnValue(true);
  });

  it("deve aceitar um ID válido", () => {
    // Arrange
    const validId = "507f1f77bcf86cd799439011";
    (ObjectId.isValid as jest.Mock).mockReturnValue(true);

    // Act & Assert
    expect(() => validator.validate(validId)).not.toThrow();
    expect(ObjectId.isValid).toHaveBeenCalledWith(validId);
  });

  it("deve lançar InvalidParamError quando o ID é inválido", () => {
    // Arrange
    const invalidId = "invalid-id";
    (ObjectId.isValid as jest.Mock).mockReturnValue(false);
    const errorReason = "formato inválido";

    // Act & Assert
    expect(() => validator.validate(invalidId)).toThrow(InvalidParamError);
    expect(() => validator.validate(invalidId)).toThrow(
      new InvalidParamError("id", errorReason),
    );
    expect(ObjectId.isValid).toHaveBeenCalledWith(invalidId);
  });

  it("deve converter erros inesperados da biblioteca para ServerError", () => {
    // Arrange
    const id = "507f1f77bcf86cd799439011";
    const genericError = new Error("Erro genérico da biblioteca");

    // Simular a biblioteca lançando um erro
    (ObjectId.isValid as jest.Mock).mockImplementation(() => {
      throw genericError;
    });

    // Act & Assert
    expect(() => validator.validate(id)).toThrow(ServerError);
    try {
      validator.validate(id);
    } catch (error) {
      expect(error).toBeInstanceOf(ServerError);
      expect((error as ServerError).message).toContain(
        "Erro genérico da biblioteca",
      );
    }
    expect(ObjectId.isValid).toHaveBeenCalledWith(id);
  });

  it("deve propagar InvalidParamError sem convertê-lo", () => {
    // Arrange
    const id = "507f1f77bcf86cd799439011";
    const specificError = new InvalidParamError("id", "erro específico");

    // Simular função lançando um InvalidParamError
    (ObjectId.isValid as jest.Mock).mockImplementation(() => {
      throw specificError;
    });

    // Act & Assert
    expect(() => validator.validate(id)).toThrow(specificError);
    expect(() => validator.validate(id)).toThrow(InvalidParamError);
    expect(ObjectId.isValid).toHaveBeenCalledWith(id);
  });

  it("deve propagar ServerError sem convertê-lo", () => {
    // Arrange
    const id = "507f1f77bcf86cd799439011";
    const serverError = new ServerError(new Error("erro interno"));

    // Simular função lançando um ServerError
    (ObjectId.isValid as jest.Mock).mockImplementation(() => {
      throw serverError;
    });

    // Act & Assert
    expect(() => validator.validate(id)).toThrow(serverError);
    expect(() => validator.validate(id)).toThrow(ServerError);
    expect(ObjectId.isValid).toHaveBeenCalledWith(id);
  });

  it("deve testar diferentes formatos de IDs", () => {
    // Arrange
    const testCases = [
      { id: "507f1f77bcf86cd799439011", valid: true }, // ID válido
      { id: "invalid-id", valid: false }, // ID inválido - formato errado
      { id: "123456", valid: false }, // ID inválido - muito curto
      { id: "", valid: false }, // ID inválido - vazio
    ];

    // Act & Assert
    testCases.forEach(({ id, valid }) => {
      (ObjectId.isValid as jest.Mock).mockReturnValue(valid);

      if (valid) {
        expect(() => validator.validate(id)).not.toThrow();
      } else {
        expect(() => validator.validate(id)).toThrow(InvalidParamError);
      }

      expect(ObjectId.isValid).toHaveBeenCalledWith(id);
      jest.clearAllMocks();
    });
  });
});
