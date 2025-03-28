import { ApplicationError } from "@/domain/errors";

/**
 * Erro lançado quando as credenciais de autenticação informadas são inválidas
 *
 * Esta classe representa erros de validação para parâmetros que foram
 * fornecidos, mas contêm valores inválidos ou em formato incorreto.
 * Estende a classe base ApplicationError e define um código de status HTTP 400
 * (Bad Request), adequado para erros de validação de entrada.
 *
 * @remarks
 * Este erro deve ser utilizado em camadas de validação, como middlewares,
 * controladores ou casos de uso, para indicar claramente quais parâmetros
 * estão com valores inválidos e, opcionalmente, o motivo da invalidação.
 *
 * @example
 *
 * // Erro básico de parâmetro inválido
 * throw new InvalidCredentialError();
 * // Resultado: "Credenciais inválidas: Email/Senha."
 *
 * @extends {ApplicationError}
 */
export class InvalidCredentialsError extends ApplicationError {
  /**
   * Cria uma nova instância de InvalidCredentialsError
   *
   * @param {string} [reason] - Razão opcional para o parâmetro ser inválido
   */
  constructor(reason?: string) {
    let message: string;

    if (reason && reason.trim() !== "") {
      const capitalizedReason =
        reason.charAt(0).toUpperCase() + reason.slice(1);
      message = `Credenciais inválidas: Email/Senha. ${capitalizedReason}.`;
    } else {
      message = `Credenciais inválidas: Email/Senha.`;
    }
    super(message, 401);
  }
}
