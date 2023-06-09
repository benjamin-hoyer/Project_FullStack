import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { HikeArraySpec, HikeSpec, HikeSpecPlus, IdSpec } from "../models/joi_schemas.js";
import { validationError } from "./logger.js";
import { imageStore } from "../models/image_store.js";

export const hikeApi = {
  find: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        return await db.hikeStore.getAllHikes();
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    response: { schema: HikeArraySpec, failAction: validationError },
    description: "Get all hikeApi",
    notes: "Returns all hikeApi",
  },

  findOne: {
    auth: { strategy: "jwt" },
    async handler(request) {
      try {
        const hike = await db.hikeStore.getHikeById(request.params.id);
        if (!hike) {
          return Boom.notFound("No hike with this id");
        }
        return hike;
      } catch (err) {
        return Boom.serverUnavailable("No hike with this id");
      }
    },
    tags: ["api"],
    description: "Find a Hike",
    notes: "Returns a hike",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: HikeSpecPlus, failAction: validationError },
  },

  create: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const hike = await db.hikeStore.addHike(request.params.id, request.payload);
        if (hike) {
          return h.response(hike).code(201);
        }
        return Boom.badImplementation("error creating hike");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a hike",
    notes: "Returns the newly created hike",
    validate: { payload: HikeSpec },
    response: { schema: HikeSpecPlus, failAction: validationError },
  },

  deleteAll: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        await db.hikeStore.deleteAllHikes();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all hikeApi ",
  },

  deleteOne: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const hike = await db.hikeStore.getHikeById(request.params.id);
        if (!hike) {
          return Boom.notFound("No Hike with this id");
        }
        await db.hikeStore.deleteHikeById(hike._id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("No Hike with this id");
      }
    },
    tags: ["api"],
    description: "Delete a hike",
    validate: { params: { id: IdSpec }, failAction: validationError },
  },

  uploadImage: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      const { hikeid } = request.params;
      const { id } = request.params;
      const hike = await db.hikeStore.getHikeById(hikeid);
      try {
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          await imageStore.uploadImage(id, hikeid, file);
          return h.redirect(`/category/${id}/hike/${hikeid}`);
        }
        return h.redirect(`/category/${id}/hike/${hikeid}`);
      } catch (err) {
        return Boom.serverUnavailable("Upload Error");
      }
    },
    tags: ["api"],
    description: "Upload a hike image",
    validate: { params: { id: IdSpec, hikeid: IdSpec }, failAction: validationError },
  },
  deleteImage: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      const { hikeid } = request.params;
      const { id } = request.params;
      const hike = await db.hikeStore.getHikeById(hikeid);
      try {
        await imageStore.deleteImage(id, hikeid);
        return h.redirect(`/category/${id}/hike/${hikeid}`);
      } catch (err) {
        return Boom.serverUnavailable("Upload Error");
      }
    },
  },
};
