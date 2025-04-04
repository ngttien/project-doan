const { db } = require("../../firebase/firebase");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

class AuthAdminController {
    async register(req, res) {
        try {
            const { email, password, name, phone } = req.body;
            if (!email || !password || !name || !phone) {
                return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
            }

            // kiểm tra email có tồn tại không
            const adminRef = db.ref("admins");
            const snapshot = await adminRef.orderByChild("email").equalTo(email).once("value");
            if (snapshot.exists()) {
                return res.status(400).json({ message: "Email đã tồn tại" });
            }

            // kiểm tra mật khẩu (ít nhất 8 ký tự, có chữ, số, ký tự đặc biệt)
            if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password)) {
                return res.status(400).json({ message: "Mật khẩu phải có chữ, số và ký tự đặc biệt" });
            }

            // hash mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);
            const id = uuidv4();

            // lưu admin vào Firebase
            await adminRef.child(id).set({ email, password: hashedPassword, name, phone });

            return res.json({ success: true, message: "Đăng ký thành công!" });
        } catch (error) {
            return res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }

    // đăng nhập admin
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
            }

            // kiểm tra email có tồn tại không
            const adminRef = db.ref("admins");
            const snapshot = await adminRef.orderByChild("email").equalTo(email).once("value");
            if (!snapshot.exists()) {
                return res.status(401).json({ message: "Email không tồn tại" });
            }

            const data = Object.values(snapshot.val())[0];
            const adminId = Object.keys(snapshot.val())[0];

            // kiểm tra mật khẩu bằng bcrypt.compare
            const isMatch = await bcrypt.compare(password, data.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Sai mật khẩu" });
            }

            // tạo session cho admin
            req.session.admin = { email: data.email, uid: adminId };
            return res.json({ success: true, admin: req.session.admin });
        } catch (error) {
            return res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }

    // kiểm tra trạng thái đăng nhập
    checkLogin(req, res) {
        if (req.session.admin) {
            return res.json({ login: true, admin: req.session.admin });
        } else {
            return res.json({ login: false });
        }
    }

    // đăng xuất admin
    async logout(req, res) {
        try {
            if (!req.session.admin) {
                return res.status(400).json({ message: "Bạn chưa đăng nhập", success: false });
            }

            delete req.session.admin;
            res.clearCookie("connect.sid");

            return res.status(200).json({ message: "Đăng xuất thành công", success: true });
        } catch (error) {
            return res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
}

module.exports = new AuthAdminController();
