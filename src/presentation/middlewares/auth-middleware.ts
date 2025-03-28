import { InvalidParamError, MissingParamError } from "@/domain/errors";
import { JwtProvider } from "@/domain/providers/jwt-provider";
import { handleError, ok } from "@/presentation/helpers";
import { HttpRequest, HttpResponse } from "@/presentation/protocols";

/**
 * @interface AuthMiddlewareProps
 * @description Dependências necessárias para o funcionamento do middleware de autenticação
 */
interface AuthMiddlewareProps {
  /** Provedor JWT para verificação e validação de tokens */
  jwtProvider: JwtProvider;
}

/**
 * @class AuthMiddleware
 * @description Middleware que implementa a verificação de autenticação via token JWT
 *
 * Este middleware extrai o token do cabeçalho Authorization, valida o formato,
 * verifica a autenticidade via JwtProvider e extrai as informações do usuário.
 */
export class AuthMiddleware {
  /**
   * @constructor
   * @param {AuthMiddlewareProps} props - Objeto contendo as dependências necessárias
   */
  constructor(private readonly props: AuthMiddlewareProps) {}

  /**
   * @method handle
   * @description Processa uma requisição HTTP e verifica a autenticação
   *
   * @param {HttpRequest} request - A requisição HTTP a ser processada
   * @returns {Promise<HttpResponse>} Resposta HTTP com dados do usuário ou erro
   *
   * @throws {MissingParamError} Quando o token não está presente no cabeçalho
   * @throws {InvalidParamError} Quando o formato do token é inválido
   *
   * @example
   * const middleware = new AuthMiddleware({ jwtProvider });
   * const response = await middleware.handle({ headers: req.headers });
   *
   * if (response.statusCode === 200) {
   *   // Usuário autenticado, dados disponíveis em response.body
   *   const { userId, userRole } = response.body;
   * } else {
   *   // Falha na autenticação
   * }
   */
  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      // Utilizamos uma abordagem mais segura na verificação do cabeçalho
      /* istanbul ignore next */
      const authHeader = request.headers
        ? (request.headers as Record<string, string>)["authorization"]
        : undefined;

      if (!authHeader) {
        throw new MissingParamError("token de autenticação");
      }

      const [bearer, token] = authHeader.split(" ");

      if (bearer !== "Bearer" || !token) {
        throw new InvalidParamError("token", "formato inválido");
      }

      const payload = await this.props.jwtProvider.verify(token);

      // Adiciona os dados do usuário autenticado ao request
      return ok({
        userId: payload.userId,
        userRole: payload.role,
      });
    } catch (error) {
      return handleError(error);
    }
  }
}
