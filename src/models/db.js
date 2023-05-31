import { connectMongo } from "./mongo/connect.js";
import { userMongoStore } from "./mongo/user_mongo_store.js";
import { hikeMongoStore } from "./mongo/hike_mongo_store.js";
import { categoryMongoStore } from "./mongo/category_mongo_store.js";

export const db = {
  userStore: null,

  init(storeType) {
    switch (storeType) {
      case "mongo":
        this.userStore = userMongoStore;
        this.hikeStore = hikeMongoStore;
        this.categoryStore = categoryMongoStore;
        connectMongo();
        break;
      default:
        this.userStore = userMongoStore;
        this.hikeStore = hikeMongoStore;
        this.categoryStore = categoryMongoStore;
        connectMongo();
        break;
    }
  },
};
