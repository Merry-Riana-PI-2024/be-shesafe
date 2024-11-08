const express = require("express");
const { getAllCategoryClient, getCategoryById } = require("../controllers/category-controller");

const route = express.Router();

route.get("/", getAllCategoryClient);
route.get("/:id", getCategoryById);

module.exports = route;
