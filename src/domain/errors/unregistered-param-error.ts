import { ApplicationError } from "@/domain/errors";

/**
 * Erro lançado quando um parâmetro não está registrado no sistema
 *
 * Esta classe representa erros de validação para parâmetros que foram
 * fornecidos, contêm valores válidos e formato correto,
 * porém não estão registrados no sistema.
 * Estende a classe base ApplicationError e define um código de status HTTP 404
 * (Not Found), adequado para erros de validação de entrada.
 *
 * @remarks
 * Este erro deve ser utilizado em camadas de validação, como middlewares,
 * controladores ou casos de uso, para indicar claramente quais parâmetros
 * não estão registrados no sistema.
 *
 * @example
 *
 * // Erro básico de parâmetro não registrado
 * throw new UnregisterError("id");
 * // Resultado: "Não foram encontrados registros para esse(a) id."
 *
 *
 * @extends {ApplicationError}
 */
export class UnregisteredParamError extends ApplicationError {
  /**
   * Cria uma nova instância de UnregisteredParamError
   *
   * @param {string} param - Nome do parâmetro que não está registrado
   */
  constructor(param: string) {
    const capitalizedParam = param.charAt(0).toUpperCase() + param.slice(1);

    super(
      `Não foram encontrados registros para esse(a) ${capitalizedParam}.`,
      404,
    );
  }
}
