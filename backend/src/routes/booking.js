const express = require("express");
const route = express.Router();

const BookController = require("../app/controller/BookController");
route.use("/booking", BookController.Booking);
route.use("/getbooking", BookController.getBooking);
route.use("/Phong", BookController.Phong);
route.use("/confirm", BookController.confirmBooking); // cái này là xác nhận đặt phòng nha hson, cái này dùng để cập nhật trạng thái á
route.use("/cancel", BookController.cancelBooking); // cái này là hủy đặt phòng nha hson, cái này dùng để cập nhật trạng thái á
module.exports = route;
