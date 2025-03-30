// server/controllers/StaffController.js
const { db } = require("../../firebase/firebase");
const { v4: uuidv4 } = require("uuid");

class StaffAdminController {
  // Lấy danh sách nhân viên
  async getStaffAdmin(req, res) {
    try {
      const staffRef = db.ref("STAFF"); // Trỏ tới node "STAFF" trong Firebase
      const snapshot = await staffRef.once("value"); // Lấy dữ liệu từ Firebase

      if (!snapshot.exists()) {
        return res.status(404).json({ message: "Không có dữ liệu nhân viên" });
      }

      const staffList = snapshot.val(); // Chuyển dữ liệu từ snapshot thành object
      return res.status(200).json(staffList); // Trả về danh sách nhân viên
    } catch (error) {
      console.error("Lỗi lấy danh sách nhân viên:", error);
      return res
        .status(500)
        .json({ message: "Lỗi server khi lấy danh sách nhân viên" });
    }
  }

  // Thêm nhân viên mới
  async addStaffAdmin(req, res) {
    try {
      const { name, position, email, phone, staffCode } = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (!name || !position) {
        return res
          .status(400)
          .json({ message: "Tên và vị trí nhân viên là bắt buộc" });
      }

      // Nếu email được cung cấp, kiểm tra trùng lặp
      if (email) {
        const emailCheck = await db
          .ref("STAFF")
          .orderByChild("email")
          .equalTo(email)
          .once("value");

        if (emailCheck.exists()) {
          return res
            .status(400)
            .json({ message: "Email đã tồn tại trong hệ thống" });
        }
      }

      // Kiểm tra số điện thoại hợp lệ
      if (phone && !/^\d{10}$/.test(phone)) {
        return res
          .status(400)
          .json({ message: "Số điện thoại không hợp lệ (phải có 10 chữ số)" });
      }

      // Tạo ID nhân viên
      const staffId = uuidv4();

      // Nếu người dùng không nhập staffCode, tự động tạo
      const finalStaffCode = staffCode || staffId.slice(-6);

      // Kiểm tra staffCode có bị trùng không
      const codeCheck = await db
        .ref("STAFF")
        .orderByChild("staffCode")
        .equalTo(finalStaffCode)
        .once("value");

      if (codeCheck.exists()) {
        return res.status(400).json({ message: "Mã nhân viên đã tồn tại" });
      }

      // Lưu nhân viên vào Firebase
      const newStaff = {
        staffCode: finalStaffCode,
        name,
        position,
        email: email || "",
        phone: phone || "",
        createdAt: new Date().toISOString(),
      };

      await db.ref(`STAFF/${staffId}`).set(newStaff);

      return res.status(201).json({
        success: true,
        message: "Thêm nhân viên thành công",
        staffId,
        staffCode: finalStaffCode,
      });
    } catch (error) {
      console.error("Lỗi khi thêm nhân viên:", error);
      return res.status(500).json({ message: "Lỗi server khi thêm nhân viên" });
    }
  }

  // Sửa nhân viên
  async updateStaffAdmin(req, res) {
    try {
      const { staffId, staffCode, name, position, email, phone } = req.body;

      let staffRef;

      if (staffId) {
        // Nếu có staffId (UUID), tìm nhân viên theo UUID
        staffRef = db.ref(`STAFF/${staffId}`);
      } else if (staffCode) {
        // Nếu có staffCode, tìm UUID tương ứng
        const snapshot = await db
          .ref("STAFF")
          .orderByChild("staffCode")
          .equalTo(staffCode)
          .once("value");

        if (!snapshot.exists()) {
          return res
            .status(404)
            .json({ message: "Mã nhân viên không tồn tại" });
        }

        // Lấy UUID của nhân viên
        const staffKey = Object.keys(snapshot.val())[0];
        staffRef = db.ref(`STAFF/${staffKey}`);
      } else {
        return res
          .status(400)
          .json({ message: "Thiếu staffId hoặc staffCode" });
      }

      // Truy vấn nhân viên
      const staffSnapshot = await staffRef.once("value");
      if (!staffSnapshot.exists()) {
        return res.status(404).json({ message: "Nhân viên không tồn tại" });
      }

      const staffData = staffSnapshot.val();

      // Kiểm tra email trùng lặp
      if (email && email !== staffData.email) {
        const emailCheck = await db
          .ref("STAFF")
          .orderByChild("email")
          .equalTo(email)
          .once("value");

        if (emailCheck.exists()) {
          return res.status(400).json({ message: "Email đã tồn tại" });
        }
      }

      // Kiểm tra số điện thoại hợp lệ
      if (phone && !/^\d{9,10}$/.test(phone)) {
        return res.status(400).json({ message: "Số điện thoại không hợp lệ" });
      }

      // Cập nhật dữ liệu
      const updatedStaff = {
        name: name || staffData.name,
        position: position || staffData.position,
        email: email || staffData.email,
        phone: phone || staffData.phone,
        createdAt: staffData.createdAt,
        updatedAt: new Date().toISOString(),
      };

      await staffRef.update(updatedStaff);

      return res.status(200).json({
        success: true,
        message: "Cập nhật nhân viên thành công",
        data: updatedStaff,
      });
    } catch (error) {
      console.error("Error updating staff:", error);
      return res
        .status(500)
        .json({ message: "Lỗi server khi cập nhật nhân viên" });
    }
  }
  // Xóa nhân viên
  async deleteStaffAdmin(req, res) {
    try {
      const { staffCode } = req.body;

      if (!staffCode) {
        return res.status(400).json({ message: "Cần cung cấp staffCode" });
      }

      // Tìm nhân viên theo staffCode
      const snapshot = await db
        .ref("STAFF")
        .orderByChild("staffCode")
        .equalTo(staffCode)
        .once("value");

      if (!snapshot.exists()) {
        return res.status(404).json({ message: "Nhân viên không tồn tại" });
      }

      // Lấy staffId từ kết quả tìm kiếm
      const staffData = snapshot.val();
      const staffId = Object.keys(staffData)[0];

      // Xóa nhân viên khỏi Firebase
      await db.ref(`STAFF/${staffId}`).remove();

      return res.status(200).json({
        success: true,
        message: "Xóa nhân viên thành công",
      });
    } catch (error) {
      console.error("Lỗi khi xóa nhân viên:", error);
      return res.status(500).json({ message: "Lỗi server khi xóa nhân viên" });
    }
  }
}
module.exports = new StaffAdminController();
