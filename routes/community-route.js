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
} = require("../controllers/community-controller");

const route = express.Router();

route.post("/commentar/:id", addCommentar);
route.get("/commentar/:id", getCommentar);
route.get("/", getCommunity);
route.get("/:id", getCommunityById);
route.post("/:id/support", addSupportById);
route.post("/support", addSupport);
route.delete("/:id/support", deleteSupportById);
route.delete("/support", deleteSupport);

module.exports = route;
