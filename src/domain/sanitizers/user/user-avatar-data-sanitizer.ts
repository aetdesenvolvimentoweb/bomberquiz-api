import { UserAvatarData } from "@/domain/entities";

/**
 * Interface para sanitização de dados de atualização do avatar do usuário
 *
 * Define o contrato para classes que implementam a lógica de sanitização
 * dos dados fornecidos durante a criação de um usuário. A sanitização
 * pode incluir normalização de formatos, remoção de espaços em branco,
 * padronização de valores, entre outros tratamentos.
 *
 * @remarks
 * A sanitização é uma etapa importante que ocorre antes da validação
 * dos dados, permitindo que entradas válidas em diferentes formatos
 * sejam normalizadas para um formato padrão. Isso melhora a experiência
 * do usuário e reduz erros de validação desnecessários.
 *
 * Exemplos de sanitização incluem:
 * - Normalização de e-mails (converter para minúsculas)
 * - Remoção de espaços em branco extras
 * - Formatação de números de telefone
 * - Padronização de nomes (capitalização adequada)
 *
 * @example
 *
 * class UserAvatarDataSanitizer implements UserAvatarDataSanitizerUseCase {
 *   sanitize(data: UserAvatarData): UserAvatarData {
 *     return {
 *       ...data,
 *       id: data.id?.trim(),
 *       avatarUrl: data.avatarUrl?.trim()
 *     };
 *   }
 * }
 *
 * // Uso em um serviço
 * class UserUpdateAvatarService {
 *   constructor(
 *     private sanitizer: UserAvatarDataSanitizerUseCase,
 *     private validator: UserAvatarDataValidator
 *   ) {}
 *
 *   async updateAvatar(userAvatarData: UserAvatarData) {
 *     // Sanitiza os dados antes da validação
 *     const sanitizedData = this.sanitizer.sanitize(userAvatarData);
 *
 *     // Valida os dados sanitizados
 *     this.validator.validate(sanitizedData);
 *
 *     // Continua com a atualização do avatar do usuário...
 *   }
 * }
 *
 *
 * @interface
 */
export interface UserAvatarDataSanitizerUseCase {
  /**
   * Sanitiza os dados de atualização do avatar do usuário
   *
   * @param {UserAvatarData} userAvatarData - Dados brutos para atualização do avatar do usuário
   * @returns {UserAvatarData} Dados sanitizados prontos para validação
   */
  sanitize: (userAvatarData: UserAvatarData) => UserAvatarData;
}
