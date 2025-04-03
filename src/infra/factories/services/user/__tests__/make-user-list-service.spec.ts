import { UserListService } from "@/data/services";
import { makeUserListService } from "@/infra/factories";

describe("makeUserListService", () => {
  it("should create and return a UserListService instance", () => {
    // Call the factory function
    const userListService = makeUserListService();

    // Assert that the factory returns the correct instance
    expect(userListService).toBeInstanceOf(UserListService);
    expect(userListService).toHaveProperty("list");
  });
});
