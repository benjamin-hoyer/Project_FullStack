import { assert } from "chai";
import { apiService } from "./api_service.js";
import { decodeToken } from "../../src/api/jwt_utils.js";
import { darth, darthCredentials } from "../fixtures.js";

suite("Authentication API tests", async () => {
  setup(async () => {
    apiService.clearAuth();
    await apiService.createUser(darth);
    await apiService.authenticate(darthCredentials);
    await apiService.deleteAllUsers();
  });

  teardown(async () => {
    // Delete all users if authenticated ( same email ist not allowed )
    if (apiService.isAuthenticated()) {
      await apiService.deleteAllUsers();
    }
  });

  test("authenticate", async () => {
    await apiService.createUser(darth);
    const response = await apiService.authenticate(darthCredentials);
    assert(response.success);
    assert.isDefined(response.token);
  });

  test("verify Token", async () => {
    const returnedUser = await apiService.createUser(darth);
    const response = await apiService.authenticate(darthCredentials);

    const userInfo = decodeToken(response.token);
    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.userId, returnedUser._id);
  });

  test("check Unauthorized", async () => {
    apiService.clearAuth();
    try {
      await apiService.deleteAllUsers();
      assert.fail("Route not protected");
    } catch (error) {
      assert.equal(error.response.data.statusCode, 401);
    }
  });
});
