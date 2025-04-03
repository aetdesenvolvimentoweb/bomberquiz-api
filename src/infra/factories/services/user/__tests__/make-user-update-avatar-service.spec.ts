import { UserUpdateAvatarService } from "@/data/services";
import { makeUserUpdateAvatarService } from "@/infra/factories";

describe("makeUserUpdateAvatarService", () => {
  it("should create and return a UserCreateService instance", () => {
    // Call the factory function
    const userUpdateAvatarService = makeUserUpdateAvatarService();

    // Assert that the factory returns the correct instance
    expect(userUpdateAvatarService).toBeInstanceOf(UserUpdateAvatarService);
    expect(userUpdateAvatarService).toHaveProperty("updateAvatar");
  });
});
