import { db } from "../models/db.js";
import { UserCredentialsSpec, UserSpecPlus } from "../models/joi_schemas.js";

export const adminController = {
  async validateAdmin(request, h) {
    const user = request.auth.credentials;
    if (user.role !== "admin") {
      return h.redirect("/dashboard");
    }
  },

  showAdmin: {
    handler: async function (request, h) {
      const user = request.auth.credentials;
      if (user.role !== "admin") {
        return h.redirect("/dashboard");
      }
      const users = await db.userStore.getAllUsers();
      return h.view("admin_view", {
        title: "Hiking Admin",
        users: users,
        admin: "Admin",
      });
    },
  },

  deleteUser: {
    handler: async function (request, h) {
      const user = request.auth.credentials;
      if (user.role !== "admin") {
        return h.redirect("/dashboard");
      }
      const userId = request.params.id;
      await db.userStore.deleteUserById(userId);
      return h.redirect("/admin");
    },
  },

  addUser: {
    validate: {
      payload: UserSpecPlus,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        return h
          .view("admin_view", {
            title: "Adding error",
            errors: error.details,
            users: await db.userStore.getAllUsers(),
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      const user = request.auth.credentials;
      if (user.role !== "admin") {
        return h.redirect("/dashboard");
      }
      const newUser = request.payload;
      try {
        await db.userStore.addUser(newUser);
        return h.redirect("/admin");
      } catch (err) {
        return h
          .view("admin_view", {
            title: "Sign up error: Reload",
            users: await db.userStore.getAllUsers(),
            errors: [{ message: "Email was registered before" }],
            admin: "Admin",
          })
          .code(400);
      }
    },
  },
};
