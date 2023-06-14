import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { level3, bigHike, testHikes } from "../fixtures.js";
import { assertSubset } from "../test_utils.js";

suite("Hike Model Test", () => {
  let testCategory;

  setup(async () => {
    db.init("mongo");

    await db.hikeStore.deleteAllHikes();
    await db.categoryStore.deleteAllCategories();
    testCategory = await db.categoryStore.addCategory(level3);

    for (let i = 0; i < testHikes.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testHikes[i] = await db.hikeStore.addHike(testCategory._id, testHikes[i]);
    }
  });

  teardown(async () => {
    await db.hikeStore.deleteAllHikes();
  });

  test("add one hike", async () => {
    const newHike = await db.hikeStore.addHike(testCategory._id, bigHike);
    assertSubset(bigHike, newHike);
  });

  test("get one hike by id", async () => {
    const hike = await db.hikeStore.addHike(testCategory._id, bigHike);
    const returnedHike = await db.hikeStore.getHikeById(hike._id);
    assertSubset(bigHike, returnedHike);
    assert.deepEqual(hike, returnedHike);
  });

  test("get all hikes", async () => {
    const returnedHikes = await db.hikeStore.getAllHikes();
    assert.equal(returnedHikes.length, testHikes.length);
  });

  test("delete all hikes", async () => {
    let returnedHikes = await db.hikeStore.getAllHikes();
    assert.equal(returnedHikes.length, testHikes.length);
    await db.hikeStore.deleteAllHikes();
    returnedHikes = await db.hikeStore.getAllHikes();
    assert.equal(returnedHikes.length, 0);
  });

  test("delete one hike", async () => {
    await db.hikeStore.deleteHikeById(testHikes[0]._id);
    const returnedHikes = await db.hikeStore.getAllHikes();
    assert.equal(returnedHikes.length, testHikes.length - 1);
    const deletedHike = await db.hikeStore.getHikeById(testHikes[0]._id);
    assert.isNull(deletedHike);
  });

  test("update one hike", async () => {
    const hike = await db.hikeStore.addHike(testCategory._id, bigHike);
    const newHike = {
      name: "updated name",
      start: "updated start",
      end: "updated end",
      distance: 9,
      duration: 9,
      lat: 999,
      long: 999999,
    };
    const updatedHike = await db.hikeStore.updateHikeById(hike._id, newHike);
    assertSubset(newHike, updatedHike);
  });

  test("no param", async () => {
    assert.isNull(await db.hikeStore.getHikeById(null));
  });
});
