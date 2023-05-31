import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { level3, bigHike, testHikes } from "../fixtures.js";
import { assertSubset } from "../test_utils.js";

suite("Hike Model Test", () => {
  setup(async () => {
    db.init("mongo");

    await db.hikeStore.deleteAllHikes();
    await db.categoryStore.deleteAllCategories();
    await db.categoryStore.addCategory(level3);

    for (let i = 0; i < testHikes.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testHikes[i] = await db.hikeStore.addHike(level3._id, testHikes[i]);
    }
  });

  teardown(async () => {
    await db.hikeStore.deleteAllHikes();
  });

  test("add one hike", async () => {
    const newCategory = await db.categoryStore.addCategory(level3);
    const newHike = await db.hikeStore.addHike(newCategory._id, bigHike);
    assertSubset(bigHike, newHike);
  });
});
