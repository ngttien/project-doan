const express = require("express");
const route = express.Router();

const AuthAdminController = require("../app/controller/AuthAdminController");
route.use("/login", AuthAdminController.login);
route.use("/checklogin", AuthAdminController.checkLogin);
route.use("/logout", AuthAdminController.logout);
route.use("/register", AuthAdminController.register);

module.exports = route;
