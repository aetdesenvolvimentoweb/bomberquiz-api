/**
 * Application Entry Point
 *
 * @module main/index
 * @description Main entry file for the BomberQuiz API application that initializes
 * module aliases and starts the server
 */

// Then import other modules
import { startServer } from "./server";

/**
 * Main application function that initializes and starts the server
 *
 * This function serves as the primary entry point for the application.
 * It reads the PORT from environment variables (with fallback to 3000),
 * starts the server using the startServer function, and handles any
 * errors that occur during startup.
 *
 * @async
 * @function main
 * @returns {Promise<void>} A promise that resolves when the server has started
 * @throws {Error} Logs any errors that occur during server startup
 *
 * @example
 * // Direct invocation
 * main().catch(err => {
 *   console.error('Failed to start application:', err);
 *   process.exit(1);
 * });
 */
export async function main(): Promise<void> {
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  try {
    await startServer(PORT);
  } catch (error) {
    console.error(error);
  }
}

// Execute the main function only if this file is run directly
/* istanbul ignore next */
if (require.main === module) {
  main();
}
