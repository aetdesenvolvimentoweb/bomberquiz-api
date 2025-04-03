/**
 * Factory para serviço de criação de usuários
 *
 * @module infra/factories/services/user/make-user-create-service
 * @category Factories
 */

import { UserCreateDataSanitizer } from "@/data/sanitizers";
import { UserCreateService } from "@/data/services";
import {
  UserCreateDataValidator,
  UserUniqueEmailValidator,
} from "@/data/validators";
import {
  DateFnsBirthdateValidatorAdapter,
  LibphonenumberPhoneValidator,
  PasswordValidatorAdapter,
  ValidatorEmailValidatorAdapter,
} from "@/infra/adapters";
import { Argon2Hash, ConsoleLogger } from "@/infra/providers";
import { PrismaUserRepository } from "@/infra/repositories";
import { DOMPurifyXssSanitizer } from "@/infra/sanitizers";

/**
 * Cria e configura uma instância do serviço de criação de usuários
 *
 * Esta factory é responsável por instanciar e conectar todos os componentes
 * necessários para o processo completo de criação de usuário, incluindo:
 * - Provedores de hash para senha
 * - Logs do sistema
 * - Sanitizadores de dados de entrada
 * - Repositório para persistência
 * - Validadores para diferentes aspectos dos dados do usuário
 *
 * Segue o padrão Factory Method para isolar a complexidade de criação
 * do serviço e facilitar a substituição de implementações nos testes.
 *
 * @function makeUserCreateService
 * @returns {UserCreateService} Uma instância configurada do serviço de criação de usuários
 *
 * @example
 * // Obtendo uma instância do serviço
 * const userCreateService = makeUserCreateService();
 *
 * // Utilizando o serviço para criar um novo usuário
 * await userCreateService.create({
 *   name: "João Silva",
 *   email: "joao@example.com",
 *   password: "Senha@123",
 *   phone: "+5511999998888",
 *   birthdate: "1990-01-01"
 * });
 */
export const makeUserCreateService = (): UserCreateService => {
  const hashProvider = new Argon2Hash();
  const loggerProvider = new ConsoleLogger();
  const xssSanitizer = new DOMPurifyXssSanitizer();
  const userCreateDataSanitizer = new UserCreateDataSanitizer(xssSanitizer);
  const userRepository = new PrismaUserRepository();
  const userBirthdateValidator = new DateFnsBirthdateValidatorAdapter();
  const userEmailValidator = new ValidatorEmailValidatorAdapter();
  const userPasswordValidator = new PasswordValidatorAdapter();
  const userPhoneValidator = new LibphonenumberPhoneValidator();
  const userUniqueEmailValidator = new UserUniqueEmailValidator(userRepository);
  const userCreateDataValidator = new UserCreateDataValidator({
    userBirthdateValidator,
    userEmailValidator,
    userPasswordValidator,
    userPhoneValidator,
    userUniqueEmailValidator,
  });

  return new UserCreateService({
    hashProvider,
    loggerProvider,
    userCreateDataSanitizer,
    userRepository,
    userCreateDataValidator,
  });
};
