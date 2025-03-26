/**
 * Adapter Module Exports
 *
 * @module infra/adapters
 * @description This module centralizes the export of all external library adapters and concrete implementations
 * that fulfill interfaces defined in the application domain.
 *
 * The adapter pattern is used to convert external libraries and frameworks to match the interfaces
 * expected by the application, promoting loose coupling and better testability.
 *
 * Available adapters:
 *
 * - {@link date-fns-birthdate-validator-adapter} - Validates birthdates using date-fns
 * - {@link fastify-middleware-adapter} - Adapts application middlewares to Fastify middleware format
 * - {@link fastify-route-adapter} - Adapts application controllers to Fastify route handlers
 * - {@link libphonenumber-validator-adapter} - Validates phone numbers using the libphonenumber library
 * - {@link password-validator-adapter} - Validates password strength and structure
 * - {@link prisma-client-adapter} - Adapts Prisma ORM to match application database interfaces
 * - {@link validator-email-validator-adapter} - Validates email addresses using the validator library
 *
 * @example
 * // How to import adapters in application code
 * import {
 *   fastifyMiddlewareAdapter,
 *   fastifyRouteAdapter,
 *   prismaClientAdapter
 * } from '@/infra/adapters';
 */

export * from "./date-fns-birthdate-validator-adapter";
export * from "./fastify-middleware-adapter";
export * from "./fastify-route-adapter";
export * from "./libphonenumber-validator-adapter";
export * from "./password-validator-adapter";
export * from "./prisma-client-adapter";
export * from "./validator-email-validator-adapter";
