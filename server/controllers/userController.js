const userService = require("../services/userService");
const { sendSuccess } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getUserProfile(req.params.userId);
  sendSuccess(res, { data: profile });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);
  sendSuccess(res, {
    message: "Profile updated successfully",
    data: { user }
  });
});

const followUser = asyncHandler(async (req, res) => {
  const profile = await userService.followUser(req.user._id, req.params.userId);
  sendSuccess(res, {
    message: "User followed successfully",
    data: profile
  });
});

const unfollowUser = asyncHandler(async (req, res) => {
  const profile = await userService.unfollowUser(req.user._id, req.params.userId);
  sendSuccess(res, {
    message: "User unfollowed successfully",
    data: profile
  });
});

module.exports = {
  followUser,
  getProfile,
  unfollowUser,
  updateProfile
};
