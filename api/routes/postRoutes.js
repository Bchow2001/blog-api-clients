const express = require("express");

const router = express.Router();

const postController = require("../controllers/postController");

// GET post list
router.get("/", postController.index);

// POST new post
router.post("/", postController.post_create);

// GET single post
router.get("/:postid", postController.post_detail);

// PUT post
router.put("/:postid", postController.post_update);

// DELETE post
router.delete("/:postid", postController.post_delete);

// POST new comment
router.post("/:postid/comments", postController.comment_create);

// PUT comment
router.put("/:postid/comments/:commentid", postController.comment_update);

// DELETE comment
router.delete("/:postid/comments/:commentid", postController.comment_delete);

module.exports = router;
