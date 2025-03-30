const { db } = require("../../firebase/firebase");

class BookingAdminController {
  // lấy danh sách tất cả đặt phòng
  async getBookingAdmin(req, res) {
    try {
      const bookingRef = db.ref("BOOKING");
      const snapshot = await bookingRef.once("value");

      if (!snapshot.exists()) {
        return res.status(400).json({ message: "Không có đơn đặt phòng nào" });
      }

      const allBookings = snapshot.val();
      const bookedRooms = [];

      // lấy toàn bộ danh sách đặt phòng
      for (const bookingCode in allBookings) {
        bookedRooms.push({
          bookingCode,
          ...allBookings[bookingCode],
        });
      }

      res.json({ success: true, bookedRooms });
    } catch (error) {
      console.log("Lỗi lấy danh sách đặt phòng:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }

  //cập nhật trạng thái đặt phòng
  async updateBookingAdmin(req, res) {
    try {
      const { bookingCode, TrangThai } = req.body;

      if (!bookingCode || !TrangThai) {
        return res.status(400).json({ message: "Thiếu thông tin cập nhật" });
      }

      const bookingRef = db.ref(`BOOKING/${bookingCode}`);
      const snapshot = await bookingRef.once("value");

      if (!snapshot.exists()) {
        return res.status(404).json({ message: "Đặt phòng không tồn tại" });
      }

      await bookingRef.update({
        TrangThai,
        updatedAt: new Date().toISOString(),
      });

      return res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái đặt phòng thành công",
      });
    } catch (error) {
      console.error("Lỗi cập nhật đặt phòng:", error);
      return res
        .status(500)
        .json({ message: "Lỗi server khi cập nhật đặt phòng" });
    }
  }

  // xóa đặt phòng
  async deleteBookingAdmin(req, res) {
    try {
      const { bookingCode } = req.body;

      if (!bookingCode) {
        return res.status(400).json({ message: "Thiếu bookingCode" });
      }

      const bookingRef = db.ref(`BOOKING/${bookingCode}`);
      const snapshot = await bookingRef.once("value");

      if (!snapshot.exists()) {
        return res.status(404).json({ message: "Đặt phòng không tồn tại" });
      }

      await bookingRef.remove();
      return res
        .status(200)
        .json({ success: true, message: "Xóa đặt phòng thành công" });
    } catch (error) {
      console.error("Lỗi xóa đặt phòng:", error);
      return res.status(500).json({ message: "Lỗi server khi xóa đặt phòng" });
    }
  }
}

module.exports = new BookingAdminController();
