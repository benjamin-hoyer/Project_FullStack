import { Hike } from "./hike.js";

export const hikeMongoStore = {
  async getAllHikes() {
    return Hike.find().lean();
  },
  async addHike(categoryId, hike) {
    hike.categoryid = categoryId;
    const newHike = new Hike(hike);
    const hikeObj = await newHike.save();
    return this.getHikeById(hikeObj._id);
  },
  async getHikeById(id) {
    return Hike.findOne({ _id: id }).lean() || null;
  },

  async getHikesByCategoryId(id) {
    return Hike.find({ categoryid: id }).lean() || null;
  },

  async deleteHikeById(id) {
    await Hike.deleteOne({ _id: id });
  },

  async deleteAllHikes() {
    await Hike.deleteMany({});
  },

  async updateHikeById(id, updatetHike) {
    const hikeDoc = await Hike.findOne({ _id: id });
    hikeDoc.name = updatetHike.name;
    hikeDoc.start = updatetHike.start;
    hikeDoc.end = updatetHike.end;
    hikeDoc.description = updatetHike.description;
    hikeDoc.duration = updatetHike.duration;
    hikeDoc.distance = updatetHike.distance;
    hikeDoc.lat = updatetHike.lat;
    hikeDoc.long = updatetHike.long;
    await hikeDoc.save();
  },
};
