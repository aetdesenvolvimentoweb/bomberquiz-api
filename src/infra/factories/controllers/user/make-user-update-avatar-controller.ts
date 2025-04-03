import { makeUserUpdateAvatarService } from "@/infra/factories";
import { UserUpdateAvatarController } from "@/presentation/controllers";
import { Controller } from "@/presentation/protocols";

/**
 * Factory function to create a new UserUpdateAvatarController instance.
 *
 * This factory encapsulates the creation logic for the UserUpdateAvatarController,
 * instantiating all required dependencies:
 * - UserUpdateAvatarService (via its own factory)
 *
 * The factory pattern is used to abstract the complexity of object creation
 * and allows for better testability and dependency injection.
 *
 * @returns {Controller} A configured UserUpdateAvatarController instance implementing the Controller interface
 *
 * @example
 * // Create a new controller instance
 * const userUpdateAvatarController = makeUserUpdateAvatarController();
 * // Use the controller in a route handler
 * app.get('/users', adaptRoute(userUpdateAvatarController));
 */
export const makeUserUpdateAvatarController = (): Controller => {
  const userUpdateAvatarService = makeUserUpdateAvatarService();
  return new UserUpdateAvatarController({
    userUpdateAvatarService,
  });
};
