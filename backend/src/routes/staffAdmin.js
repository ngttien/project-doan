// File này chứa các route cho nhân viên
const express = require("express");
const route = express.Router();

const StaffAdminController = require("../app/controller/StaffAdminController");

route.get("/getstaff", StaffAdminController.getStaffAdmin);
route.post("/addstaff", StaffAdminController.addStaffAdmin);
route.put("/updatestaff", StaffAdminController.updateStaffAdmin);
route.delete("/deletestaff", StaffAdminController.deleteStaffAdmin);

module.exports = route;
