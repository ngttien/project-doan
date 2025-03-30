const express = require("express");
const route = express.Router();

const roomController = require("../app/controller/RoomController");
route.use("/", roomController.room);

module.exports = route;
