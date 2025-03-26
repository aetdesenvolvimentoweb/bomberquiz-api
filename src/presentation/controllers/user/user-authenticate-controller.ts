import { MissingParamError } from "@/domain/errors";
import {
  UserAuthenticateUseCase,
  UserAuthenticationData,
} from "@/domain/usecases/user/user-authenticate-usecase";
import { handleError, ok } from "@/presentation/helpers";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/presentation/protocols";

/**
 * @interface UserAuthenticateControllerProps
 * @description Props necessárias para inicializar o controller de autenticação
 */
interface UserAuthenticateControllerProps {
  /** Caso de uso para autenticação de usuários */
  userAuthenticateUseCase: UserAuthenticateUseCase;
}

/**
 * @class UserAuthenticateController
 * @implements {Controller<UserAuthenticationData>}
 * @description Controller responsável por processar requisições de autenticação de usuários
 *
 * Este controller valida os dados de entrada (email e senha), invoca o caso de uso
 * de autenticação e retorna o resultado ou trata os erros apropriadamente.
 */
export class UserAuthenticateController
  implements Controller<UserAuthenticationData>
{
  /**
   * @constructor
   * @param {UserAuthenticateControllerProps} props - Dependências do controller
   */
  constructor(private readonly props: UserAuthenticateControllerProps) {}

  /**
   * @method handle
   * @description Processa a requisição HTTP de autenticação de usuário
   * @param {HttpRequest<UserAuthenticationData>} request - Requisição HTTP contendo email e senha
   * @returns {Promise<HttpResponse>} Resposta HTTP com o resultado da autenticação ou erro
   *
   * @throws {MissingParamError} Quando parâmetros obrigatórios estão ausentes
   *
   * @example
   * // Exemplo de uso em uma rota
   * router.post('/login', async (req, res) => {
   *   const httpResponse = await authenticateController.handle({
   *     body: req.body
   *   });
   *
   *   res.status(httpResponse.statusCode).json(httpResponse.body);
   * });
   */
  public readonly handle = async (
    request: HttpRequest<UserAuthenticationData>,
  ): Promise<HttpResponse> => {
    const { userAuthenticateUseCase } = this.props;

    try {
      if (!request.body) {
        throw new MissingParamError("corpo da requisição não informado");
      }

      const { email, password } = request.body;

      const authResult = await userAuthenticateUseCase.authenticate({
        email,
        password,
      });

      return ok(authResult);
    } catch (error) {
      return handleError(error);
    }
  };
}
