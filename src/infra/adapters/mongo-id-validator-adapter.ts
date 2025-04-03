import { ObjectId } from "mongodb";

import { InvalidParamError, ServerError } from "@/domain/errors";
import { IdValidatorUseCase } from "@/domain/validators";

/**
 * Implementação concreta do validador de id usando a biblioteca mongodb
 *
 * Esta classe implementa a lógica de validação de Ids,
 * verificando o formato do mesmo.
 *
 * @implements {IdValidatorUseCase}
 */
export class MongoIdValidatorAdapter implements IdValidatorUseCase {
  /**
   * Valida um Id
   *
   * @param {string} id - Id a ser validado
   * @returns {void} Não retorna valor, mas lança exceção se o Id for inválido
   * @throws {MissingParamError} Quando o Id não é informado
   * @throws {InvalidParamError} Quando o Id não atende aos critérios de validação
   * @throws {UnregisteredParamError} Quando o Id não está registrado no sistema
   */
  validate(id: string): void {
    try {
      // Verifica se o formato é válido usando a biblioteca mongodb
      if (!ObjectId.isValid(id)) {
        throw new InvalidParamError("id", "formato inválido");
      }
    } catch (error) {
      // Se o erro já é um ServerError ou um InvalidParamError, propaga
      if (error instanceof ServerError || error instanceof InvalidParamError) {
        throw error;
      }

      // Para outros erros da biblioteca, converte para ServerError
      throw new ServerError(error as Error);
    }
  }
}
