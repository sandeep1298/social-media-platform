const express = require("express");
const authController = require("../controllers/authController");
const requireLogin = require("../middleware/requireLogin");
const validate = require("../middleware/validate");
const { signinSchema, signupSchema } = require("../validators/authValidators");

const router = express.Router();

router.post("/signup", validate(signupSchema), authController.signup);
router.post("/signin", validate(signinSchema), authController.signin);
router.get("/me", requireLogin, authController.me);

module.exports = router;
