import { JsonWebTokenProvider } from "@/infra/providers/jwt-provider";
import { AuthMiddleware } from "@/presentation/middlewares/auth-middleware";
import { Middleware } from "@/presentation/protocols";

/**
 * @module make-auth-middleware
 * @description Factory function for creating an instance of AuthMiddleware
 */

/**
 * Creates and configures an AuthMiddleware instance with all required dependencies
 *
 * This factory function follows the Dependency Injection pattern, creating and providing
 * all the dependencies needed by the AuthMiddleware. It retrieves the JWT secret from
 * environment variables and instantiates a JsonWebTokenProvider to be used for token validation.
 *
 * @function makeAuthMiddleware
 * @returns {Middleware} A fully configured instance of AuthMiddleware
 *
 * @example
 * // In a route configuration file
 * import { fastifyMiddlewareAdapter } from '@/infra/adapters';
 * import { makeAuthMiddleware } from '@/infra/factories/middlewares';
 *
 * const authMiddleware = fastifyMiddlewareAdapter(makeAuthMiddleware());
 * fastify.get('/protected-route', { preHandler: authMiddleware }, handler);
 *
 * @throws Will throw an error if JWT_SECRET environment variable is not set and default is used in production
 */
export const makeAuthMiddleware = (): Middleware => {
  const jwtSecret = process.env.JWT_SECRET || "your_default_jwt_secret_key";
  const jwtProvider = new JsonWebTokenProvider(jwtSecret);

  return new AuthMiddleware({
    jwtProvider,
  });
};
