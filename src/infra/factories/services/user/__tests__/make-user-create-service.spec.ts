import { UserCreateService } from "@/data/services";
import { makeUserCreateService } from "@/infra/factories";

describe("makeUserCreateService", () => {
  it("should create and return a UserCreateService instance", () => {
    // Call the factory function
    const userCreateService = makeUserCreateService();

    // Assert that the factory returns the correct instance
    expect(userCreateService).toBeInstanceOf(UserCreateService);
    expect(userCreateService).toHaveProperty("create");
  });
});
