import { assert } from "chai";
import { assertSubset } from "../test_utils.js";
import { apiService } from "./api_service.js";
import {
  darth,
  level3,
  testCategories,
  testHikes,
  bigHike,
  testUsers,
  darthCredentials,
} from "../fixtures.js";

suite(" Hike API tests", () => {
  let user = null;
  let level3hikes = null;

  setup(async () => {
    await apiService.clearAuth();
    user = await apiService.createUser(darth);
    await apiService.authenticate(darthCredentials);
    await apiService.deleteAllCategories();
    await apiService.deleteAllHikes();
    await apiService.deleteAllUsers();
    user = await apiService.createUser(darth);
    await apiService.authenticate(darthCredentials);
    level3.userid = user._id;
    level3hikes = await apiService.createCategory(level3);

    try {
      for (let i = 0; i < testHikes.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await apiService.createHike(level3hikes._id, testHikes[i]);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  });

  teardown(async () => {
    // Delete all users if authenticated ( same email ist not allowed )
    if (apiService.isAuthenticated()) {
      await apiService.deleteAllUsers();
    }
  });

  test("create hike", async () => {
    const returnedHike = await apiService.createHike(level3hikes._id, bigHike);
    assert.isNotNull(returnedHike);
    assertSubset(bigHike, returnedHike);
  });

  test("create Multiple hikes", async () => {
    const returnedHikes = await apiService.getAllHikes();
    assert.equal(returnedHikes.length, testHikes.length);
    for (let i = 0; i < returnedHikes.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const hike = await apiService.getHike(returnedHikes[i]._id);
      assertSubset(hike, returnedHikes[i]);
    }
  });

  test("Delete Hike", async () => {
    let returnedHikes = await apiService.getAllHikes();
    assert.equal(returnedHikes.length, testHikes.length);
    for (let i = 0; i < returnedHikes.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await apiService.deleteHike(returnedHikes[i]._id);
    }
    returnedHikes = await apiService.getAllHikes();
    assert.equal(returnedHikes.length, 0);
  });

  test("test denormalized categories", async () => {
    const returnedCategory = await apiService.getCategory(level3hikes._id);
    assert.equal(returnedCategory.hikes.length, testHikes.length);
    for (let i = 0; i < testHikes.length; i += 1) {
      assertSubset(testHikes[i], returnedCategory.hikes[i]);
    }
  });
});
