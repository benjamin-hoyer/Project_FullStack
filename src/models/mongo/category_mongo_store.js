import { Category } from "./category.js";
import { hikeMongoStore } from "./hike_mongo_store.js";

export const categoryMongoStore = {
  async getAllCategories() {
    return Category.find().lean();
  },
  async addCategory(category) {
    const newCategory = new Category(category);
    const categoryObj = await newCategory.save();
    return this.getCategoryById(categoryObj._id);
  },

  async getCategoryById(id) {
    const category = (await Category.findOne({ _id: id }).lean()) || null;
    if (category) {
      category.hikes =
        (await hikeMongoStore.getHikesByCategoryId(category._id)) || null;
    }
    return category;
  },

  async getUserCategories(id) {
    return Category.find({ userid: id }).lean() || null;
  },

  async updateCategoryById(id, updateCategory) {
    const categoryDoc = await Category.findOne({ _id: id });
    categoryDoc.name = updateCategory.name;
    await categoryDoc.save();
  },

  async deleteCategoryById(id) {
    await hikeMongoStore.deleteHikesByCategoryId(id);
    await Category.deleteOne({ _id: id });
  },

  async deleteAllCategories() {
    await Category.deleteMany({});
  },
  async getAllCategoriesWithHikes() {
    const categories = await Category.find().lean();
    for (let i = 0; i < categories.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      categories[i].hikes = await hikeMongoStore.getHikesByCategoryId(
        categories[i]._id
      );
    }
    return categories;
  },
};
