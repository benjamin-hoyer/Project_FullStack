import * as cloudinary from "cloudinary";
import { writeFileSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

const credentials = {
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
};
cloudinary.config(credentials);

export const imageStore = {
  getAllImages: async function () {
    const result = await cloudinary.v2.api.resources();
    return result.resources;
  },

  uploadImage: async function (imagefile) {
    writeFileSync("./public/temp.img", imagefile);
    const response = await cloudinary.v2.uploader.upload("./public/temp.img");
    return response.url;
  },

  deleteImage: async function (img) {
    await cloudinary.v2.uploader.destroy(img, {});
  },

  deleteAllImagesByHike: async function (hike) {
    const deleteImg = [];
    for (let i = 0; i < hike.img.length; i+=1) {
      const imgUrl = new URL(hike.img[i]);
      const publicId = imgUrl.pathname.split("/").pop().split(".")[0];
      deleteImg.push(publicId);
      }
    await cloudinary.v2.api.delete_resources(deleteImg,{} );
    hike.img = [];
    return hike;
  }

};
