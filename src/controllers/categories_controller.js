import { db } from "../models/db.js";

export const categoriesController = {
  index: {
    handler: async function (request, h) {
      const id = request.params.id;
      const category = await db.categoryStore.getCategoryById(id);

      const viewData = {
        title: "Category",
        category: category,
      };
      return h.view("category_view", viewData);
    },
  },

  addHike: {
    handler: async function (request, h) {
      const id = request.params.id;
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
          .view(`dashboard_view`, {
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
      const id = request.params.id;
      const category = await db.categoryStore.getCategoryById(id);
      await db.categoryStore.deleteCategoryById(category._id);
      return h.redirect(`/category/${category._id}`);
    },
  },
};
