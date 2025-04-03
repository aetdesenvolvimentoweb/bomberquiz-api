import { UserListService } from "@/data/services";
import { ConsoleLogger } from "@/infra/providers";
import { PrismaUserRepository } from "@/infra/repositories";

export const makeUserListService = (): UserListService => {
  const loggerProvider = new ConsoleLogger();
  const userRepository = new PrismaUserRepository();
  return new UserListService({ userRepository, loggerProvider });
};
