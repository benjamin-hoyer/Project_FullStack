import { assert } from "chai";
import { assertSubset } from "../test_utils.js";
import { apiService } from "./api_service.js";
import { darth, darthCredentials, testUsers } from "../fixtures.js";
import { db } from "../../src/models/db.js";

const users = new Array(testUsers.length);

suite("User API tests", () => {
  setup(async () => {
    await apiService.createUser(darth);
    await apiService.authenticate(darthCredentials);
    await apiService.deleteAllUsers();
    await apiService.createUser(darth);
    await apiService.authenticate(darthCredentials);
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      users[i] = await apiService.createUser(testUsers[i]);
    }
  });
  teardown(async () => {
    // Delete all users if authenticated ( same email ist not allowed )
    if (apiService.isAuthenticated()) {
      await apiService.deleteAllUsers();
    }
  });

  test("create a user", async () => {
    await apiService.deleteAllUsers();
    const newUser = await apiService.createUser(darth);
    assertSubset(darth, newUser);
    assert.isDefined(newUser._id);
    await apiService.authenticate(darthCredentials);
  });

  test("delete all userApi", async () => {
    let returnedUsers = await apiService.getAllUsers();
    assert.equal(returnedUsers.length, 4);
    await apiService.deleteAllUsers();
    await apiService.createUser(darth);
    await apiService.authenticate(darthCredentials);
    returnedUsers = await apiService.getAllUsers();
    assert.equal(returnedUsers.length, 1);
  });

  test("get a user", async () => {
    const returnedUser = await apiService.getUser(users[0]._id);
    assert.deepEqual(users[0], returnedUser);
  });

  test("get a user - bad id", async () => {
    try {
      const returnedUser = await apiService.getUser("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      console.log(error.response.data.message);
      assert(
        error.response.data.message ===
          "Database error: Probably no user with this id"
      );
      assert.equal(error.response.data.statusCode, 503);
    }
  });

  test("get a user - deleted user", async () => {
    await apiService.deleteAllUsers();
    await apiService.createUser(darth);
    await apiService.authenticate(darthCredentials);
    try {
      const returnedUser = await apiService.getUser(users[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});
