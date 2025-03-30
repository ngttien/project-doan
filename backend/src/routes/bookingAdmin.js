const express = require("express");
const route = express.Router();
const BookingAdminController = require("../app/controller/BookingAdminController");

// Routes cho đặt phòng
route.use("/getbooking", BookingAdminController.getBookingAdmin);
route.use("/updatebooking", BookingAdminController.updateBookingAdmin);
route.use("/deletebooking", BookingAdminController.deleteBookingAdmin);

module.exports = route;
