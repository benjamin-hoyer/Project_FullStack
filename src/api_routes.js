import { categoryApi } from "./api/category_api.js";
import { hikeApi } from "./api/hike_api.js";
import { userApi } from "./api/user_api.js";

export const apiRoutes = [
  { method: "GET", path: "/api/users", config: userApi.find },
  {
    method: "POST",
    path: "/api/users",
    config: userApi.create,
  },
  { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
  {
    method: "GET",
    path: "/api/users/{id}",
    config: userApi.findOne,
  },

  { method: "GET", path: "/api/categories", config: categoryApi.find },
  {
    method: "POST",
    path: "/api/categories",
    config: categoryApi.create,
  },
  { method: "DELETE", path: "/api/categories", config: categoryApi.deleteAll },
  {
    method: "GET",
    path: "/api/categories/{id}",
    config: categoryApi.findOne,
  },
  {
    method: "DELETE",
    path: "/api/categories/{id}",
    config: categoryApi.deleteOne,
  },

  { method: "GET", path: "/api/hikes", config: hikeApi.find },
  {
    method: "GET",
    path: "/api/hikes/{id}",
    config: hikeApi.findOne,
  },
  {
    method: "POST",
    path: "/api/categories/{id}/hikes",
    config: hikeApi.create,
  },
  { method: "DELETE", path: "/api/hikes", config: hikeApi.deleteAll },
  {
    method: "DELETE",
    path: "/api/hikes/{id}",
    config: hikeApi.deleteOne,
  },

  {
    method: "POST",
    path: "/api/users/authenticate",
    config: userApi.authenticate,
  },
];
