import Joi from "joi";

/* ********************Users*************************** */

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserCredentialsSpec = Joi.object()
  .keys({
    email: Joi.string().trim().email().example("obi@kenobi.com").required(),
    password: Joi.string().example("secret").required(),
  })
  .label("UserCredentials");

export const UserSpec = UserCredentialsSpec.keys({
  firstName: Joi.string().trim().example("Obi").required(),
  lastName: Joi.string().trim().example("Kenobi").required(),
}).label("UserDetails");

export const UserSpecPlus = UserSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
  role: Joi.string().required().valid("user", "admin").example("user"),
}).label("UserPlus");

export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");

/* ******************** Hike *************************** */

export const HikeSpec = Joi.object()
  .keys({
    name: Joi.string().trim().required().example("Hike 1"),
    start: Joi.string().trim().required().example("Regensburg"),
    end: Joi.string().trim().required().example("Nürnberg"),
    description: Joi.string().trim().allow("").optional().example("A lot of lakes along the trail"),
    duration: Joi.number().allow("").optional().example(450),
    distance: Joi.number().allow("").optional().example(1200),
    lat: Joi.number().allow("").required().example(23.42343),
    long: Joi.number().allow("").required().example(12.5434534),
    img: Joi.string().allow("").optional().example("https://res.cloudinary.com/image.jpg"),
    categoryid: IdSpec,
  })
  .label("Hike");

export const HikeSpecPlus = HikeSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("HikePlus");

export const HikeArraySpec = Joi.array().items(HikeSpecPlus).label("HikeArray");

/* ******************** Categories *************************** */

export const CategorySpec = Joi.object()
  .keys({
    name: Joi.string().trim().required().example("Level 1"),
    userid: IdSpec,
    hikes: HikeArraySpec,
  })
  .label("Category");

export const CategorySpecPlus = CategorySpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("CategoryPlus");

export const CategoryArraySpec = Joi.array().items(CategorySpecPlus).label("CategoryArray");

/* ********************Authentication*************************** */
export const JwtAuth = Joi.object()
  .keys({
    success: Joi.boolean().example("true").required(),
    token: Joi.string().example("eyJhbGciOiJND.g5YmJisIjoiaGYwNTNjAOhE.gCWGmY5-YigQw0DCBo").required(),
  })
  .label("JwtAuth");
