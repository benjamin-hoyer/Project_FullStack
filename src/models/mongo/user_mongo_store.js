import { User } from "./user.js";

export const userMongoStore = {
  async getAllUsers() {
    return User.find().lean();
  },

  async getUserById(id) {
    return User.findOne({ _id: id }).lean() || null;
  },

  async addUser(user) {
    const newUser = new User(user);

    const userObj = await newUser.save();
    return this.getUserById(userObj._id);
  },

  async getUserByEmail(email) {
    return User.findOne({ email: email }).lean() || null;
  },

  async deleteUserById(id) {
    try {
      await User.deleteOne({ _id: id });
    } catch (error) {
      console.log(`User Id not found ${error.message}`);
    }
  },

  async deleteAllUsers() {
    await User.deleteMany({});
  },
};
