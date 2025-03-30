// server/controllers/RoomController.js
const { db } = require("../../firebase/firebase");
const { v4: uuidv4 } = require("uuid");

class RoomAdminController {
  // lấy danh sách tất cả phòng
  async getRoomsAdmin(req, res) {
    try {
      const roomsRef = db.ref("ROOM"); // Trỏ tới node "ROOM" trong Firebase
      // lấy dữ liệu từ Firebase
      const snapshot = await roomsRef.once("value");

      if (!snapshot.exists()) {
        return res.status(404).json({ message: "Không có dữ liệu phòng" });
      }

      const rooms = snapshot.val();
      return res.status(200).json(rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      return res
        .status(500)
        .json({ message: "Lỗi server khi lấy danh sách phòng" });
    }
  }

  // thêm phòng mới
  async addRoomAdmin(req, res) {
    try {
      const {
        name,
        price,
        size,
        beds,
        view,
        image,
        amenities,
        offers,
        description,
        type,
        status,
      } = req.body;

      // kiểm tra dữ liệu đầu vào
      if (!name || !price) {
        return res
          .status(400)
          .json({ message: "Tên và giá phòng là bắt buộc" });
      }

      // Tạo roomCode ngẫu nhiên (R + 4 ký tự chữ + số)
      const roomCode =
        "R" + Math.random().toString(36).substring(2, 6).toUpperCase();

      // Chuẩn bị dữ liệu phòng
      const newRoom = {
        roomCode,
        name,
        price,
        size: size || "",
        beds: beds || "",
        view: view || "",
        image: image || "",
        amenities: Array.isArray(amenities) ? amenities : [],
        offers: Array.isArray(offers) ? offers : [],
        description: description || "",
        type: type || "",
        status: status || "trống",
        createdAt: new Date().toISOString(),
      };

      // Lưu vào Firebase với roomCode
      await db.ref(`ROOM/${roomCode}`).set(newRoom);
      return res
        .status(201)
        .json({ success: true, message: "Thêm phòng thành công", roomCode });
    } catch (error) {
      console.error("Error adding room:", error);
      return res.status(500).json({ message: "Lỗi server khi thêm phòng" });
    }
  }

  // Cập nhật phòng
  async updateRoomAdmin(req, res) {
    try {
      const { roomCode } = req.body;
      const updatedData = req.body;

      // Kiểm tra nếu không có roomCode
      if (!roomCode) {
        return res.status(400).json({ message: "Thiếu roomCode để cập nhật" });
      }

      // Kiểm tra phòng có tồn tại không
      const roomRef = db.ref(`ROOM/${roomCode}`);
      const snapshot = await roomRef.once("value");

      if (!snapshot.exists()) {
        return res.status(404).json({ message: "Phòng không tồn tại" });
      }

      // Cập nhật thông tin phòng
      await roomRef.update(updatedData);

      return res
        .status(200)
        .json({ success: true, message: "Cập nhật phòng thành công" });
    } catch (error) {
      console.error("Error updating room:", error);
      return res.status(500).json({ message: "Lỗi server khi cập nhật phòng" });
    }
  }
  async deleteRoomAdmin(req, res) {
    try {
      const { roomCode } = req.body;

      // Kiểm tra nếu không có roomCode
      if (!roomCode) {
        return res.status(400).json({ message: "Thiếu roomCode để xóa" });
      }

      // Kiểm tra phòng có tồn tại không
      const roomRef = db.ref(`ROOM/${roomCode}`);
      const snapshot = await roomRef.once("value");

      if (!snapshot.exists()) {
        return res.status(404).json({ message: "Phòng không tồn tại" });
      }

      // Xóa phòng khỏi Firebase
      await roomRef.remove();

      return res
        .status(200)
        .json({ success: true, message: "Xóa phòng thành công" });
    } catch (error) {
      console.error("Error deleting room:", error);
      return res.status(500).json({ message: "Lỗi server khi xóa phòng" });
    }
  }
}
module.exports = new RoomAdminController();
