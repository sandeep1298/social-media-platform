const mongoose = require("mongoose");
const Post = require("../models/post");
const User = require("../models/user");
const { deleteCachePattern, getCache, setCache } = require("../config/redis");
const { ApiError } = require("../utils/errors");

const populatePost = (query) =>
  query
    .populate("postedBy", "_id name username profilePic")
    .populate("comments.postedBy", "_id name username profilePic");

const ensurePostId = (postId) => {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new ApiError(400, "Invalid Post ID");
  }
};

const getSort = (sort = "recent") => {
  const normalized = sort.toLowerCase();
  const sortMap = {
    recent: { createdAt: -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    az: { title: 1 },
    "a-z": { title: 1 },
    za: { title: -1 },
    "z-a": { title: -1 }
  };

  return sortMap[normalized] || sortMap.recent;
};

const invalidatePostCaches = async () => {
  await Promise.all([
    deleteCachePattern("feed:*"),
    deleteCachePattern("profile:*"),
    deleteCachePattern("search:*")
  ]);
};

const findUsersForSearch = async (query) => {
  if (!query) return [];
  const regex = new RegExp(query, "i");
  return User.find({
    $or: [{ username: regex }, { name: regex }]
  }).select("_id name username profilePic bio followers following");
};

const getPosts = async ({ q = "", sort = "recent", postedBy } = {}) => {
  const cacheKey = `feed:${postedBy || "all"}:${q}:${sort}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const filter = {};

  if (postedBy) {
    filter.postedBy = postedBy;
  }

  if (q) {
    const matchingUsers = await findUsersForSearch(q);
    const matchingUserIds = matchingUsers.map((user) => user._id);
    const regex = new RegExp(q, "i");
    filter.$or = [
      { title: regex },
      { body: regex },
      { postedBy: { $in: matchingUserIds } }
    ];
  }

  const posts = await populatePost(Post.find(filter).sort(getSort(sort)));
  await setCache(cacheKey, posts, 45);
  return posts;
};

const getFollowingPosts = async (user) => {
  const posts = await populatePost(
    Post.find({ postedBy: { $in: user.following || [] } }).sort({ createdAt: -1 })
  );
  return posts;
};

const createPost = async (user, postDetails) => {
  const post = await Post.create({
    ...postDetails,
    postedBy: user._id
  });

  await invalidatePostCaches();
  return await populatePost(Post.findById(post._id));
};

const updatePost = async (userId, postId, updates) => {
  ensurePostId(postId);

  const post = await Post.findById(postId).populate("postedBy", "_id");
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.postedBy._id.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  Object.assign(post, updates);
  await post.save();

  await invalidatePostCaches();
  return await populatePost(Post.findById(post._id));
};

const deletePost = async (userId, postId) => {
  ensurePostId(postId);

  const post = await Post.findById(postId).populate("postedBy", "_id");
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.postedBy._id.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  await Post.deleteOne({ _id: post._id });
  await invalidatePostCaches();
  return post;
};

const likePost = async (userId, postId) => {
  ensurePostId(postId);
  const post = await populatePost(
    Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true }
    )
  );

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  await invalidatePostCaches();
  return post;
};

const unlikePost = async (userId, postId) => {
  ensurePostId(postId);
  const post = await populatePost(
    Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    )
  );

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  await invalidatePostCaches();
  return post;
};

const addComment = async (userId, { postId, text }) => {
  ensurePostId(postId);

  const comment = { text, postedBy: userId };
  const post = await populatePost(
    Post.findByIdAndUpdate(
      postId,
      { $push: { comments: comment } },
      { new: true }
    )
  );

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  await invalidatePostCaches();
  return post;
};

module.exports = {
  addComment,
  createPost,
  deletePost,
  findUsersForSearch,
  getFollowingPosts,
  getPosts,
  likePost,
  unlikePost,
  updatePost
};
