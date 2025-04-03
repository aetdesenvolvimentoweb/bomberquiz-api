/**
 * Factory para serviço de atualização de avatar do usuário
 *
 * @module infra/factories/services/user/make-user-update-avatar-service
 * @category Factories
 */

import { UserAvatarDataSanitizer } from "@/data/sanitizers";
import { UserUpdateAvatarService } from "@/data/services";
import { UserAvatarDataValidator } from "@/data/validators/user/user-avatar-data-validator";
import { MongoIdValidatorAdapter } from "@/infra/adapters/mongo-id-validator-adapter";
import { ConsoleLogger } from "@/infra/providers";
import { PrismaUserRepository } from "@/infra/repositories";

/**
 * Cria e configura uma instância do serviço de atualização de avatar do usuário
 *
 * Esta factory é responsável por instanciar e configurar adequadamente o serviço
 * de atualização de avatar do usuário, injetando todas as dependências necessárias.
 * Segue o padrão Factory Method para garantir o isolamento da criação de objetos
 * complexos.
 *
 * @function makeUserUpdateAvatarService
 * @returns {UserUpdateAvatarService} Uma instância configurada do serviço de atualização de avatar
 *
 * @example
 * // Obtendo uma instância do serviço
 * const updateAvatarService = makeUserUpdateAvatarService();
 *
 * // Utilizando o serviço
 * await updateAvatarService.updateAvatar({
 *   id: 'user-123',
 *   avatarUrl: 'https://example.com/new-avatar.jpg'
 * });
 */
export const makeUserUpdateAvatarService = (): UserUpdateAvatarService => {
  const loggerProvider = new ConsoleLogger();
  const userAvatarDataSanitizer = new UserAvatarDataSanitizer();
  const idValidator = new MongoIdValidatorAdapter();
  const userRepository = new PrismaUserRepository();
  const userAvatarDataValidator = new UserAvatarDataValidator({
    idValidator,
    userRepository,
  });
  return new UserUpdateAvatarService({
    loggerProvider,
    userAvatarDataSanitizer,
    userAvatarDataValidator,
    userRepository,
  });
};
