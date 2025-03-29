/**
 * Interface para validação da url do avatar do usuário
 *
 * Define o contrato para implementações que validam a url
 * fornecida durante a atualização do avatar de um usuário.
 * Esta interface segue o princípio de inversão de dependência (DIP),
 * permitindo que a camada de domínio defina o contrato
 * enquanto a implementação concreta é fornecida pela camada de infraestrutura.
 *
 * @interface
 */
export interface UserAvatarUrlValidatorUseCase {
  /**
   * Valida a url do avatar de um usuário
   *
   * @param {string} avatarUrl - Url a ser validada
   * @returns {void} Não retorna valor, mas lança exceção se a url for inválida
   *
   * @throws {MissingParamError} Quando a url não é fornecida
   * @throws {InvalidParamError} Quando a url não atende aos critérios de validação
   */
  validate: (avatarUrl: string) => void;
}
