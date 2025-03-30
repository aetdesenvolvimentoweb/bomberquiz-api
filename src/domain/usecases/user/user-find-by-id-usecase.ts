import { UserMapped } from "@/domain/entities";

/**
 * Interface para o caso de uso de busca de usuário por id
 *
 * Esta interface deve ser implementada por repositórios ou serviços
 * que têm acesso aos dados de usuários.
 *
 * @interface
 *
 * @example
 * ```typescript
 * // Exemplo de implementação em um repositório
 * class UserRepositoryImpl implements UserFindByIdUseCase {
 *   async findById(id: string): Promise<User | null> {
 *     // Implementação da busca por id
 *     const normalizedId = id.toLowerCase().trim();
 *     const result = await db.users.findFirst({ id: normalizedId });
 *     return result || null;
 *   }
 * }
 * ```
 *
 */
export interface UserFindByIdUseCase {
  /**
   * Busca um usuário pelo id
   *
   * Localiza um usuário no sistema utilizando seu id como
   * critério de busca.
   *
   * @param {string} id - Id do usuário a ser localizado
   * @returns {Promise<UserMapped | null>} Promise que resolve com o usuário encontrado sem o password ou null se não existir
   *
   * @throws {MissingParamError} se o id não for fornecido
   * @throws {InvalidParamError} Se o id fornecido for inválido
   * @throws {UnregisteredParamError} Se o id fornecido não estiver registrado no sistema
   * @throws {ServerError} Se ocorrer um erro durante a consulta
   */
  findById: (id: string) => Promise<UserMapped | null>;
}
