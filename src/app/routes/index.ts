/**
 * Application Routes Configuration
 *
 * @module main/routes
 * @description Central configuration module for all API routes in the application
 */

import { FastifyInstance } from "fastify";

import { setupUserRoutes } from "./user-routes";

/**
 * Configures all application routes for the Fastify instance
 *
 * This function serves as the main entry point for route configuration across
 * the entire application. It integrates all domain-specific route setups (like user routes)
 * and also configures utility routes such as the health check endpoint.
 *
 * As the application grows, additional route setup functions should be imported
 * and called from this function to maintain a clean organization of routes by domain.
 *
 * @function setupRoutes
 * @param {FastifyInstance} app - The Fastify application instance
 * @returns {void}
 *
 * @example
 * // In the main application file
 * import fastify from 'fastify';
 * import { setupRoutes } from './routes';
 *
 * const app = fastify();
 * setupRoutes(app);
 *
 * app.listen({ port: 3000 }, (err) => {
 *   if (err) {
 *     console.error(err);
 *     process.exit(1);
 *   }
 *   console.log('Server running on port 3000');
 * });
 */
export const setupRoutes = (app: FastifyInstance): void => {
  // Set up user-related routes
  setupUserRoutes(app);

  // Add other domain-specific routes as needed

  // Health check route to verify API status
  app.get("/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });
};
