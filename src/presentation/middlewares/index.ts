/**
 * Módulo de exportação para middlewares da camada de apresentação
 *
 * Este arquivo centraliza a exportação de todos os middlewares da aplicação,
 * seguindo o padrão de barril (barrel pattern). Isso permite importar qualquer
 * middleware a partir de um único ponto de entrada, simplificando as importações
 * em outros módulos da aplicação.
 *
 * Os middlewares são componentes essenciais para o processamento de requisições HTTP,
 * executando operações intermediárias como autenticação, validação, logging, e
 * transformação de dados antes que a requisição chegue aos controladores.
 *
 * @module presentation/middlewares
 *
 * @example
 *
 * // Importação simplificada de middlewares
 * import { AuthMiddleware } from "@/presentation/middlewares";
 *
 * // Uso em uma configuração de rota
 * router.get('/protected-resource',
 *   (req, res, next) => authMiddlewareAdapter(new AuthMiddleware(loadUserByToken))(req, res, next),
 *   (req, res) => controllerAdapter(new ProtectedResourceController())
 * );
 */

/**
 * Exporta o middleware de autenticação responsável pela validação de tokens
 * e autorização de acesso a rotas protegidas da API.
 */
export * from "./auth-middleware";
