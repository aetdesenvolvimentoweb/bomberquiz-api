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
 *
 * ## Exemplos de Uso
 *
 *
 * // Importação direta do serviço específico
 * import { UserCreateService } from "@/data/services/user";
 *
 *
 * @see UserCreateService
 * @see UserListService
 */

/** Exporta o serviço de criação de usuários */
export * from "./user-create";

/** Exporta o serviço de listagem de usuários */
export * from "./user-list";

/** Exporta o serviço de atualização do avatar dos usuários */
export * from "./user-update-avatar";
