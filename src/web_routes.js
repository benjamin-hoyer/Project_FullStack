import { accountsController } from "./controllers/accounts_controller.js";
import { dashboardController } from "./controllers/dashboard_controller.js";
import { categoriesController } from "./controllers/categories_controller.js";
import { adminController } from "./controllers/admin_controller.js";

export const webRoutes = [
  { method: "GET", path: "/", config: accountsController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "GET", path: "/logout", config: accountsController.logout },
  { method: "POST", path: "/register", config: accountsController.signup },
  { method: "POST", path: "/authenticate", config: accountsController.login },

  { method: "GET", path: "/dashboard", config: dashboardController.index },
  {
    method: "POST",
    path: "/dashboard/addcategory",
    config: dashboardController.addCategory,
  },
  {
    method: "GET",
    path: "/dashboard/deletecategory/{id}",
    config: dashboardController.deleteCategory,
  },

  { method: "GET", path: "/category/{id}", config: categoriesController.index },
  {
    method: "POST",
    path: "/category/{id}/addhike",
    config: categoriesController.addHike,
  },
  {
    method: "GET",
    path: "/category/{id}/deletehike/{hikeid}",
    config: categoriesController.deleteHike,
  },

  { method: "GET", path: "/admin", config: adminController.showAdmin },
  { method: "POST", path: "/admin/adduser", config: adminController.addUser },
  {
    method: "GET",
    path: "/admin/deleteuser/{id}",
    config: adminController.deleteUser,
  },
  {
    method: "GET",
    path: "/{param*}",
    handler: { directory: { path: "./public" } },
    options: { auth: false },
  },
];
