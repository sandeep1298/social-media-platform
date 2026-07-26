const express = require("express");
const userController = require("../controllers/userController");
const requireLogin = require("../middleware/requireLogin");
const validate = require("../middleware/validate");
const { updateProfileSchema } = require("../validators/userValidators");

const router = express.Router();

router.put("/me/profile", requireLogin, validate(updateProfileSchema), userController.updateProfile);
router.get("/:userId", requireLogin, userController.getProfile);
router.put("/:userId/follow", requireLogin, userController.followUser);
router.put("/:userId/unfollow", requireLogin, userController.unfollowUser);

module.exports = router;
