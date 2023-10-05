// Game Controller
const { Request, Response } = require("express");
const { GameApi } = require("../api");

const GameController = {
    /**
     * @param {Request} req
     * @param {Response} res
     */
    async GetQuestions(req, res) {
        try {
            const result = await GameApi.GetQuestions();
            if (result) {
                return res.status(200).json({
                    status: true,
                    result
                });
            }
            else {
                return res.status(400).json({
                    status: false,
                    result,
                    message: "Bad request"
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "Internal server error"
            });
        }
    }
};

module.exports = GameController;
