const UserService = require("../service/user");

class UserController {
  async createUser(req, res) {
    try {
      // getting user token from the service
      const tokens = await UserService.createUser(req.body);

      // sending user token to user after succesful registration
      res.status(201).json(tokens);
    } catch (error) {
      console.log(error.message);

      // send unauthorized response if user already exists
      if (error.message === "user-exists") {
        return res.status(401).json({
          error: "user-exists",
          message: "user already exists",
        });
      }

      res.status(500).json({
        error: error.message,
      });
    }
  }

  async loginUser(req, res) {
    try {
      // getting user token from the service
      console.log("Hello");
      const tokens = await UserService.loginUser(req.body);

      // sending user token to user after succesful registration
      res.status(200).json(tokens);
    } catch (error) {
      console.log(error.message);
      // send not found response if user is not found while loging in
      if (error.message === "not-found") {
        return res.status(404).json({
          error: "not-found",
          message: "User does not exist",
        });
      }

      // send invalid credentials if user enters wrong password
      if (error.message === "invalid-credentials") {
        return res.status(401).json({
          error: "invalid-credentials",
          message: "email or password is incorrect",
        });
      }
      res.status(500).json({
        error: error.message,
      });
    }
  }

  async logoutUser(req, res) {
    try {
      // call the logout user service
      await UserService.logoutUser(req.header("Authorization"));

      // send status 204 if user succesfully logs out
      res.sendStatus(204);
    } catch (error) {
      // send response 400 if no user to logout
      if (error.message === "invalid-logout") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async refreshToken(req, res) {
    try {
      const tokens = await UserService.refreshToken(
        req.header("Authorization")
      );

      res.status(200).json(tokens);
    } catch (error) {
      if (error.message === "invalid-token") {
        return res.status(403).json({
          error: "invalid-token",
          message: "token is invalid",
        });
      }

      res.status(500).json({
        error: error.message,
      });
    }
  }
}

module.exports = new UserController();
