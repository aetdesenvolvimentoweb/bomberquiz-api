import { FastifyInstance } from "fastify";

import { fastifyRouteAdapter } from "@/infra/adapters";
import { makeAuthenticateController } from "@/infra/factories";

/**
 * @module auth-routes
 * @description Configuration module for all auth-related API routes
 */

/**
 * Sets up all auth-related routes for the application
 *
 * This function configures both public and protected routes for user management
 * within the Fastify application instance. It uses the adapter pattern to
 * connect the application's controllers and middlewares to Fastify's route system.
 *
 * Routes configured:
 * - POST /api/auth/login - Authenticate user and get token (public)
 *
 * @function setupAuthRoutes
 * @param {FastifyInstance} app - The Fastify application instance
 * @returns {void}
 *
 * @example
 * // In the main application file
 * import fastify from 'fastify';
 * import { setupAuthRoutes } from './routes/auth-routes';
 *
 * const app = fastify();
 * setupAuthRoutes(app);
 *
 * app.listen({ port: 3333 }, (err) => {
 *   if (err) {
 *     console.error(err);
 *     process.exit(1);
 *   }
 *   console.log('Server running on port 3333');
 * });
 */
export const setupAuthRoutes = (app: FastifyInstance): void => {
  // Public routes
  app.post(
    "/api/auth/login",
    fastifyRouteAdapter(makeAuthenticateController()),
  );

  // Protected routes
};
