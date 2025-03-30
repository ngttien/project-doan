// Chưa có làm

const express = require("express");
const route = express.Router();
const VoucherAdminController = require("../app/controller/VoucherAdminController");

route.use("/adgetvouchers", VoucherAdminController.getVouchersAdmin);
route.use("/addvoucheraa", VoucherAdminController.addVoucherAdmin);
route.use("/adupdatevoucher", VoucherAdminController.updateVoucherAdmin);
route.use("/addeletevoucher", VoucherAdminController.deleteVoucherAdmin);

module.exports = route;
