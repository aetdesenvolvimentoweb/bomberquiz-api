import { AuthenticateService } from "@/data/services";
import { Argon2Hash, ConsoleLogger } from "@/infra/providers";
import { JsonWebTokenProvider } from "@/infra/providers";
import { PrismaUserRepository } from "@/infra/repositories";

/**
 * @module make-authenticate-service
 * @description Factory function for creating an instance of AuthenticateService
 */

/**
 * Creates and configures a AuthenticateService instance with all required dependencies
 *
 * This factory function follows the Dependency Injection pattern, creating and wiring
 * all the dependencies needed by the UserAuthenticateService. It uses environment variables
 * for configuration and instantiates concrete implementations of required interfaces.
 *
 * @function makeAuthenticateService
 * @returns {AuthenticateService} A fully configured instance of AuthenticateService
 *
 * @example
 * // In a controller factory or composition root
 * import { makeAuthenticateService } from '@/infra/factories';
 *
 * const authenticateService = makeAuthenticateService();
 *
 * @throws Will throw an error if JWT_SECRET environment variable is not set and default is used in production
 */
export const makeAuthenticateService = (): AuthenticateService => {
  const loggerProvider = new ConsoleLogger();
  /* istanbul ignore next */
  const jwtSecret =
    process.env.JWT_SECRET || "b71d6620ed1f14726f299763bbeaff4a23d2a427";
  const userRepository = new PrismaUserRepository();
  const hashProvider = new Argon2Hash();
  const jwtProvider = new JsonWebTokenProvider(jwtSecret);

  return new AuthenticateService({
    userRepository,
    hashProvider,
    jwtProvider,
    loggerProvider,
  });
};
