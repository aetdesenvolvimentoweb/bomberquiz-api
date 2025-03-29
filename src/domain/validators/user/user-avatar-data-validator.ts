import { UserAvatarData } from "@/domain/entities";

/**
 * Interface para validação completa de dados de atualização do avatar do usuário
 *
 * Define o contrato para implementações que coordenam a validação de todos
 * os campos necessários para a atualização do avatar de um usuário. Este validador atua como
 * um orquestrador que aciona validadores específicos para cada campo, garantindo
 * que todos os dados atendam aos requisitos do sistema.
 *
 * @remarks
 * Este validador segue o padrão Composite, agregando múltiplos validadores
 * especializados para criar uma validação abrangente. Ele é responsável por:
 *
 * - Coordenar a ordem das validações
 * - Garantir que todos os campos obrigatórios sejam validados
 * - Acionar validadores específicos para cada tipo de dado (email, senha, etc.)
 * - Verificar regras de negócio que envolvem múltiplos campos
 *
 * Por ser um validador de alto nível que pode precisar acessar o repositório
 * para verificações de unicidade, seu método de validação é assíncrono.
 *
 * @example
 *
 * // Implementação que orquestra múltiplos validadores
 * class UserAvatarDataValidator implements UserAvatarDataValidatorUseCase {
 *   constructor(
 *     private idValidator: IdValidatorUseCase,
 *     private UserAvatarUrlValidator: UserAvatarUrlValidatorUseCase,
 *   ) {}
 *
 *   async validate(data: UserAvatarData): Promise<void> {
 *     // Verifica se os dados foram fornecidos
 *     if (!data) {
 *       throw new MissingParamError("dados do avatar do usuário");
 *     }
 *
 *     // Valida campos obrigatórios
 *     if (!data.id || data.id.trim() === '') {
 *       throw new MissingParamError("Id");
 *     }
 *
 *     // Aciona validadores específicos para cada campo
 *     this.idValidator.validate(data.id);
 *     this.urlValidator.validate(data.avatarUrl);
 *
 *     // Realiza validações assíncronas (unicidade)
 *     await this.uniqueEmailValidator.validate(data.email);
 *   }
 * }
 *
 * // Uso em um service
 * class UserUpdateAvatarService implements UserUpdateAvatarUseCase {
 *   constructor(
 *     private userRepository: UserRepository,
 *     private validator: UserAvatarDataValidatorUseCase,
 *     private sanitizer: UserAvatarDataSanitizerUseCase
 *   ) {}
 *
 *   async updateAvatar(userAvatarData: UserAvatarData): Promise<User> {
 *     // Sanitiza os dados antes da validação
 *     const sanitizedData = this.sanitizer.sanitize(userAvatarData);
 *
 *     // Valida todos os dados de uma vez
 *     await this.validator.validate(sanitizedData);
 *
 *     // Continua com a criação do usuário...
 *     return this.userRepository.updateAvatar(sanitizedData);
 *   }
 * }
 *
 *
 * @interface
 */
export interface UserAvatarDataValidatorUseCase {
  /**
   * Valida todos os dados necessários para a criação de um usuário
   *
   * @param {UserAvatarData} userAvatarData - Dados de criação do usuário a serem validados
   * @returns {Promise<void>} Promise que resolve se todos os dados forem válidos, ou rejeita com erro caso contrário
   *
   * @throws {MissingParamError} Quando campos obrigatórios não são fornecidos
   * @throws {InvalidParamError} Quando campos não atendem aos critérios de validação
   */
  validate: (userAvatarData: UserAvatarData) => Promise<void>;
}
