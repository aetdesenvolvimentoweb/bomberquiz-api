import { FastifyInstance } from "fastify";

import {
  fastifyMiddlewareAdapter,
  fastifyRouteAdapter,
} from "@/infra/adapters";
import {
  makeAuthMiddleware,
  makeUserCreateController,
  makeUserListController,
  makeUserUpdateAvatarController,
} from "@/infra/factories";

/**
 * @module user-routes
 * @description Configuration module for all user-related API routes
 */

/**
 * Sets up all user-related routes for the application
 *
 * This function configures both public and protected routes for user management
 * within the Fastify application instance. It uses the adapter pattern to
 * connect the application's controllers and middlewares to Fastify's route system.
 *
 * Routes configured:
 * - POST /api/users - Register a new user (public)
 * - POST /api/auth/login - Authenticate user and get token (public)
 * - GET /api/users - List all users (protected by authentication)
 *
 * @function setupUserRoutes
 * @param {FastifyInstance} app - The Fastify application instance
 * @returns {void}
 *
 * @example
 * // In the main application file
 * import fastify from 'fastify';
 * import { setupUserRoutes } from './routes/user-routes';
 *
 * const app = fastify();
 * setupUserRoutes(app);
 *
 * app.listen({ port: 3000 }, (err) => {
 *   if (err) {
 *     console.error(err);
 *     process.exit(1);
 *   }
 *   console.log('Server running on port 3000');
 * });
 */
export const setupUserRoutes = (app: FastifyInstance): void => {
  // Public routes
  app.post("/api/users", fastifyRouteAdapter(makeUserCreateController()));

  // Protected routes
  app.get(
    "/api/users",
    { preHandler: [fastifyMiddlewareAdapter(makeAuthMiddleware())] },
    fastifyRouteAdapter(makeUserListController()),
  );
  app.patch(
    "/api/users/avatar",
    { preHandler: [fastifyMiddlewareAdapter(makeAuthMiddleware())] },
    fastifyRouteAdapter(makeUserUpdateAvatarController()),
  );
};
