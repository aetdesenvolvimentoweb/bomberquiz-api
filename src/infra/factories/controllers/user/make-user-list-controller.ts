import { makeUserListService } from "@/infra/factories";
import { UserListController } from "@/presentation/controllers";
import { Controller } from "@/presentation/protocols";

/**
 * Factory function to create a new UserListController instance.
 *
 * This factory encapsulates the creation logic for the UserListController,
 * instantiating all required dependencies:
 * - UserListService (via its own factory)
 *
 * The factory pattern is used to abstract the complexity of object creation
 * and allows for better testability and dependency injection.
 *
 * @returns {Controller} A configured UserListController instance implementing the Controller interface
 *
 * @example
 * // Create a new controller instance
 * const userListController = makeUserListController();
 * // Use the controller in a route handler
 * app.get('/users', adaptRoute(userListController));
 */
export const makeUserListController = (): Controller => {
  const userListService = makeUserListService();
  return new UserListController({
    userListService,
  });
};
