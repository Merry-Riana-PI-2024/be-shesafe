const express = require("express");
const {
  addCases,
  getCases,
  editCases,
  deletedCases,
  getCasesById,
  addCasesDraft,
  getJournalforCasesByID,
  getJournalById,
} = require("../controllers/cases-controller");
// const { regist, login, getUser } = require("../controllers/auth-controller");

const route = express.Router();

route.post("/", addCases);
route.post("/draft", addCasesDraft);
route.get("/", getCases);
route.get("/:id", getCasesById);
route.put("/:id", editCases);
route.delete("/", deletedCases);
route.get("/byjournal/:id", getJournalforCasesByID);
route.get("/byjournal", getJournalById);

module.exports = route;
