import Mongoose from "mongoose";

const { Schema } = Mongoose;

const addressSchema = new Schema({
  country: String,
  city: String,
  postcode: Number,
  userid: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const User = Mongoose.model("Addresses", addressSchema);
