const express = require("express");
const searchController = require("../controllers/searchController");
const requireLogin = require("../middleware/requireLogin");

const router = express.Router();

router.get("/", requireLogin, searchController.search);

module.exports = router;
