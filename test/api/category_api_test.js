import { assert } from "chai";
import { apiService } from "./api_service.js";
import { assertSubset } from "../test_utils.js";
import {
  level3,
  darth,
  darthCredentials,
  testCategories,
} from "../fixtures.js";

const categories = new Array(testCategories.length);

suite("Category API tests", () => {
  let user = null;
  setup(async () => {
    await apiService.clearAuth();
    user = await apiService.createUser(darth);
    await apiService.authenticate(darthCredentials);
    await apiService.deleteAllCategories();
    await apiService.deleteAllUsers();
    user = await apiService.createUser(darth);
    await apiService.authenticate(darthCredentials);
    level3.userid = user._id;
    for (let i = 0; i < testCategories.length; i += 1) {
      testCategories[i].userid = user._id;
      // eslint-disable-next-line no-await-in-loop
      categories[i] = await apiService.createCategory(testCategories[i]);
    }
  });

  teardown(async () => {
    // Delete all users if authenticated ( same email ist not allowed )
    if (apiService.isAuthenticated()) {
      await apiService.deleteAllUsers();
    }
  });

  test("create category", async () => {
    const returnedCategory = await apiService.createCategory(level3);
    assert.isNotNull(returnedCategory);
    assertSubset(level3, returnedCategory);
  });

  test("delete a category", async () => {
    const category = await apiService.createCategory(level3);
    const response = await apiService.deleteCategory(category._id);
    assert.equal(response.status, 204);
    try {
      await apiService.getCategory(category.id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(
        error.response.data.message === "No category with this id",
        "Incorrect Response Message"
      );
    }
  });

  test("create multiple categories", async () => {
    let returnedLists = await apiService.getAllCategories();
    assert.equal(returnedLists.length, testCategories.length);
    await apiService.deleteAllCategories();
    returnedLists = await apiService.getAllCategories();
    assert.equal(returnedLists.length, 0);
  });

  test("remove nonexistent category", async () => {
    try {
      await apiService.deleteCategory("not an id");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(
        error.response.data.message === "No category with this id",
        "Incorrect Response Message"
      );
    }
  });

  test("delete all Categories", async () => {
    let returnedCategories = await apiService.getAllCategories();
    assert.equal(returnedCategories.length, 3);
    await apiService.deleteAllCategories();
    returnedCategories = await apiService.getAllCategories();
    assert.equal(returnedCategories.length, 0);
  });

  test("get a Category - success", async () => {
    const returnedCategory = await apiService.getCategory(categories[0]._id);
    assert.deepEqual(categories[0], returnedCategory);
  });

  test("get a Category - fail", async () => {
    try {
      const returnedCategory = await apiService.getCategory("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No category with this id");
      assert.equal(error.response.data.statusCode, 503);
    }
  });
  test("get a Category - deleted Category", async () => {
    await apiService.deleteAllCategories();
    try {
      await apiService.getCategory(categories[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No category with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});
