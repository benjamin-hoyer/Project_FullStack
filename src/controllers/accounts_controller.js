import { db } from "../models/db.js";

export const accountsController = {
  //show index
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to Playlist" });
    },
  },
  //show signup
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up for Playlist" });
    },
  },
  //Signup
  signup: {
    auth: false,
    validate: {
      //payload: UserSpec,
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
      try {
        await db.userStore.addUser(user);
      } catch (e) {
        return h.redirect("/");
      }
      return h.redirect("/");
    },
  },
  //Show Login
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login-view", { title: "Login to Playlist" });
    },
  },
  //Login
  login: {
    auth: false,
    validate: {
      //payload: UserCredentialsSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h
          .view("login-view", { title: "Login error", errors: error.details })
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
  //Logout
  logout: {
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },
  //Validation
  async validate(request, session) {
    try {
      const user = await db.userStore.getUserById(session.id);
      if (!user) {
        return { valid: false };
      }
      return { valid: true, credentials: user };
    } catch (e) {
      console.log(e.message);
      return { valid: false };
    }
  },
};
