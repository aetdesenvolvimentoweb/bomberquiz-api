import jwt from "jsonwebtoken";

import { InvalidParamError, ServerError } from "@/domain/errors";
import { JwtProvider } from "@/domain/providers";
import { JsonWebTokenProvider } from "@/infra/providers";

describe("JsonWebTokenProvider", () => {
  // Constantes reutilizáveis para os testes
  const SECRET_KEY = "secret_key";
  const VALID_PAYLOAD = {
    userId: "123",
    email: "john.doe@example.com",
    role: "user",
  };

  // Factory function para criar o SUT (System Under Test)
  const makeSut = (): JwtProvider => {
    return new JsonWebTokenProvider(SECRET_KEY);
  };

  describe("sign", () => {
    it("should return a signed JWT token", async () => {
      // Arrange
      const sut = makeSut();

      // Act
      const token = await sut.sign(VALID_PAYLOAD);

      // Assert
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      // Verificação adicional: o token pode ser decodificado
      const decoded = jwt.verify(token, SECRET_KEY);
      expect(decoded).toMatchObject(VALID_PAYLOAD);
    });

    it("should throw ServerError if jwt.sign throws", async () => {
      // Arrange
      const sut = makeSut();
      const signError = new Error("Sign error");
      jest.spyOn(jwt, "sign").mockImplementation(() => {
        throw signError;
      });

      // Act & Assert
      await expect(sut.sign(VALID_PAYLOAD)).rejects.toThrow(ServerError);
      await expect(sut.sign(VALID_PAYLOAD)).rejects.toThrow(
        `Erro inesperado do servidor. ${signError.message}`,
      );
    });
  });

  describe("verify", () => {
    it("should return the decoded payload when token is valid", async () => {
      // Arrange
      const sut = makeSut();
      const token = await sut.sign(VALID_PAYLOAD);

      // Act
      const result = await sut.verify(token);

      // Assert
      expect(result).toMatchObject(VALID_PAYLOAD);
    });

    it("should throw InvalidParamError if token is not provided", async () => {
      // Arrange
      const sut = makeSut();
      const emptyToken = "";

      // Act & Assert
      await expect(sut.verify(emptyToken)).rejects.toThrow(InvalidParamError);
      await expect(sut.verify(emptyToken)).rejects.toThrow(
        "Parâmetro inválido: Token. Não fornecido.",
      );
    });

    it("should throw InvalidParamError if the token is invalid", async () => {
      // Arrange
      const sut = makeSut();
      const invalidToken = "invalid-token";

      // Act & Assert
      await expect(sut.verify(invalidToken)).rejects.toThrow(InvalidParamError);
      await expect(sut.verify(invalidToken)).rejects.toThrow(
        "Parâmetro inválido: Token. Inválido ou expirado.",
      );
    });

    it("should throw ServerError if an unexpected error occurs during verification", async () => {
      // Arrange
      const sut = makeSut();
      const unexpectedError = new Error("Unexpected error");
      jest.spyOn(jwt, "verify").mockImplementation(() => {
        throw new ServerError(unexpectedError);
      });

      // Act & Assert
      await expect(sut.verify("valid-looking-token")).rejects.toThrow(
        ServerError,
      );
      await expect(sut.verify("valid-looking-token")).rejects.toThrow(
        `Erro inesperado do servidor. ${unexpectedError.message}`,
      );
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
