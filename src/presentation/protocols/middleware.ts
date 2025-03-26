/**
 * @fileoverview Defines the Middleware interface for HTTP request processing
 * @module presentation/protocols/middleware
 */

import { HttpRequest, HttpResponse } from "./http";

/**
 * Interface for middleware components that process HTTP requests before they reach controllers
 *
 * Middleware components implement this interface to perform operations such as:
 * - Authentication and authorization
 * - Request validation
 * - Logging
 * - Error handling
 * - Data transformation
 *
 * @interface Middleware
 */
export interface Middleware {
  /**
   * Processes an HTTP request and produces an HTTP response
   *
   * @param {HttpRequest} httpRequest - The HTTP request object to be processed
   * @returns {Promise<HttpResponse>} A promise that resolves to an HTTP response
   *
   * @example
   * // Example implementation in an authentication middleware
   * async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
   *   try {
   *     // Extract and validate authentication token
   *     const token = httpRequest.headers?.['x-access-token'];
   *     if (!token) {
   *       return unauthorized();
   *     }
   *     // Process request and return appropriate response
   *     return ok({ userId: authenticatedUserId });
   *   } catch (error) {
   *     return serverError(error);
   *   }
   * }
   */
  handle(httpRequest: HttpRequest): Promise<HttpResponse>;
}
