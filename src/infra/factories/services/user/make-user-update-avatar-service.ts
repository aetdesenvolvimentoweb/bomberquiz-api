import { UserAvatarDataSanitizer } from "@/data/sanitizers";
import { UserUpdateAvatarService } from "@/data/services";
import { UserAvatarDataValidator } from "@/data/validators/user/user-avatar-data-validator";
import { MongoIdValidatorAdapter } from "@/infra/adapters/mongo-id-validator-adapter";
import { ConsoleLogger } from "@/infra/providers";
import { PrismaUserRepository } from "@/infra/repositories";

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
