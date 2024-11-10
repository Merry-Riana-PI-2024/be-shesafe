const express = require("express");
const { getAllCategoryClient } = require("../controllers/category-controller");

const route = express.Router();

route.get("/", getAllCategoryClient);

module.exports = route;
