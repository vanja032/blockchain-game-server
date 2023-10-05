const express = require("express");
const router = express.Router();
const GameController = require("../controllers/GameController");

router.get("/get_questions", GameController.GetQuestions);

module.exports = router;