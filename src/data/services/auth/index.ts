/**
 * @module data/services/auth
 * @description Módulo de exportação para serviços relacionados a autenticação
 *
 * Este arquivo centraliza a exportação de todos os serviços de autenticação
 * implementados na camada de dados, seguindo o padrão de barril (barrel pattern).
 * Isso facilita a importação de serviços específicos de usuário em outros
 * módulos da aplicação.
 *
 * ## Serviços Exportados
 *
 * - **UserAuthenticateService**: Autenticação de usuários
 *
 * ## Exemplos de Uso
 *
 * const authService = new UserAuthenticateService({
 *   userRepository,
 *   hashProvider,
 *   jwtProvider,
 *   loggerProvider
 * });
 *
 * const { user, accessToken } = await authService.authenticate({
 *   email: "usuario@exemplo.com",
 *   password: "senha123"
 * });
 *
 *
 * @see UserAuthenticateService
 */

/** Exporta o serviço de autenticação de usuários */
export * from "./authenticate";
