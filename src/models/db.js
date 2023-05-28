import { connectMongo } from "./mongo/connect.js";
import { userMongoStore } from "./mongo/user_mongo_store.js";

export const db = {
  userStore: null,

  init(storeType) {
    switch (storeType) {
      case "mongo":
        this.userStore = userMongoStore;
        connectMongo();
        break;
      default:
        this.userStore = userMongoStore;
        connectMongo();
        break;
    }
  },
};
