import { accountsController } from "./controllers/accounts_controller.js";
import { dashboardController } from "./controllers/dashboard_controller.js";

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

  {
    method: "GET",
    path: "/{param*}",
    handler: { directory: { path: "./public" } },
    options: { auth: false },
  },
];
