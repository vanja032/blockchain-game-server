const { Config } = require("./config");
const express = require("express");
const parser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(parser.urlencoded({ extended: true })); // "extended = true" is for other types except strings
app.use(parser.json());

app.use(cors({
    origin: Config.Config.ALLOWED_ORIGINS,
    methods: Config.Config.ALLOWED_METHODS
}));

const UserRouter = require("./routes/UserRouter");
app.use("/api/user", UserRouter);

const GameRouter = require("./routes/GameRouter");
app.use("/api/game", GameRouter);

app.use("/", (req, res) => {
    return res.status(404).json({
        status: false,
        message: "Api not found"
    });
});

module.exports = app;