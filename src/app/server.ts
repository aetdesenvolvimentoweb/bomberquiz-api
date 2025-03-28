/**
 * Server Configuration
 *
 * @module main/server
 * @description This module handles Fastify server creation, configuration,
 * and startup for the BomberQuiz API application.
 */

import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import fastify, { FastifyInstance } from "fastify";
import { IncomingMessage, Server, ServerResponse } from "http";

import { setupRoutes } from "./routes";

/**
 * Main Fastify application instance with logging enabled
 *
 * @constant {FastifyInstance} app
 */
export const app = fastify({
  logger: true,
});

/**
 * Configures the Fastify server with plugins and routes
 *
 * This function sets up the server with necessary plugins:
 * - CORS for cross-origin resource sharing
 * - Sensible for improved error handling and utilities
 *
 * It also initializes all application routes through the setupRoutes function.
 *
 * @async
 * @function setupServer
 * @returns {Promise<FastifyInstance>} Configured Fastify server instance ready to start
 *
 * @example
 * const server = await setupServer();
 * // Further customize server if needed
 * await server.listen({ port: 4000 });
 */
export const setupServer = async (): Promise<
  FastifyInstance<Server, IncomingMessage, ServerResponse>
> => {
  // Register plugins
  await app.register(cors, {
    origin: true, // Allow all origins in development
  });

  await app.register(sensible);

  // Configure routes
  setupRoutes(app);

  return app;
};

/**
 * Starts the Fastify server on the specified port
 *
 * This function calls setupServer to configure the server,
 * then starts it listening on the specified port and host.
 * It handles any startup errors and logs server status.
 *
 * @async
 * @function startServer
 * @param {number} [port=3333] - The port number to listen on
 * @returns {Promise<void>} A promise that resolves when the server has started
 * @throws {Error} Logs any errors and exits the process on startup failure
 *
 * @example
 * // Start server on default port (3333)
 * await startServer();
 *
 * // Start server on specific port
 * await startServer(8080);
 */
export const startServer = async (port = 3333): Promise<void> => {
  try {
    const server = await setupServer();
    await server.listen({ port, host: "0.0.0.0" });
    console.log(`Server running at http://localhost:${port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Start the server if this file is executed directly
/* istanbul ignore next */
if (require.main === module) {
  startServer();
}
