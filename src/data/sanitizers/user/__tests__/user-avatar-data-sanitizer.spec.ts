/**
 * Testes unitários para a classe UserAvatarDataSanitizer
 *
 * Este arquivo contém testes que verificam o comportamento da implementação
 * UserAvatarDataSanitizer do contrato UserAvatarDataSanitizerUseCase.
 *
 * @group Unit
 * @group Sanitizers
 * @group User
 */

import { UserAvatarDataSanitizer } from "@/data/sanitizers";
import { UserAvatarData } from "@/domain/entities";

describe("UserAvatarDataSanitizer", () => {
  let sanitizer: UserAvatarDataSanitizer;

  beforeEach(() => {
    sanitizer = new UserAvatarDataSanitizer();
  });

  describe("sanitize method", () => {
    it("deve retornar um objeto vazio quando o input for null ou undefined", () => {
      // Act
      const result1 = sanitizer.sanitize(null as unknown as UserAvatarData);
      const result2 = sanitizer.sanitize(
        undefined as unknown as UserAvatarData,
      );

      // Assert
      expect(result1).toEqual({});
      expect(result2).toEqual({});
    });

    it("deve sanitizar corretamente todos os campos de um objeto completo", () => {
      // Arrange
      const inputData: UserAvatarData = {
        id: "  any_id  ",
        avatarUrl: " hTTps://wWw.TEST.com ",
      };

      // Act
      const result = sanitizer.sanitize(inputData);

      // Assert
      expect(result).toEqual({
        id: "any_id",
        avatarUrl: "https://www.test.com",
      });
    });
  });

  describe("sanitizeId method", () => {
    it("deve normalizar Ids corretamente", () => {
      // Arrange
      const avatarUrl = "https://www.test.com";
      const testCases = [
        {
          inputData: { id: "  any_id  ", avatarUrl } as UserAvatarData,
          expected: "any_id",
        },
        {
          inputData: { id: "any_id", avatarUrl } as UserAvatarData,
          expected: "any_id",
        },
        { inputData: { id: "", avatarUrl } as UserAvatarData, expected: "" },
        {
          inputData: {
            id: null as unknown as string,
            avatarUrl,
          } as UserAvatarData,
          expected: "",
        },
        {
          inputData: {
            id: undefined as unknown as string,
            avatarUrl,
          } as UserAvatarData,
          expected: "",
        },
      ];

      // Act & Assert
      testCases.forEach(({ inputData, expected }) => {
        const result = sanitizer.sanitize(inputData);
        expect(result.id).toBe(expected);
      });
    });
  });

  describe("sanitizeAvatarUrl method", () => {
    it("deve normalizar Ids corretamente", () => {
      // Arrange
      const id = "any_id";
      const testCases = [
        {
          inputData: {
            id,
            avatarUrl: "  https://wWw.TEST.Com  ",
          } as UserAvatarData,
          expected: "https://www.test.com",
        },
        {
          inputData: {
            id,
            avatarUrl: "https://www.test.com",
          } as UserAvatarData,
          expected: "https://www.test.com",
        },
        { inputData: { id, avatarUrl: "" } as UserAvatarData, expected: "" },
        {
          inputData: {
            id,
            avatarUrl: null as unknown as string,
          } as UserAvatarData,
          expected: "",
        },
        {
          inputData: {
            id,
            avatarUrl: undefined as unknown as string,
          } as UserAvatarData,
          expected: "",
        },
      ];

      // Act & Assert
      testCases.forEach(({ inputData, expected }) => {
        const result = sanitizer.sanitize(inputData);
        expect(result.avatarUrl).toBe(expected);
      });
    });
  });
});
