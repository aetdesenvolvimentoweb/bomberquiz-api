/**
 * @module data/services/user
 * @description Módulo de exportação para serviços relacionados a usuários
 *
 * Este arquivo centraliza a exportação de todos os serviços de usuário
 * implementados na camada de dados, seguindo o padrão de barril (barrel pattern).
 * Isso facilita a importação de serviços específicos de usuário em outros
 * módulos da aplicação.
 *
 * ## Serviços Exportados
 *
 * - **UserCreateService**: Criação de novos usuários
 * - **UserListService**: Listagem de usuários
 * - **UserAuthenticateService**: Autenticação de usuários
 *
 * ## Exemplos de Uso
 *
 *
 * // Importação direta do serviço específico
 * import { UserCreateService } from "@/data/services/user";
 *
 * // Uso do serviço de autenticação
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
 * @see UserCreateService
 * @see UserListService
 * @see UserAuthenticateService
 */

/** Exporta o serviço de criação de usuários */
export * from "./user-create";

/** Exporta o serviço de listagem de usuários */
export * from "./user-list";

/** Exporta o serviço de autenticação de usuários */
export * from "./user-authenticate";
