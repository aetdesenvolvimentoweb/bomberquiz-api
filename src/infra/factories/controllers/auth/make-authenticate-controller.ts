import { makeAuthenticateService } from "@/infra/factories";
import { ConsoleLogger } from "@/infra/providers";
import { AuthenticateController } from "@/presentation/controllers/user";
import { Controller } from "@/presentation/protocols";

/**
 * @module make-authenticate-controller
 * @description Factory function for creating a user authentication controller instance
 */

/**
 * Creates and configures a AuthenticateController instance with all required dependencies
 *
 * This factory function follows the Dependency Injection pattern, creating and wiring
 * all the dependencies needed by the UserAuthenticateController. It creates a logger
 * and uses the makeAuthenticateService factory to obtain the authentication service.
 *
 * @function makeAuthenticateController
 * @returns {Controller} A fully configured instance of AuthenticateController
 *
 * @example
 * // In a route configuration file
 * import { fastifyRouteAdapter } from '@/infra/adapters';
 * import { makeAuthenticateController } from '@/infra/factories';
 *
 * const loginRoute = fastifyRouteAdapter(makeAuthenticateController());
 * fastify.post('/api/login', loginRoute);
 */
export const makeAuthenticateController = (): Controller => {
  const loggerProvider = new ConsoleLogger();
  const authenticateService = makeAuthenticateService(loggerProvider);

  return new AuthenticateController({
    authenticateService,
  });
};
