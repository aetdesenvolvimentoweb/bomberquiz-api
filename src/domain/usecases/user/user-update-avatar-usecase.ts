import { UserAvatarData } from "@/domain/entities";

/**
 * Interface para o caso de uso de atualização do avatar do usuário
 *
 * Esta interface deve ser implementada por repositórios ou serviços
 * que têm a capacidade de persistir novos usuários.
 *
 * @interface
 *
 * @example
 * ```typescript
 * // Exemplo de implementação em um repositório
 * class UserRepositoryImpl implements UserUpdateAvatarUseCase {
 *   async updateAvatar(userAvatarData: UserAvatarData): Promise<void> {
 *     // Implementação da persistência do usuário
 *     await db.users.update({
 *       where: { id: userAvatarData.id },
 *       data: {
 *         avatarUrl: userAvatarData.avatarUrl
 *       }
 *     });
 *   }
 * }
 * ```
 */
export interface UserUpdateAvatarUseCase {
  /**
   * Atualiza o avatar do usuário no sistema
   *
   * Persiste a url do avatar do usário.
   *
   * @param {UserAvatarData} data - Dados necessários para criar um usuário
   * @returns {Promise<void>} Promise que resolve quando a operação é concluída com sucesso
   *
   * @throws {MissingParamError} Se algum parâmetro obrigatório não for fornecido
   * @throws {InvalidParamError} Se algum parâmetro fornecido for inválido
   * @throws {ServerError} Se ocorrer um erro durante a persistência
   */
  updateAvatar: (userAvatarData: UserAvatarData) => Promise<void>;
}
