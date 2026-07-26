const express = require("express");
const postController = require("../controllers/postController");
const requireLogin = require("../middleware/requireLogin");
const validate = require("../middleware/validate");
const {
  commentSchema,
  postActionSchema,
  postSchema,
  updatePostSchema
} = require("../validators/postValidators");

const router = express.Router();

router.get("/allpost", requireLogin, postController.getAllPosts);
router.get("/getsubpost", requireLogin, postController.getFollowingPosts);
router.post("/createpost", requireLogin, validate(postSchema), postController.createPost);
router.put("/updatepost/:postId", requireLogin, validate(updatePostSchema), postController.updatePost);
router.get("/mypost", requireLogin, postController.getMyPosts);
router.put("/like", requireLogin, validate(postActionSchema), postController.likePost);
router.put("/unlike", requireLogin, validate(postActionSchema), postController.unlikePost);
router.put("/comment", requireLogin, validate(commentSchema), postController.addComment);
router.delete("/deletepost/:postId", requireLogin, postController.deletePost);

module.exports = router;
