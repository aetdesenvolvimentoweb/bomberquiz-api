/**
 * Serviço de atualização de avatar do usuário
 *
 * Este serviço implementa o caso de uso para atualização do avatar do usuário,
 * fornecendo sanitização, validação e persistência de dados. O fluxo inclui:
 * 1. Sanitização dos dados de entrada para remover possíveis vetores de ataque
 * 2. Validação do formato e conteúdo do avatar
 * 3. Persistência no repositório de usuários
 *
 * @module data/services/user/user-update-avatar
 * @category Services
 */

import { UserAvatarData } from "@/domain/entities";
import { LoggerProvider } from "@/domain/providers";
import { UserRepository } from "@/domain/repositories";
import { UserAvatarDataSanitizerUseCase } from "@/domain/sanitizers";
import { UserUpdateAvatarUseCase } from "@/domain/usecases";
import { UserAvatarDataValidatorUseCase } from "@/domain/validators";

/**
 * Interface que define as dependências do serviço de atualização de avatar
 *
 * @interface UserUpdateAvatarServiceProps
 * @property {UserRepository} userRepository - Repositório para operações com usuários
 * @property {UserAvatarDataSanitizerUseCase} userAvatarDataSanitizer - Sanitizador dos dados de avatar
 * @property {UserAvatarDataValidatorUseCase} userAvatarDataValidator - Validador dos dados de avatar
 * @property {LoggerProvider} loggerProvider - Provedor de logs para monitoramento e debug
 */
interface UserUpdateAvatarServiceProps {
  userRepository: UserRepository;
  userAvatarDataSanitizer: UserAvatarDataSanitizerUseCase;
  userAvatarDataValidator: UserAvatarDataValidatorUseCase;
  loggerProvider: LoggerProvider;
}

/**
 * Serviço responsável pela atualização de avatar do usuário
 *
 * Esta classe implementa a lógica de negócio para atualizar o avatar de um usuário
 * existente, garantindo que os dados passem por sanitização e validação antes
 * de serem persistidos no repositório.
 *
 * @class UserUpdateAvatarService
 * @implements {UserUpdateAvatarUseCase}
 *
 * @example
 * // Criando uma instância do serviço
 * const updateAvatarService = new UserUpdateAvatarService({
 *   userRepository,
 *   userAvatarDataSanitizer,
 *   userAvatarDataValidator,
 *   loggerProvider
 * });
 *
 * // Atualizando o avatar de um usuário
 * await updateAvatarService.updateAvatar({
 *   id: 'user-123',
 *   avatarUrl: 'https://example.com/new-avatar.jpg'
 * });
 */
export class UserUpdateAvatarService implements UserUpdateAvatarUseCase {
  /**
   * Cria uma nova instância do serviço de atualização de avatar
   *
   * @param {UserUpdateAvatarServiceProps} props - Dependências necessárias para o funcionamento do serviço
   */
  constructor(private readonly props: UserUpdateAvatarServiceProps) {}

  /**
   * Atualiza o avatar de um usuário existente
   *
   * Este método processa a atualização do avatar de um usuário, seguindo estas etapas:
   * 1. Sanitiza os dados recebidos para remover conteúdo potencialmente malicioso
   * 2. Valida os dados sanitizados para garantir consistência e segurança
   * 3. Atualiza o avatar do usuário no repositório
   *
   * O processo inclui logs detalhados para rastreamento de fluxo e depuração.
   * Qualquer erro no processo é registrado e propagado para a camada superior.
   *
   * @param {UserAvatarData} userAvatarData - Dados do avatar a ser atualizado, contendo id do usuário e URL do avatar
   * @returns {Promise<void>} Uma promessa que resolve quando o avatar for atualizado com sucesso
   * @throws {InvalidParamError} Se os dados do avatar não passarem na validação
   * @throws {Error} Se ocorrer qualquer outro erro durante o processo
   */
  public readonly updateAvatar = async (
    userAvatarData: UserAvatarData,
  ): Promise<void> => {
    const {
      userAvatarDataSanitizer,
      userAvatarDataValidator,
      userRepository,
      loggerProvider,
    } = this.props;

    const logContext = {
      service: "UserUpdateAvatarService",
      method: "updateAvatar",
      metadata: {
        userId: userAvatarData?.id,
      },
    };

    try {
      loggerProvider.debug(
        "Iniciando processo de atualização do avatar do usuário",
        logContext,
      );

      // Sanitiza os dados de entrada
      const sanitizedData = userAvatarDataSanitizer.sanitize(userAvatarData);
      loggerProvider.trace("Dados sanitizados com sucesso", {
        ...logContext,
        metadata: {
          ...logContext.metadata,
          sanitizedData,
        },
      });

      // Valida os dados sanitizados
      await userAvatarDataValidator.validate(sanitizedData);
      loggerProvider.debug("Dados validados com sucesso", logContext);

      // Persiste o novo avatar do usuário no repositório
      await userRepository.updateAvatar(sanitizedData);

      loggerProvider.info("Avatar do usuário atualizado com sucesso", {
        ...logContext,
        metadata: {
          ...logContext.metadata,
          userId: sanitizedData.id,
        },
      });
    } catch (error: unknown) {
      loggerProvider.error("Erro ao atualizar o avatar do usuário", {
        ...logContext,
        metadata: {
          ...logContext.metadata,
          error: {
            name: (error as Error).name,
            message: (error as Error).message,
            stack: (error as Error).stack,
          },
        },
      });

      throw error;
    }
  };
}
