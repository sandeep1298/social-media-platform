const postService = require("../services/postService");
const { sendSuccess } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await postService.getPosts(req.query);
  sendSuccess(res, { data: { posts } });
});

const getFollowingPosts = asyncHandler(async (req, res) => {
  const posts = await postService.getFollowingPosts(req.user);
  sendSuccess(res, { data: { posts } });
});

const createPost = asyncHandler(async (req, res) => {
  const post = await postService.createPost(req.user, req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: "Post created successfully",
    data: { post }
  });
});

const updatePost = asyncHandler(async (req, res) => {
  const post = await postService.updatePost(req.user._id, req.params.postId, req.body);
  sendSuccess(res, {
    message: "Post updated successfully",
    data: { post }
  });
});

const getMyPosts = asyncHandler(async (req, res) => {
  const mypost = await postService.getPosts({ postedBy: req.user._id, sort: "recent" });
  sendSuccess(res, { data: { mypost } });
});

const likePost = asyncHandler(async (req, res) => {
  const post = await postService.likePost(req.user._id, req.body.postId);
  sendSuccess(res, {
    message: "Post liked successfully",
    data: { post }
  });
});

const unlikePost = asyncHandler(async (req, res) => {
  const post = await postService.unlikePost(req.user._id, req.body.postId);
  sendSuccess(res, {
    message: "Post unliked successfully",
    data: { post }
  });
});

const addComment = asyncHandler(async (req, res) => {
  const post = await postService.addComment(req.user._id, req.body);
  res.json(post);
});

const deletePost = asyncHandler(async (req, res) => {
  const deletedPost = await postService.deletePost(req.user._id, req.params.postId);
  sendSuccess(res, {
    message: "Post deleted successfully",
    data: {
      _id: deletedPost._id,
      deletedPost
    }
  });
});

module.exports = {
  addComment,
  createPost,
  deletePost,
  getAllPosts,
  getFollowingPosts,
  getMyPosts,
  likePost,
  unlikePost,
  updatePost
};
