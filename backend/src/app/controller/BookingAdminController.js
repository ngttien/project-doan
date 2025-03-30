// app/controller/admin/BookingController.js
const { db } = require("../../firebase/firebase");

class BookingAdminController {
  // Lấy danh sách tất cả phòng đã dặt
  async getBookingAdmin(req, res) {
    try {
      const bookingRef = db.ref("BOOKING");
      const snapshot = await bookingRef.once("value");

      if (!snapshot.exists()) {
        return res.status(400).json({ message: "Không có phòng nào được đặt" });
      }

      const allBookings = snapshot.val();
      const bookedRooms = [];

      // Lọc ra những phòng có trạng thái "đã đặt phòng"
      for (const bookingCode in allBookings) {
        if (allBookings[bookingCode].TrangThai === "da dat phong") {
          bookedRooms.push({
            bookingCode,
            ...allBookings[bookingCode],
          });
        }
      }

      res.json({ success: true, bookedRooms });
    } catch (error) {
      console.log("Lỗi lấy danh sách phòng đã đặt:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }

  // Cập nhật trạng thái đặt phòng
  async updateBookingAdmin(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Kiểm tra đặt phòng có tồn tại không
      const bookingRef = db.ref(`bookings/${id}`);
      const snapshot = await bookingRef.once("value");

      if (!snapshot.exists()) {
        return res.status(404).json({ message: "Đặt phòng không tồn tại" });
      }

      // Kiểm tra trạng thái hợp lệ
      const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ message: "Trạng thái không hợp lệ" });
      }

      // Cập nhật trạng thái
      await bookingRef.update({
        status,
        updatedAt: new Date().toISOString(),
      });

      return res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái đặt phòng thành công",
      });
    } catch (error) {
      console.error("Error updating booking:", error);
      return res
        .status(500)
        .json({ message: "Lỗi server khi cập nhật đặt phòng" });
    }
  }

  // Xóa đặt phòng
  async deleteBookingAdmin(req, res) {
    try {
      const { id } = req.params;

      // Kiểm tra đặt phòng có tồn tại không
      const bookingRef = db.ref(`bookings/${id}`);
      const snapshot = await bookingRef.once("value");

      if (!snapshot.exists()) {
        return res.status(404).json({ message: "Đặt phòng không tồn tại" });
      }

      // Xóa đặt phòng
      await bookingRef.remove();
      return res
        .status(200)
        .json({ success: true, message: "Xóa đặt phòng thành công" });
    } catch (error) {
      console.error("Error deleting booking:", error);
      return res.status(500).json({ message: "Lỗi server khi xóa đặt phòng" });
    }
  }
}

module.exports = new BookingAdminController();
