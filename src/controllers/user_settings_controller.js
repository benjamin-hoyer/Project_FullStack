import { db } from "../models/db.js";
import { UserCredentialsSpec, UserSpec } from "../models/joi_schemas.js";

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

  updateUser: {
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h
          .view("user_settings_view", {
            title: "Update error",
            user: request.auth.credentials,
            errors: error.details,
            admin: request.auth.credentials.role === "admin",
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      const user = request.payload;
      const loggedInUser = request.auth.credentials;
      user.role = loggedInUser.role;

      try {
        await db.userStore.updateUserById(loggedInUser._id, user);
      } catch (e) {
        return h
          .view("user_settings_view", {
            title: "Update error",
            user: loggedInUser,
            admin: loggedInUser.role === "admin",
            errors: [{ message: "Email was registered before" }],
          })
          .takeover()
          .code(400);
      }
      return h.redirect("/settings");
    },
  },
};
