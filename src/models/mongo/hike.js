import Mongoose from "mongoose";

const { Schema } = Mongoose;

const HikeSchema = new Schema({
  name: String,
  start: String,
  end: String,
  description: String,
  duration: Number,
  distance: Number,
  lat: Number,
  long: Number,

  categoryid: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
});

export const Hike = Mongoose.model("Hike", HikeSchema);
