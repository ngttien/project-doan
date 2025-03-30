const { db } = require("../../firebase/firebase");

class BookController {
  // Lưu ID phòng vào session
  async getBooking(req, res) {
    try {
      const { ID_phong } = req.body;

      if (!ID_phong) {
        return res.status(400).json({ message: "Thiếu ID phòng" });
      }

      const booking = db.ref(`ROOM/${ID_phong}`);
      const data = await booking.once("value");

      if (!data.exists()) {
        return res.status(400).json({ message: "Không tìm thấy phòng" });
      }

      // Kiểm tra session trước khi gán giá trị
      req.session.users = req.session.users || {};
      req.session.users.room = ID_phong;

      console.log(req.session.users);
      return res.json({ success: true });
    } catch (error) {
      console.error("Lỗi getBooking:", error);
      return res.status(500).json({ error: "Lỗi server" });
    }
  }

  // Lấy thông tin phòng từ session
  async Phong(req, res) {
    try {
      console.log("Session hiện tại:", req.session.users);

      if (!req.session.users || !req.session.users.room) {
        return res
          .status(400)
          .json({ message: "Không tìm thấy session phòng" });
      }

      const ID_phong = req.session.users.room;
      console.log("ID phòng lấy được từ session:", ID_phong);

      const booking = db.ref("ROOM");
      const snapshot = await booking.child(ID_phong).once("value");

      if (!snapshot.exists()) {
        return res.status(404).json({ message: "Phòng không tồn tại" });
      }

      const data = snapshot.val();

      return res.json({
        data: {
          ID_phong,
          ...data,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: "Lỗi server" });
    }
  }

  // Đặt phòng
  async Booking(req, res) {
    try {
      const UserId = req.session.users?.uid;
      if (!UserId) {
        return res.status(400).json({ message: "Vui lòng đăng nhập" });
      }

      const { email, phone, checkIn, checkOut, roomId, name } = req.body;
      if (!email || !phone || !checkIn || !checkOut || !roomId || !name) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập đầy đủ thông tin" });
      }

      // Kiểm tra phòng có tồn tại không
      const roomRef = db.ref(`ROOM/${roomId}`);
      const roomSnapshot = await roomRef.once("value");

      if (!roomSnapshot.exists()) {
        return res.status(400).json({ message: "Phòng không tồn tại" });
      }

      // Kiểm tra phòng đã được đặt chưa
      const bookingRef = db.ref("BOOKING");
      const bookingSnapshot = await bookingRef.once("value");
      const allBookings = bookingSnapshot.val() || {};

      for (const key in allBookings) {
        const booking = allBookings[key];
        if (
          booking.roomId === roomId &&
          !(
            new Date(checkOut) <= new Date(booking.NgayDat) ||
            new Date(checkIn) >= new Date(booking.NgayTraPhong)
          )
        ) {
          return res
            .status(400)
            .json({ message: "Phòng này đã được đặt trong thời gian này" });
        }
      }

      // Lưu booking vào Firebase
      const bookingCode = `BK${Date.now()}`;
      await db.ref(`BOOKING/${bookingCode}`).set({
        email,
        phone,
        checkIn,
        checkOut,
        roomId,
        name,
        TrangThai: "dang cho xac nhan",
      });
      delete req.session.users.room;
      res.json({ success: true, bookingCode });
    } catch (error) {
      console.log("Lỗi đặt phòng:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }

  // Xác nhận đặt phòng
  async confirmBooking(req, res) {
    try {
      const { bookingCode } = req.body;

      if (!bookingCode) {
        return res.status(400).json({ message: "Thiếu bookingCode" });
      }

      const bookingRef = db.ref(`BOOKING/${bookingCode}`);
      const bookingSnapshot = await bookingRef.once("value");

      if (!bookingSnapshot.exists()) {
        return res.status(400).json({ message: "Mã đặt phòng không tồn tại" });
      }

      const bookingData = bookingSnapshot.val();

      if (bookingData.TrangThai !== "dang cho xac nhan") {
        return res
          .status(400)
          .json({ message: "Booking không hợp lệ hoặc đã xác nhận" });
      }

      // Cập nhật trạng thái thành "đã đặt phòng"
      await bookingRef.update({ TrangThai: "da dat phong" });

      res.json({ success: true, message: "Xác nhận đặt phòng thành công" });
    } catch (error) {
      console.log("Lỗi xác nhận đặt phòng:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }
  // hủy đătj hpongf
  async cancelBooking(req, res) {
    try {
      const { bookingCode } = req.body;

      if (!bookingCode) {
        return res.status(400).json({ message: "Thiếu bookingCode" });
      }

      const bookingRef = db.ref(`BOOKING/${bookingCode}`);
      const bookingSnapshot = await bookingRef.once("value");

      if (!bookingSnapshot.exists()) {
        return res.status(400).json({ message: "Mã đặt phòng không tồn tại" });
      }

      const bookingData = bookingSnapshot.val();

      if (bookingData.TrangThai === "da huy") {
        return res.status(400).json({ message: "Booking đã bị hủy trước đó" });
      }

      if (
        bookingData.TrangThai !== "dang cho xac nhan" &&
        bookingData.TrangThai !== "da dat phong"
      ) {
        return res.status(400).json({ message: "Không thể hủy booking này" });
      }

      // Cập nhật trạng thái thành "đã hủy"
      await bookingRef.update({ TrangThai: "da huy" });

      res.json({ success: true, message: "Hủy đặt phòng thành công" });
    } catch (error) {
      console.log("Lỗi hủy đặt phòng:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }
}

module.exports = new BookController();
