import Hapi from "@hapi/hapi";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import Cookie from "@hapi/cookie";
import Handlebars from "handlebars";
import jwt from "hapi-auth-jwt2";
import HapiSwagger from "hapi-swagger";
import Joi from "joi";

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { accountsController } from "./controllers/accounts_controller.js";
import { webRoutes } from "./web_routes.js";
import { apiRoutes } from "./api_routes.js";
import { db } from "./models/db.js";
import { validate } from "./api/jwt_utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dotenv Configuration
const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
}

async function init() {
  const server = Hapi.server({
    port: process.env.PORT || 4000,
    routes: { cors: true },
  });

  // Swagger Configuration
  const swaggerOptions = {
    info: {
      title: "Hiking API",
      version: "0.1",
    },
    securityDefinitions: {
      jwt: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
    security: [{ jwt: [] }],
  };

  await server.register(Inert);
  await server.register(Vision);
  await server.register(Cookie);
  await server.register(jwt);
  await server.register({ plugin: HapiSwagger, options: swaggerOptions });

  // Views Configuration
  server.views({
    engines: {
      hbs: Handlebars,
    },
    relativeTo: __dirname,
    path: "./views",
    layoutPath: "./views/layout",
    partialsPath: "./views/partials",
    layout: true,
    isCached: false,
  });

  // Validator
  server.validator(Joi);

  // JWT Configuration
  server.auth.strategy("jwt", "jwt", {
    key: process.env.cookie_password,
    validate: validate,
    verifyOptions: { algorithms: ["HS256"] },
  });

  // Cookie Configuration
  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.cookie_name,
      password: process.env.cookie_password,
      isSecure: false,
    },
    redirectTo: "/",
    validate: accountsController.validate,
  });
  server.auth.default("session");

  // Data bank
  db.init("mongo");

  // Routes
  server.route(webRoutes);
  server.route(apiRoutes);

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

await init();
