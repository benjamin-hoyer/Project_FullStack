import { db } from "../models/db.js";
import { CategorySpec } from "../models/joi_schemas.js";
import { imageStore } from "../models/image_store.js";

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
      try{
        await db.categoryStore.addCategory(newCategory);
      } catch (err) {
        return h.view("dashboard_view", {
          title: "Category error",
          categories: await db.categoryStore.getUserCategories(request.auth.credentials._id),
          errors: [{ message: "Category already exists" }],
          admin: request.auth.credentials.role === "admin",
        });
      }
      return h.redirect("/dashboard");
    },
  },

  deleteCategory: {
    handler: async function (request, h) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      const hike = await db.hikeStore.getHikesByCategoryId(request.params.id);
      if (hike) {
        for (let i = 0; i < hike.length; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          await imageStore.deleteAllImagesByHike(hike[i]); // delete all images associated with the hike
        }
        await db.hikeStore.deleteHikesByCategoryId(category._id); // delete all hikes associated with the category
      }
      await db.categoryStore.deleteCategoryById(category._id); // delete the category
      return h.redirect("/dashboard");
    },
  },
};
