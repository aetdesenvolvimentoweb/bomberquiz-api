import jwt from "jsonwebtoken";

import { InvalidParamError, ServerError } from "@/domain/errors";
import { JwtPayload, JwtProvider } from "@/domain/providers/jwt-provider";

/**
 * @module jwt-provider
 * @description Implementation of the JWT provider using the jsonwebtoken library
 */

/**
 * Implementation of the JwtProvider interface using the jsonwebtoken library
 *
 * This class handles JWT token generation and verification, providing a concrete
 * implementation of the JwtProvider interface defined in the domain layer.
 *
 * @class JsonWebTokenProvider
 * @implements {JwtProvider}
 */
export class JsonWebTokenProvider implements JwtProvider {
  /**
   * Creates an instance of JsonWebTokenProvider
   *
   * @constructor
   * @param {string} secretKey - The secret key used to sign and verify JWT tokens
   */
  constructor(private readonly secretKey: string) {}

  /**
   * Signs a payload and generates a JWT token
   *
   * @async
   * @param {JwtPayload} payload - The data to be encoded in the JWT token
   * @param {number} [expiresIn=86400] - Token expiration time in seconds (default: 24 hours)
   * @returns {Promise<string>} A Promise that resolves to the signed JWT token
   * @throws {ServerError} If an error occurs during token generation
   *
   * @example
   * const jwtProvider = new JsonWebTokenProvider(process.env.JWT_SECRET);
   * const token = await jwtProvider.sign({ userId: '123', role: 'admin' });
   */
  async sign(payload: JwtPayload, expiresIn: number = 86400): Promise<string> {
    try {
      return jwt.sign(payload, this.secretKey, { expiresIn });
    } catch (error) {
      throw new ServerError(new Error((error as Error).message));
    }
  }

  /**
   * Verifies a JWT token and returns the decoded payload
   *
   * @async
   * @param {string} token - The JWT token to verify
   * @returns {Promise<JwtPayload>} A Promise that resolves to the decoded payload
   * @throws {InvalidParamError} If the token is missing, invalid, or expired
   * @throws {ServerError} If an unexpected error occurs during verification
   *
   * @example
   * const jwtProvider = new JsonWebTokenProvider(process.env.JWT_SECRET);
   * try {
   *   const payload = await jwtProvider.verify(token);
   *   // Use payload data (userId, role, etc.)
   * } catch (error) {
   *   // Handle invalid token error
   * }
   */
  async verify(token: string): Promise<JwtPayload> {
    if (!token) {
      throw new InvalidParamError("token", "não fornecido");
    }

    try {
      return jwt.verify(token, this.secretKey) as JwtPayload;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new InvalidParamError("token", "inválido ou expirado");
      }
      throw new ServerError(new Error((error as Error).message));
    }
  }
}
