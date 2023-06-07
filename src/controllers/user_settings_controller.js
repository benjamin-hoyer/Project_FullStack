import { db } from "../models/db.js";

export const userSettingsController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const viewData = {
        title: "User Settings",
        user: loggedInUser,
        admin: loggedInUser.role === "admin",
      };
      return h.view("user_settings_view", viewData);
    },
  },
};
