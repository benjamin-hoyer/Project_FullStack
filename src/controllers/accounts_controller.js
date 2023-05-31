import { db } from "../models/db.js";
import { UserCredentialsSpec, UserSpec } from "../models/joi_schemas.js";

export const accountsController = {
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to Hiking" });
    },
  },
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up for Storing your Hikes" });
    },
  },

  signup: {
    auth: false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h
          .view("signup-view", {
            title: "Sign up error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      const user = request.payload;
      user.role = "user";
      try {
        await db.userStore.addUser(user);
      } catch (e) {
        return h
          .view("signup-view", {
            title: "Sign up error",
            errors: [{ message: e.message }],
          })
          .takeover()
          .code(400);
      }
      return h.redirect("/");
    },
  },
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login_view", { title: "Login to Hikes" });
    },
  },
  login: {
    auth: false,
    validate: {
      payload: UserCredentialsSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h
          .view("login_view", { title: "Login error", errors: error.details })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      const user = await db.userStore.getUserByEmail(email);
      if (!user || user.password !== password) {
        return h.redirect("/");
      }
      request.cookieAuth.set({ id: user._id });
      return h.redirect("/dashboard");
    },
  },
  logout: {
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },
  async validate(request, session) {
    try {
      const user = await db.userStore.getUserById(session.id);
      if (!user) {
        return { isValid: false };
      }
      return { isValid: true, credentials: user };
    } catch (e) {
      console.log(e.message);
      return { isValid: false };
    }
  },
};
