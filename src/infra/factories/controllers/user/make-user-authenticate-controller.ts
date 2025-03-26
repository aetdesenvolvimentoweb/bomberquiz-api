import { makeUserAuthenticateService } from "@/infra/factories/services/user";
import { ConsoleLogger } from "@/infra/providers";
import { UserAuthenticateController } from "@/presentation/controllers/user";
import { Controller } from "@/presentation/protocols";

/**
 * @module make-user-authenticate-controller
 * @description Factory function for creating a user authentication controller instance
 */

/**
 * Creates and configures a UserAuthenticateController instance with all required dependencies
 *
 * This factory function follows the Dependency Injection pattern, creating and wiring
 * all the dependencies needed by the UserAuthenticateController. It creates a logger
 * and uses the makeUserAuthenticateService factory to obtain the authentication service.
 *
 * @function makeUserAuthenticateController
 * @returns {Controller} A fully configured instance of UserAuthenticateController
 *
 * @example
 * // In a route configuration file
 * import { fastifyRouteAdapter } from '@/infra/adapters';
 * import { makeUserAuthenticateController } from '@/infra/factories/controllers/user';
 *
 * const loginRoute = fastifyRouteAdapter(makeUserAuthenticateController());
 * fastify.post('/api/login', loginRoute);
 */
export const makeUserAuthenticateController = (): Controller => {
  const loggerProvider = new ConsoleLogger();
  const userAuthenticateService = makeUserAuthenticateService(loggerProvider);

  return new UserAuthenticateController({
    userAuthenticateUseCase: userAuthenticateService,
  });
};
