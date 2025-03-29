/**
 * Barrel file for Auth controller factories
 *
 * This file consolidates and re-exports all controller factory functions
 * related to Authentication domain entities, making it easier to import them from
 * a single location.
 *
 * @example
 * // Instead of:
 * import { makeUserCreateController } from "@/infra/factories/controllers/user/make-user-create-controller";
 *
 * // You can use:
 * import { makeUserCreateController } from "@/infra/factories/controllers/user";
 *
 * @module UserControllerFactories
 */

export * from "../auth/make-user-authenticate-controller";
