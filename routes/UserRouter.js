const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.post("/login", UserController.Login);

router.post("/signup", UserController.Signup);

router.post("/set_score", UserController.SetScore);

module.exports = router;