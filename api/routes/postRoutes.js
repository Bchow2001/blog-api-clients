const express = require("express");
const passport = require("passport");
require("../config");

const router = express.Router();

const postController = require("../controllers/postController");

// GET post list
router.get(
	"/",
	passport.authenticate("jwt-view", { session: false }),
	postController.index,
);

// POST new post
router.post(
	"/",
	passport.authenticate("jwt-author", { session: false }),
	postController.post_create,
);

// GET single post
router.get("/:postid", postController.post_detail);

// PUT post
router.put(
	"/:postid",
	passport.authenticate("jwt-author", { session: false }),
	postController.post_update,
);

// DELETE post
router.delete(
	"/:postid",
	passport.authenticate("jwt-author", { session: false }),
	postController.post_delete,
);

// POST new comment
router.post(
	"/:postid/comments",
	passport.authenticate("jwt-view", { session: false }),
	postController.comment_create,
);

// PUT comment
router.put(
	"/:postid/comments/:commentid",
	passport.authenticate("jwt-view", { session: false }),
	postController.comment_update,
);

// DELETE comment
router.delete(
	"/:postid/comments/:commentid",
	passport.authenticate("jwt-view", { session: false }),
	postController.comment_delete,
);

module.exports = router;
