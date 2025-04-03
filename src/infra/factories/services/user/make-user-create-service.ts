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
