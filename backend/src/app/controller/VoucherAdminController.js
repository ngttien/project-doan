// Chưa có làm tiếp

const { db } = require("../../firebase/firebase");
const { v4: uuidv4 } = require("uuid");

class VoucherAdminController {
  // Lấy danh sách tất cả voucher
  async getVouchersAdmin(req, res) {
    try {
      const vouchersRef = db.ref("vouchers");
      const snapshot = await vouchersRef.once("value");

      if (!snapshot.exists()) {
        return res.status(404).json({ message: "Không có dữ liệu voucher" });
      }

      const vouchers = snapshot.val();
      return res.status(200).json(vouchers);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      return res
        .status(500)
        .json({ message: "Lỗi server khi lấy danh sách voucher" });
    }
  }

  // Thêm voucher mới
  async addVoucherAdmin(req, res) {
    try {
      const { code, discount, expiresAt } = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (!code || !discount || !expiresAt) {
        return res.status(400).json({
          message: "Mã, giá trị giảm giá và ngày hết hạn là bắt buộc",
        });
      }

      // Kiểm tra mã voucher có tồn tại không
      const vouchersRef = db.ref("vouchers");
      const snapshot = await vouchersRef
        .orderByChild("code")
        .equalTo(code)
        .once("value");
      if (snapshot.exists()) {
        return res.status(400).json({ message: "Mã voucher đã tồn tại" });
      }

      // Chuẩn hóa dữ liệu
      const voucherId = uuidv4();
      const newVoucher = {
        code,
        discount,
        expiresAt,
        createdAt: new Date().toISOString(),
      };

      // Lưu vào Realtime Database
      await db.ref(`vouchers/${voucherId}`).set(newVoucher);
      return res
        .status(201)
        .json({ success: true, message: "Thêm voucher thành công", voucherId });
    } catch (error) {
      console.error("Error adding voucher:", error);
      return res.status(500).json({ message: "Lỗi server khi thêm voucher" });
    }
  }

  // Sửa voucher
  async updateVoucherAdmin(req, res) {
    try {
      const { id } = req.params;
      const { code, discount, expiresAt } = req.body;

      // Kiểm tra voucher có tồn tại không
      const voucherRef = db.ref(`vouchers/${id}`);
      const snapshot = await voucherRef.once("value");

      if (!snapshot.exists()) {
        return res.status(404).json({ message: "Voucher không tồn tại" });
      }

      // Kiểm tra mã voucher (nếu thay đổi)
      if (code && code !== snapshot.val().code) {
        const vouchersRef = db.ref("vouchers");
        const snapshotCode = await vouchersRef
          .orderByChild("code")
          .equalTo(code)
          .once("value");
        if (snapshotCode.exists()) {
          return res.status(400).json({ message: "Mã voucher đã tồn tại" });
        }
      }

      // Chuẩn hóa dữ liệu
      const updatedVoucher = {
        code: code || snapshot.val().code,
        discount: discount || snapshot.val().discount,
        expiresAt: expiresAt || snapshot.val().expiresAt,
        updatedAt: new Date().toISOString(),
      };

      // Cập nhật trong Realtime Database
      await voucherRef.update(updatedVoucher);
      return res
        .status(200)
        .json({ success: true, message: "Cập nhật voucher thành công" });
    } catch (error) {
      console.error("Error updating voucher:", error);
      return res
        .status(500)
        .json({ message: "Lỗi server khi cập nhật voucher" });
    }
  }

  // Xóa voucher
  async deleteVoucherAdmin(req, res) {
    try {
      const { id } = req.params;

      // Kiểm tra voucher có tồn tại không
      const voucherRef = db.ref(`vouchers/${id}`);
      const snapshot = await voucherRef.once("value");

      if (!snapshot.exists()) {
        return res.status(404).json({ message: "Voucher không tồn tại" });
      }

      // Xóa voucher
      await voucherRef.remove();
      return res
        .status(200)
        .json({ success: true, message: "Xóa voucher thành công" });
    } catch (error) {
      console.error("Error deleting voucher:", error);
      return res.status(500).json({ message: "Lỗi server khi xóa voucher" });
    }
  }
}

module.exports = new VoucherAdminController();
