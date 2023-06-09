import { HikeSpec } from "../models/joi_schemas.js";
import { db } from "../models/db.js";
import { imageStore } from "../models/image_store.js";

export const hikeController = {
  index: {
    handler: async function (request, h) {
      const { id } = request.params;
      const { hikeid } = request.params;
      const category = await db.categoryStore.getCategoryById(id);
      const hike = await db.hikeStore.getHikeById(hikeid);
      const viewData = {
        title: "Update Hike",
        category: category,
        hike: hike,
        admin: request.auth.credentials.role === "admin",
      };
      return h.view("hike_view", viewData);
    },
  },

  update: {
    validate: {
      payload: HikeSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        return h
          .view("hike_view", {
            title: "Update hike error",
            errors: error.details,
            category: await db.categoryStore.getCategoryById(request.params.id),
            hike: await db.hikeStore.getHikeById(request.params.hikeid),
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      const { hikeid } = request.params;
      const newHike = {
        name: request.payload.name,
        start: request.payload.start,
        end: request.payload.end,
        description: request.payload.description,
        duration: request.payload.duration,
        distance: request.payload.distance,
        lat: request.payload.lat,
        long: request.payload.long,
      };
      await db.hikeStore.updateHikeById(hikeid, newHike);
      return h.redirect(`/category/${request.params.id}/hike/${hikeid}`);
    },
  },

  uploadImage: {
    handler: async function (request, h) {
      const { hikeid } = request.params;
      const { id } = request.params;
      const hike = await db.hikeStore.getHikeById(hikeid);
      try {
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const url = await imageStore.uploadImage(file);
          hike.img.push(url);
          await db.hikeStore.updateHikeById(hike._id, hike);
        }
        return h.redirect(`/category/${id}/hike/${hikeid}`);
      } catch (err) {
        console.log(err);
        return h.view("hike_view", {
          title: "Upload error",
          errors: [{ message: "Error Uploading Images" }],
          hike: hike,
          category: await db.categoryStore.getCategoryById(id),
          admin: request.auth.credentials.role === "admin",
        });
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },
  deleteImg: {
    handler: async function (request, h) {
      const { hikeid } = request.params;
      const { id } = request.params;
      const img = request.payload.image;
      const hike = await db.hikeStore.getHikeById(hikeid);
      const hikeIndex = hike.img.indexOf(img);
      const imgUrl = new URL(img);
      const publicId = imgUrl.pathname.split("/").pop().split(".")[0];
      if (hikeIndex > -1) {
        hike.img.splice(hikeIndex, 1);
        await db.hikeStore.updateHikeById(hikeid, hike);
        try {
          await imageStore.deleteImage(publicId);
        } catch (err) {
          console.log(err);
        }
      }
      return h.redirect(`/category/${id}/hike/${hikeid}`);
    },
  },
};
