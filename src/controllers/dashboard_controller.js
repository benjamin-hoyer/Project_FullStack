import { db } from "../models/db.js";
import { CategorySpec } from "../models/joi_schemas.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const Categories = await db.categoryStore.getUserCategories(loggedInUser._id);
      const viewData = {
        title: "Categories Dashboard",
        categories: Categories,
        admin: loggedInUser.role === "admin",
      };
      return h.view("dashboard_view", viewData);
    },
  },

  addCategory: {
    validate: {
      payload: CategorySpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        return h
          .view("dashboard_view", {
            title: "Category error",
            categories: await db.categoryStore.getUserCategories(request.auth.credentials._id),
            errors: error.details,
            admin: request.auth.credentials.role === "admin",
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const newCategory = {
        userid: loggedInUser._id,
        name: request.payload.name,
      };
      await db.categoryStore.addCategory(newCategory);
      return h.redirect("/dashboard");
    },
  },

  deleteCategory: {
    handler: async function (request, h) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      await db.categoryStore.deleteCategoryById(category._id);
      return h.redirect("/dashboard");
    },
  },
};
