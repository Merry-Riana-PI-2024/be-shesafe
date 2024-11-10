const express = require("express");

const {
  addCategory,
  getAllCategory,
  editCategory,
  deleteCategoryById,
} = require("../controllers/category-controller");

const route = express.Router();

route.post("/", addCategory);
route.get("/", getAllCategory);
route.put("/", editCategory);
route.delete("/", deleteCategoryById);

module.exports = route;
