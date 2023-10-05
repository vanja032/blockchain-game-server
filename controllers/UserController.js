// User Controller
const { Request, Response } = require("express");
const { UserApi } = require("../api");

const UserController = {
  /**
   * @param {Request} req
   * @param {Response} res
   */
  async Login(req, res) {
    try {
      const result = await UserApi.Login(req.body.username, req.body.password, req.body.security_key);
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
  },

  /**
   * @param {Request} req
   * @param {Response} res
   */
  async Signup(req, res) {
    try {
      const result = await UserApi.Signup(req.body.username, req.body.email, req.body.password, req.body.security_key);
      if (result) {
        return res.status(200).json({
          status: true
        });
      }
      else {
        return res.status(403).json({
          status: false,
          message: "Bad request"
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal server error"
      });
    }
  },

  /**
   * @param {Request} req
   * @param {Response} res
   */
  async SetScore(req, res) {
    try {
      const result = await UserApi.SetScore(req.body.username, req.body.password, req.body.score, req.body.security_key);
      if (result) {
        return res.status(200).json({
          status: true
        });
      }
      else {
        return res.status(403).json({
          status: false,
          message: "Bad request"
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal server error"
      });
    }
  },
};

module.exports = UserController;
