/**
 * Factory Module Exports
 *
 * @module infra/factories
 * @description This module serves as the central aggregation point for all factory functions
 * in the application infrastructure layer, consolidating exports from controllers,
 * middlewares, and services sub-modules.
 *
 * Factory functions apply the Factory pattern to encapsulate instantiation logic
 * and dependency injection for various components of the application. This approach:
 *
 * - Centralizes component creation
 * - Simplifies dependency management
 * - Improves testability by allowing dependency mocking
 * - Enhances code organization and maintainability
 *
 * The factories are organized into three main categories:
 *
 * - Controllers: Factory functions for presentation layer components that handle HTTP requests
 * - Middlewares: Factory functions for request interceptors that process requests before controllers
 * - Services: Factory functions for application business logic and use case implementations
 *
 * @example
 * // Import factories from a single entry point
 * import {
 *   makeUserController,
 *   makeAuthMiddleware,
 *   makeUserAuthenticateService
 * } from '@/infra/factories';
 *
 * // Use the factories to create instances with proper dependencies
 * const userController = makeUserController();
 * const authMiddleware = makeAuthMiddleware();
 * const logger = new ConsoleLogger();
 * const userAuthService = makeUserAuthenticateService(logger);
 */

export * from "./controllers";
export * from "./middlewares";
export * from "./services";
