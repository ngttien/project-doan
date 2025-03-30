const express = require("express");
const route = express.Router();

const UserAdminController = require("../app/controller/UserAdminController");

route.use("/getusersadmin", UserAdminController.getUsersAdmin);
route.use("/updateuseradmin", UserAdminController.updateUserAdmin);
route.use("/deleteuseradmin", UserAdminController.deleteUserAdmin);

module.exports = route;
