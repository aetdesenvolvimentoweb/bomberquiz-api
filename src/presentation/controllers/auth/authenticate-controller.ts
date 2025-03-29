import { AuthenticateService } from "@/data/services";
import { AuthData } from "@/domain/entities/auth";
import { MissingParamError } from "@/domain/errors";
import { handleError, ok } from "@/presentation/helpers";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/presentation/protocols";

/**
 * @interface AuthenticateControllerProps
 * @description Props necessárias para inicializar o controller de autenticação
 */
interface AuthenticateControllerProps {
  /** Caso de uso para autenticação de usuários */
  authenticateService: AuthenticateService;
}

/**
 * @class UserAuthenticateController
 * @implements {Controller<AuthData>}
 * @description Controller responsável por processar requisições de autenticação de usuários
 *
 * Este controller valida os dados de entrada (email e senha), invoca o caso de uso
 * de autenticação e retorna o resultado ou trata os erros apropriadamente.
 */
export class AuthenticateController implements Controller<AuthData> {
  /**
   * @constructor
   * @param {AuthenticateControllerProps} props - Dependências do controller
   */
  constructor(private readonly props: AuthenticateControllerProps) {}

  /**
   * @method handle
   * @description Processa a requisição HTTP de autenticação de usuário
   * @param {HttpRequest<AuthData>} request - Requisição HTTP contendo email e senha
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
    request: HttpRequest<AuthData>,
  ): Promise<HttpResponse> => {
    const { authenticateService } = this.props;

    try {
      if (!request.body) {
        throw new MissingParamError("corpo da requisição não informado");
      }

      const { email, password } = request.body;

      const authResult = await authenticateService.authenticate({
        email,
        password,
      });

      return ok(authResult);
    } catch (error) {
      return handleError(error);
    }
  };
}
