/**
 * Middleware Factory Exports
 *
 * @module infra/factories/middlewares
 * @description This module centralizes the export of all middleware factory functions
 * used to create and configure middleware instances throughout the application.
 *
 * Middleware factories follow the Factory pattern to encapsulate the creation logic
 * and dependency injection for middleware components. This approach promotes cleaner
 * code organization, testability, and separation of concerns.
 *
 * Available middleware factories:
 *
 * - {@link make-auth-middleware} - Creates authentication middleware to protect routes
 *   by validating JWT tokens and extracting user information
 *
 * @example
 * // How to import middleware factories in application code
 * import { makeAuthMiddleware } from '@/infra/factories/middlewares';
 * import { fastifyMiddlewareAdapter } from '@/infra/adapters';
 *
 * // Example of middleware factory usage with Fastify
 * const authMiddleware = fastifyMiddlewareAdapter(makeAuthMiddleware());
 * fastify.register((instance, opts, done) => {
 *   instance.addHook('preHandler', authMiddleware);
 *   // Protected routes go here
 *   done();
 * });
 */

export * from "./make-auth-middleware";
