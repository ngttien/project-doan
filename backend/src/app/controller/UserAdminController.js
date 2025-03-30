// server/controllers/UserController.js
const { db } = require("../../firebase/firebase");

class UserAdminController {
  // Lấy danh sách khách hàng
  async getUsersAdmin(req, res) {
    try {
      const usersRef = db.ref("users");
      const snapshot = await usersRef.once("value");

      if (!snapshot.exists()) {
        return res.status(404).json({ message: "Không có dữ liệu khách hàng" });
      }

      const users = snapshot.val();
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res
        .status(500)
        .json({ message: "Lỗi server khi lấy danh sách khách hàng" });
    }
  }

  // Sửa thông tin khách hàng
  async updateUserAdmin(req, res) {
    try {
      const { id } = req.params;
      const { name, phone, verified } = req.body;

      // Kiểm tra khách hàng có tồn tại không
      const userRef = db.ref(`users/${id}`);
      const snapshot = await userRef.once("value");

      if (!snapshot.exists()) {
        return res.status(404).json({ message: "Khách hàng không tồn tại" });
      }

      // Kiểm tra số điện thoại
      if (phone && !/^\d{10}$/.test(phone)) {
        return res.status(400).json({ message: "Số điện thoại không hợp lệ" });
      }

      // Chuẩn hóa dữ liệu
      const updatedUser = {
        name: name || snapshot.val().name,
        phone: phone || snapshot.val().phone,
        verified:
          typeof verified === "boolean" ? verified : snapshot.val().verified,
        updatedAt: new Date().toISOString(),
      };

      // Cập nhật trong Realtime Database
      await userRef.update(updatedUser);
      return res
        .status(200)
        .json({ success: true, message: "Cập nhật khách hàng thành công" });
    } catch (error) {
      console.error("Error updating user:", error);
      return res
        .status(500)
        .json({ message: "Lỗi server khi cập nhật khách hàng" });
    }
  }

  // Xóa khách hàng
  async deleteUserAdmin(req, res) {
    try {
      const { id } = req.params;

      // Kiểm tra khách hàng có tồn tại không
      const userRef = db.ref(`users/${id}`);
      const snapshot = await userRef.once("value");

      if (!snapshot.exists()) {
        return res.status(404).json({ message: "Khách hàng không tồn tại" });
      }

      // Xóa khách hàng
      await userRef.remove();
      return res
        .status(200)
        .json({ success: true, message: "Xóa khách hàng thành công" });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ message: "Lỗi server khi xóa khách hàng" });
    }
  }
}

module.exports = new UserAdminController();
