import { FastifyReply, FastifyRequest } from "fastify";

import { Middleware } from "@/presentation/protocols";

/**
 * @module fastify-middleware-adapter
 * @description Adapter to convert internal middleware pattern to Fastify middleware format
 */

/**
 * Adapts a standard application middleware to work with Fastify framework
 *
 * @function fastifyMiddlewareAdapter
 * @param {Middleware} middleware - The internal middleware implementation to adapt
 * @returns {Function} A Fastify middleware function that can be used in routes
 * @example
 * // Usage example
 * const authMiddleware = fastifyMiddlewareAdapter(new AuthMiddleware());
 * fastify.get('/protected-route', { preHandler: authMiddleware }, handler);
 */
export const fastifyMiddlewareAdapter = (middleware: Middleware) => {
  /**
   * Fastify middleware function
   *
   * @async
   * @param {FastifyRequest} request - The Fastify request object
   * @param {FastifyReply} reply - The Fastify reply object
   * @returns {Promise<void>} A promise that resolves when middleware processing is complete
   */
  return async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    // Build the standard HTTP request object from Fastify request
    const httpRequest = {
      headers: request.headers,
      body: request.body,
    };

    // Process the request through the middleware
    const httpResponse = await middleware.handle(httpRequest);

    // If successful, attach the authenticated user data to the request for controller use
    if (httpResponse.statusCode === 200) {
      // Adds the authenticated user to the request for use in controllers
      Object.assign(request, httpResponse.body.data);
      return;
    }

    // For non-200 responses, send the appropriate status and body
    // No explicit return as reply ends the middleware chain
    reply.code(httpResponse.statusCode).send(httpResponse.body);
  };
};
