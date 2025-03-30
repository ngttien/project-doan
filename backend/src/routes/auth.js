const express = require("express");
const route = express.Router();

const AuthController = require("../app/controller/AuthController");
route.use("/login", AuthController.login);
route.use("/checklogin", AuthController.checklogin);
route.use("/logout", AuthController.logout);
route.use("/register", AuthController.register);
route.use("/verify", AuthController.verify);
route.use("/forgotpw", AuthController.forgot);
route.use("/resetpass", AuthController.ResetPass);

module.exports = route;
