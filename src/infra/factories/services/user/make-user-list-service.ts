/**
 * Factory para serviço de listagem de usuários
 *
 * @module infra/factories/services/user/make-user-list-service
 * @category Factories
 */

import { UserListService } from "@/data/services";
import { ConsoleLogger } from "@/infra/providers";
import { PrismaUserRepository } from "@/infra/repositories";

/**
 * Cria e configura uma instância do serviço de listagem de usuários
 *
 * Esta factory é responsável por instanciar e configurar o serviço de listagem
 * de usuários, fornecendo todas as dependências necessárias. Implementa o padrão
 * Factory Method para isolar a criação do serviço e facilitar testes.
 *
 * @function makeUserListService
 * @returns {UserListService} Uma instância configurada do serviço de listagem de usuários
 *
 * @example
 * // Obtendo uma instância do serviço
 * const userListService = makeUserListService();
 *
 * // Utilizando o serviço para listar usuários
 * const users = await userListService.list();
 * console.log(`Encontrados ${users.length} usuários`);
 */
export const makeUserListService = (): UserListService => {
  const loggerProvider = new ConsoleLogger();
  const userRepository = new PrismaUserRepository();
  return new UserListService({ userRepository, loggerProvider });
};
