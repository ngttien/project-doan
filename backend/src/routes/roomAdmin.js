const express = require("express");
const route = express.Router();

const RoomAdminController = require("../app/controller/RoomAdminController");

// Routes cho phòng
route.get("/getrooms", RoomAdminController.getRoomsAdmin);
route.post("/addroom", RoomAdminController.addRoomAdmin);
route.put("/updateroom", RoomAdminController.updateRoomAdmin);
route.delete("/deleteroom", RoomAdminController.deleteRoomAdmin);

module.exports = route;
