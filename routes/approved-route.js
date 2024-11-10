const express = require("express");
const {
  approvedCases,
  approvedUser,
  getDataUser,
  getDataCases,
} = require("../controllers/approved-controller");

const route = express.Router();
route.put("/case", approvedCases);
route.put("/user", approvedUser);
route.get("/case", getDataCases);
route.get("/user", getDataUser);

module.exports = route;
