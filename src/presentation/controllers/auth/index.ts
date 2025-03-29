/**
 * Módulo de exportação para controladores de autenticação
 *
 * Este arquivo centraliza a exportação de todos os controladores relacionados
 * à autenticação, seguindo o padrão de barril (barrel pattern). Isso permite
 * importar qualquer controlador de autenticação a partir de um único ponto de entrada,
 * simplificando as importações em outros módulos.
 *
 *
 * @module presentation/controllers/auth
 *
 * @example
 * // Importação simplificada do controlador de autenticação
 * import { UserAuthenticateController } from "@/presentation/controllers/auth";
 *
 * // Configuração de rotas com factory
 * const makeUserAuthenticateController = () => {
 *   return new UserAuthenticateController({
 *     userAuthenticateService: makeUserAuthenticateService(),
 *     tokenGeneratorProvider: makeTokenGeneratorProvider()
 *   });
 * };
 *
 * // Registro da rota de autenticação
 * app.post('/api/auth/login', adaptRoute(makeUserAuthenticateController()));
 *
 * // Exemplo de uso do controlador
 * // O controlador recebe uma requisição com email e senha
 * // e retorna um token de autenticação em caso de sucesso
 * //
 * // Request:
 * // {
 * //   "body": {
 * //     "email": "usuario@exemplo.com",
 * //     "password": "senha123"
 * //   }
 * // }
 * //
 * // Response (sucesso):
 * // {
 * //   "statusCode": 200,
 * //   "body": {
 * //     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * //   }
 * // }
 *
 * @see {@link UserAuthenticateController} - Controlador para autenticação de usuários
 * @see {@link Controller} - Interface base para todos os controladores
 * @see {@link HttpRequest} - Interface para requisições HTTP padronizadas
 * @see {@link HttpResponse} - Interface para respostas HTTP padronizadas
 */

/** Exporta o controlador para autenticação de usuários */
export * from "./authenticate-controller";
