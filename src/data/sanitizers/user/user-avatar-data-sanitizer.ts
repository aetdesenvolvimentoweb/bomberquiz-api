import { UserAvatarData } from "@/domain/entities";
import { UserAvatarDataSanitizerUseCase } from "@/domain/sanitizers";

/**
 * Implementação concreta do sanitizador de dados de atualização do avatar do usuário
 *
 * Esta classe implementa a lógica de sanitização dos dados fornecidos
 * durante a atualização do avatar de um usuário, normalizando formatos, removendo espaços
 * em branco desnecessários e protegendo contra ataques XSS.
 *
 * @implements {UserAvatarDataSanitizerUseCase}
 */
export class UserAvatarDataSanitizer implements UserAvatarDataSanitizerUseCase {
  /**
   * Sanitiza os dados de atualização do avatar do usuário
   *
   * @param {UserAvatarData} userAvatarData - Dados brutos do avatar do usuário
   * @returns {UserAvatarData} Dados sanitizados prontos para validação
   */
  sanitize(userAvatarData: UserAvatarData): UserAvatarData {
    if (!userAvatarData) {
      return {} as UserAvatarData;
    }

    return {
      ...userAvatarData,
      // Normaliza o id: remove espaços
      id: this.sanitizeId(userAvatarData.id),

      // Sanitiza a url: remove espaços extras, converte para minúsculas
      avatarUrl: this.sanitizeAvatarUrl(userAvatarData.avatarUrl),
    };
  }

  /**
   * Sanitiza o id do usuário
   *
   * @param {string} id - Id a ser sanitizado
   * @returns {string} Id sanitizado
   */
  private sanitizeId(id: string): string {
    if (!id) return "";

    // Remove espaços
    return id.trim();
  }

  /**
   * Sanitiza a url do avatar do usuário
   *
   * @param {string} avatarUrl - Url a ser sanitizada
   * @returns {string} Url sanitizada
   */
  private sanitizeAvatarUrl(avatarUrl: string): string {
    if (!avatarUrl) return "";

    // Remove espaços extras no início e fim e converte para minúsculas
    return avatarUrl.trim().toLowerCase();
  }
}
