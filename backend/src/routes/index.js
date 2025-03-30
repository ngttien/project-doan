const Auth = require("./auth");
const Room = require("./room");
const Booking = require("./booking");
const staffAdmin = require("./staffAdmin");
const roomAdmin = require("./roomAdmin");
const bookingAdmin = require("./bookingAdmin");

function route(app) {
  app.use("/auth", Auth);
  app.use("/room", Room);
  app.use("/booking", Booking);
  app.use("/staff", staffAdmin);
  app.use("/roomadmin", roomAdmin);
  app.use("/bookingadmin", bookingAdmin);
}
module.exports = route;
