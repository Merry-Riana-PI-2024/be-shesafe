const express = require("express");
const {
  getAllModule,
  getDetailModule,
} = require("../controllers/edu-controller");
const route = express.Router();

// route.post("/add");
route.get("/", getAllModule); //get module
route.get("/:id", getDetailModule); //get by id untuk melihat detail
// route.put("/:id");
// route.delete("/:id");

module.exports = route;
