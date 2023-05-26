import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { darth, testUsers } from "../fixtures.js";

suite("User Model Test", () => {
  setup(async () => {
    db.init();
    await db.userStore.deleteAllUsers();

    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testUsers[i] = await db.userStore.addUser(testUsers[i]);
    }
  });

  teardown(async () => {
    await db.userStore.deleteAllUsers();
  });

  test("add one user", async () => {
    const newUser = await db.userStore.addUser(darth);
    assert.deepEqual(darth, newUser);
  });

  test("get one user by id and email", async () => {
    const user = await db.userStore.addUser(darth);
    const returnedUser1 = await db.userStore.getUserById(user._id);
    assert.deepEqual(user, returnedUser1);
    const returnedUser2 = await db.userStore.getUserByEmail(user.email);
    assert.deepEqual(user, returnedUser2);
  });

  test("delete one user", async () => {
    await db.userStore.deleteUserById(testUsers[0]._id);
    const returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, testUsers.length - 1);
    const deletedUser = await db.userStore.getUserById(testUsers[0]._id);
    assert.isNull(deletedUser);
  });

  test("delete all users", async () => {
    let returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, 3);
    await db.userStore.deleteAllUsers();
    returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, 0);
  });

  test("bad params", async () => {
    let nullUser;
    /* ******* email ******** */
    nullUser = await db.userStore.getUserById("");
    assert.isNull(nullUser);

    /* ******* Id ******** */
    try {
      nullUser = await db.userStore.getUserById("");
      assert.fail("getUserById should have thrown an error");
    } catch (err) {
      console.log(err.message);
      assert.equal(err.message, "id must be a non-empty string");
    }
    /* ****  Id 2  ***** */
    nullUser = await db.userStore.getUserById();
    assert.isNull(nullUser);
  });
});
