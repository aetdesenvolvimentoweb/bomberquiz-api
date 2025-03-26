/**
 * Provider Implementation Exports
 *
 * @module infra/providers
 * @description This module centralizes the export of all concrete implementations
 * of provider contracts defined in the domain layer.
 *
 * Providers are services that implement specific technical capabilities required by
 * the application, such as hashing, logging, and JWT token management. These implementations
 * follow the dependency inversion principle, allowing the application to depend on
 * abstractions rather than concrete implementations.
 *
 * Available providers:
 *
 * - {@link argon2-hash} - Password hashing implementation using Argon2 algorithm
 * - {@link console-logger} - Application logging implementation using console
 * - {@link jwt-provider} - JSON Web Token generation and verification using jsonwebtoken
 *
 * @example
 * // How to import providers in application code
 * import {
 *   JsonWebTokenProvider,
 *   Argon2Hash,
 *   ConsoleLogger
 * } from '@/infra/providers';
 *
 * // Example of provider instantiation
 * const jwtProvider = new JsonWebTokenProvider(process.env.JWT_SECRET);
 * const hashProvider = new Argon2Hash();
 * const logger = new ConsoleLogger();
 */

export * from "./argon2-hash";
export * from "./console-logger";
export * from "./jwt-provider";
