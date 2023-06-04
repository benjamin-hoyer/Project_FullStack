import axios from "axios";

import { serviceUrl } from "../fixtures.js";

export const apiService = {
  hikingUrl: serviceUrl,

  async createUser(user) {
    const res = await axios.post(`${this.hikingUrl}/api/users`, user);
    return res.data;
  },

  async getUser(id) {
    const res = await axios.get(`${this.hikingUrl}/api/users/${id}`);
    return res.data;
  },

  async getAllUsers() {
    const res = await axios.get(`${this.hikingUrl}/api/users`);
    return res.data;
  },

  async deleteAllUsers() {
    const res = await axios.delete(`${this.hikingUrl}/api/users`);
    return res.data;
  },
  /* *************** Categories ************************** */
  async createCategory(category) {
    const res = await axios.post(`${this.hikingUrl}/api/categories`, category);
    return res.data;
  },

  async getCategory(id) {
    const res = await axios.get(`${this.hikingUrl}/api/categories/${id}`);
    return res.data;
  },

  async getAllCategories() {
    const res = await axios.get(`${this.hikingUrl}/api/categories`);
    return res.data;
  },

  async deleteAllCategories() {
    const res = await axios.delete(`${this.hikingUrl}/api/categories`);
    return res.data;
  },

  async deleteCategory(id) {
    return axios.delete(`${this.hikingUrl}/api/categories/${id}`);
  },

  /* *************** Hikes *********************** */
  async createHike(id, hike) {
    const res = await axios.post(
      `${this.hikingUrl}/api/categories/${id}/hikes`,
      hike
    );
    return res.data;
  },

  async getHike(id) {
    const res = await axios.get(`${this.hikingUrl}/api/hikes/${id}`);
    return res.data;
  },

  async getAllHikes() {
    const res = await axios.get(`${this.hikingUrl}/api/hikes`);
    return res.data;
  },

  async deleteAllHikes() {
    const res = await axios.delete(`${this.hikingUrl}/api/hikes`);
    return res.data;
  },

  async deleteHike(id) {
    return await axios.delete(`${this.hikingUrl}/api/hikes/${id}`);
  },

  async authenticate(user) {
    let response = 0;
    response = await axios.post(
      `${this.hikingUrl}/api/users/authenticate`,
      user
    );
    axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
    return response.data;
  },

  clearAuth() {
    axios.defaults.headers.common.Authorization = "";
  },

  isAuthenticated() {
    return axios.defaults.headers.common.Authorization !== "";
  },
};
