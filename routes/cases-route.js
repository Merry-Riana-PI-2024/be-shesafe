const express = require("express");
const {
  addCases,
  getCases,
  editCases,
  deletedCases,
  getCasesById,
} = require("../controllers/cases-controller");
// const { regist, login, getUser } = require("../controllers/auth-controller");

const route = express.Router();

route.post("/", addCases);
route.get("/", getCases);
route.get("/:id", getCasesById);
route.put("/:id", editCases);
route.delete("/", deletedCases);

module.exports = route;
