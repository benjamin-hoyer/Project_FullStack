import { db } from "../models/db.js";
import { HikeSpec } from "../models/joi_schemas.js";

export const categoriesController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const { id } = request.params;
      const category = await db.categoryStore.getCategoryById(id);

      const viewData = {
        title: "Category",
        category: category,
        admin: loggedInUser.role === "admin",
      };
      return h.view("category_view", viewData);
    },
  },

  addHike: {
    validate: {
      payload: HikeSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        return h
          .view("category_view", {
            title: "Hike error",
            category: await db.categoryStore.getCategoryById(request.params.id),
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      const { id } = request.params;
      const category = await db.categoryStore.getCategoryById(id);
      const newCategory = {
        name: request.payload.name,
        start: request.payload.start,
        end: request.payload.end,
        description: request.payload.description,
        duration: request.payload.duration,
        distance: request.payload.distance,
        lat: request.payload.lat,
        long: request.payload.long,
      };
      try {
        await db.hikeStore.addHike(category._id, newCategory);
      } catch (err) {
        return h
          .view("dashboard_view", {
            title: "Insertion error",
            errors: [{ message: err.message }],
          })
          .takeover()
          .code(400);
      }
      return h.redirect(`/category/${category._id}`);
    },
  },

  deleteHike: {
    handler: async function (request, h) {
      const { id } = request.params;
      const { hikeid } = request.params;
      const category = await db.categoryStore.getCategoryById(id);
      await db.hikeStore.deleteHikeById(hikeid);
      return h.redirect(`/category/${category._id}`);
    },
  },
};
