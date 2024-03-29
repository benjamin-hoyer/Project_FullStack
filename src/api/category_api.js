import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { validationError } from "./logger.js";
import {
  CategorySpecPlus,
  CategoryArraySpec,
  IdSpec,
  CategorySpec,
} from "../models/joi_schemas.js";

export const categoryApi = {
  find: {
    auth: false,
    handler: async function (request, h) {
      try {
        return await db.categoryStore.getAllCategories();
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    response: { schema: CategoryArraySpec, failAction: validationError },
    description: "Get all Categories",
    notes: "Returns all Categories",
  },

  findUserCategories: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        return await db.categoryStore.getUserCategories(request.params.id);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
    }
  },
  tags: ["api"],
  response: { schema: CategoryArraySpec, failAction: validationError },
  description: "Get all Categories of User",
  notes: "Returns all Categories of User",
},

  findOne: {
    auth: {
      strategy: "jwt",
    },
    async handler(request) {
      try {
        const category = await db.categoryStore.getCategoryById(
          request.params.id
        );
        if (!category) {
          return Boom.notFound("No category with this id");
        }
        return category;
      } catch (err) {
        return Boom.serverUnavailable("No category with this id");
      }
    },
    tags: ["api"],
    description: "Find a category",
    notes: "Returns a category",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: CategorySpecPlus, failAction: validationError },
  },

  create: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const category = request.payload;
        const newCategory = await db.categoryStore.addCategory(category);
        if (newCategory) {
          return h.response(newCategory).code(201);
        }
        return Boom.badImplementation("error creating category");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a category",
    notes: "Returns the newly created category",
    validate: { payload: CategorySpec, failAction: validationError },
    response: { schema: CategorySpecPlus, failAction: validationError },
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const category = await db.categoryStore.getCategoryById(
          request.params.id
        );
        if (!category) {
          return Boom.notFound("No category with this id");
        }
        await db.categoryStore.deleteCategoryById(category._id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("No category with this id");
      }
    },
    tags: ["api"],
    description: "Delete a category",
    validate: { params: { id: IdSpec }, failAction: validationError },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        await db.categoryStore.deleteAllCategories();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all CategoryApi",
  },
};
