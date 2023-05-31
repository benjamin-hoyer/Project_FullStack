import { db } from "../models/db.js";

export const adminController = {
  async validateAdmin(request, h) {
    const user = request.auth.credentials;
    if (user.role !== "admin") {
      return h.redirect("/dashboard");
    }
  },

  showAdmin: {
    validate: {},
    handler: async function (request, h) {
      const user = request.auth.credentials;
      if (user.role !== "admin") {
        return h.redirect("/dashboard");
      }
      const users = await db.userStore.getAllUsers();
      return h.view("admin_view", {
        title: "Hiking Admin",
        users: users,
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
            title: "Sign up error",
            errors: [{ message: err.message }],
          })
          .code(400);
      }
    },
  },
};
