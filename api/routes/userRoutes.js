const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

// GET user list
router.get("/", userController.user_list);

// POST User
router.post("/", userController.user_create);

// GET single user
router.get("/:userid", userController.user_detail);

// Put User
router.put("/:userid", userController.user_update);

// Delete User
router.delete("/:userid", userController.user_delete);

module.exports = router;
