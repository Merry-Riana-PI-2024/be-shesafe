const express = require("express");
const {
  addCommentar,
  getCommunity,
  getCommunityById,
  getCommentar,
  addSupportById,
  addSupport,
  deleteSupportById,
  deleteSupport,
  deleteCommentar,
  getSupport,
} = require("../controllers/community-controller");

const route = express.Router();

route.post("/commentar/:id", addCommentar);
route.get("/commentar/:id", getCommentar);
route.delete("/commentar/:casesID", deleteCommentar);
route.get("/", getCommunity);
route.get("/:id", getCommunityById);
route.post("/support/:id", addSupportById);
route.post("/support", addSupport);
route.get("/support/:id", getSupport);
route.delete("/support/:id", deleteSupportById);
route.delete("/support", deleteSupport);

module.exports = route;
