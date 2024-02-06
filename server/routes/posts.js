import express from "express";
import { addComment, getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

router.patch("/:id/addComment", verifyToken, addComment)

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

export default router;