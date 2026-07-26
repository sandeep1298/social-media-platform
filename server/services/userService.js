const mongoose = require("mongoose");
const User = require("../models/user");
const Post = require("../models/post");
const { deleteCachePattern, getCache, setCache } = require("../config/redis");
const { ApiError } = require("../utils/errors");
const { formatUser } = require("../utils/formatters");

const ensureObjectId = (id, label = "User ID") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `Invalid ${label}`);
  }
};

const invalidateUserCaches = async () => {
  await Promise.all([
    deleteCachePattern("profile:*"),
    deleteCachePattern("feed:*"),
    deleteCachePattern("search:*")
  ]);
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  return formatUser(user);
};

const getUserProfile = async (profileId) => {
  ensureObjectId(profileId);

  const cacheKey = `profile:${profileId}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const user = await User.findById(profileId).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const posts = await Post.find({ postedBy: profileId })
    .populate("postedBy", "_id name username profilePic")
    .populate("comments.postedBy", "_id name username profilePic")
    .sort({ createdAt: -1 });

  const payload = { user: formatUser(user), posts };
  await setCache(cacheKey, payload, 120);
  return payload;
};

const updateProfile = async (userId, updates) => {
  if (updates.username) {
    const existingUser = await User.findOne({
      username: updates.username.toLowerCase(),
      _id: { $ne: userId }
    });

    if (existingUser) {
      throw new ApiError(422, "Username is already taken");
    }
  }

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true
  });

  await invalidateUserCaches();
  return formatUser(user);
};

const followUser = async (currentUserId, targetUserId) => {
  ensureObjectId(targetUserId);

  if (currentUserId.toString() === targetUserId.toString()) {
    throw new ApiError(400, "You cannot follow yourself");
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    throw new ApiError(404, "User not found");
  }

  await User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } });
  await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUserId } });

  await invalidateUserCaches();
  return getUserProfile(targetUserId);
};

const unfollowUser = async (currentUserId, targetUserId) => {
  ensureObjectId(targetUserId);

  await User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } });
  await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } });

  await invalidateUserCaches();
  return getUserProfile(targetUserId);
};

module.exports = {
  followUser,
  getCurrentUser,
  getUserProfile,
  unfollowUser,
  updateProfile
};
