import { UserAuthenticateService } from "@/data/services";
import { LoggerProvider } from "@/domain/providers";
import { Argon2Hash } from "@/infra/providers";
import { JsonWebTokenProvider } from "@/infra/providers";
import { PrismaUserRepository } from "@/infra/repositories";

/**
 * @module make-user-authenticate-service
 * @description Factory function for creating an instance of UserAuthenticateService
 */

/**
 * Creates and configures a UserAuthenticateService instance with all required dependencies
 *
 * This factory function follows the Dependency Injection pattern, creating and wiring
 * all the dependencies needed by the UserAuthenticateService. It uses environment variables
 * for configuration and instantiates concrete implementations of required interfaces.
 *
 * @function makeUserAuthenticateService
 * @param {LoggerProvider} loggerProvider - The logger implementation to be used by the service
 * @returns {UserAuthenticateService} A fully configured instance of UserAuthenticateService
 *
 * @example
 * // In a controller factory or composition root
 * import { ConsoleLogger } from '@/infra/providers';
 * import { makeUserAuthenticateService } from '@/infra/factories/services/user';
 *
 * const logger = new ConsoleLogger();
 * const userAuthenticateService = makeUserAuthenticateService(logger);
 *
 * @throws Will throw an error if JWT_SECRET environment variable is not set and default is used in production
 */
export const makeUserAuthenticateService = (
  loggerProvider: LoggerProvider,
): UserAuthenticateService => {
  const jwtSecret = process.env.JWT_SECRET || "your_default_jwt_secret_key";
  const userRepository = new PrismaUserRepository();
  const hashProvider = new Argon2Hash();
  const jwtProvider = new JsonWebTokenProvider(jwtSecret);

  return new UserAuthenticateService({
    userRepository,
    hashProvider,
    jwtProvider,
    loggerProvider,
  });
};
