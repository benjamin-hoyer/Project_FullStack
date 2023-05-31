import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { level3, testCategories } from "../fixtures.js";
import { assertSubset } from "../test_utils.js";

suite("User Model Test", () => {
  setup(async () => {
    db.init("mongo");

    await db.categoryStore.deleteAllCategories();

    for (let i = 0; i < testCategories.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testCategories[i] = await db.categoryStore.addCategory(testCategories[i]);
    }
  });

  teardown(async () => {
    await db.categoryStore.deleteAllCategories();
    await db.hikeStore.deleteAllHikes();
  });

  test("add one category", async () => {
    const newCategory = await db.categoryStore.addCategory(level3);
    assertSubset(level3, newCategory);
    assert.isDefined(newCategory._id);
  });

  test("get one category by id", async () => {
    const category = await db.categoryStore.addCategory(level3);
    const returnedCategory = await db.categoryStore.getCategoryById(
      category._id
    );
    assertSubset(level3, returnedCategory);
    assert.deepEqual(category, returnedCategory);
  });

  test("delete all categories", async () => {
    let returnedCategories = await db.categoryStore.getAllCategories();
    assert.equal(returnedCategories.length, testCategories.length);
    await db.categoryStore.deleteAllCategories();
    returnedCategories = await db.categoryStore.getAllCategories();
    assert.equal(returnedCategories.length, 0);
  });

  test("delete one category", async () => {
    await db.categoryStore.deleteCategoryById(testCategories[0]._id);
    const returnedCategories = await db.categoryStore.getAllCategories();
    assert.equal(returnedCategories.length, testCategories.length - 1);
    const deletedCategory = await db.categoryStore.getCategoryById(
      testCategories[0]._id
    );
    assert.isNull(deletedCategory);
  });

  test("update one category", async () => {
    const category = await db.categoryStore.addCategory(level3);
    const newCategory = {
      name: "updated name",
    };
    await db.categoryStore.updateCategory(category, newCategory);
    const updatedCategory = await db.categoryStore.getCategoryById(
      category._id
    );
    assertSubset(updatedCategory, newCategory);
  });
});
