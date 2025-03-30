const express = require("express");
const BookingAdminController = require("../app/controller/BookingAdminController");

const router = express.Router();

router.get("/getbooking", BookingAdminController.getBookingAdmin);
router.put("/updatebooking", BookingAdminController.updateBookingAdmin);
router.delete("/deletebooking", BookingAdminController.deleteBookingAdmin);

module.exports = router;
