const authService = require("../services/authService");
const userService = require("../services/userService");
const { sendSuccess } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

const signup = asyncHandler(async (req, res) => {
  const user = await authService.signup(req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: "Registered successfully",
    data: { user }
  });
});

const signin = asyncHandler(async (req, res) => {
  const user = await authService.signin(req.body);
  sendSuccess(res, {
    message: "Logged in successfully",
    data: { user }
  });
});

const me = asyncHandler(async (req, res) => {
  const user = await userService.getCurrentUser(req.user._id);
  sendSuccess(res, { data: { user } });
});

module.exports = { me, signin, signup };
