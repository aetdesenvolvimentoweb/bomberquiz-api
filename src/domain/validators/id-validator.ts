/**
 * Interface para validação de Ids
 *
 * Define o contrato para implementações que validam o ID
 * fornecido durante atualização, exclusão e consulta no sistema. Esta interface
 * segue o princípio de inversão de dependência (DIP), permitindo que a camada
 * de domínio defina o contrato enquanto a implementação concreta é fornecida
 * pela camada de infraestrutura.
 *
 * @interface
 */
export interface IdValidatorUseCase {
  /**
   * Valida o Id fornecido
   *
   * @param {string} id - Id a ser validado
   * @returns {void} Não retorna valor, mas lança exceção se o Id for inválido
   *
   * @throws {MissingParamError} Quando o Id não é fornecido
   * @throws {InvalidParamError} Quando o Id não atende aos critérios de validação
   */
  validate: (id: string) => void;
}
