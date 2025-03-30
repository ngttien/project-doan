const { db } = require("../../firebase/firebase");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { message } = require("firebase-admin");

//gui opt ve gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ngttien.3725@gmail.com",
    pass: "yhsk gerq rlcu gqnq",
  },
});
class AuthController {
  // login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập đầy đủ thông tin" });
      }

      // trỏ đến email trong node users
      const users = db.ref("users");
      const snapshot = await users
        .orderByChild("email")
        .equalTo(email)
        .once("value");

      // kiểm tra email có tồn tại không
      if (!snapshot.val()) {
        return res.status(401).json({ message: "Email không tồn tại" });
      }

      const data = Object.values(snapshot.val())[0]; // lấy email mà nó trung với cái mình nhập, nếu có thì lấy ra lưu vô data.
      const userid = Object.keys(snapshot.val())[0]; // lấy cái node id của email đó.
      // kiểm tra mật khẩu
      if (!(await bcrypt.compare(password, data.secretPass))) {
        res.status(400).json({ message: "Sai mật khẩu" });
        return;
      }
      //
      if (!data.verified) {
        res.status(400).json({ message: "Tai KHOAN CHUA XAC THUC" });
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpref = db.ref("otp").child(email.replace(/\./g, "_"));
        await otpref.set({ otp, expires: Date.now() + 300000 });
        await transporter.sendMail({
          from: "ngttien.3725@gmail.com",
          to: email,
          subject: "Xác nhận tài khoản",
          text: `Ma opt cua ban: ${otp}`,
        });
        return res.json({ success: true });
      }
      // tạo session lưu thông tin người dùng
      req.session.users = { email: data.email, uid: userid };
      res.json({ success: true, user: req.session.users });
      console.log(req.session.users);
    } catch (error) {
      return res.status(401).json({ message: "lỗi đầy mình" });
    }
  }

  //check login
  checklogin(req, res) {
    if (req.session.users) {
      res.json({ login: true, users: req.session.users });
    } else {
      res.json({ login: false });
    }
  }
  //logout
  async logout(req, res) {
    try {
      if (!req.session.users) {
        return res
          .status(400)
          .json({ message: "bạn chưa đăng nhập", success: false });
      }
      delete res.session.users.email;
      delete res.session.users.uid;

      res.clearCookie("connect.sid");

      return res
        .status(200)
        .json({ message: "đăng xuất thành công", success: true });
    } catch (error) {
      return res.status(500).json({ message: "loi server" });
    }
  }
  //register
  async register(req, res) {
    try {
      const { email, password, name, phone, date } = req.body;
      if (!email || !password || !name || !phone || !date) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập đầy đủ thông tin" });
      }
      // trỏ đến email trong node users
      const users = db.ref("users");
      const snapshot = await users
        .orderByChild("email")
        .equalTo(email)
        .once("value");
      // check email xem nó có tồn tại không.
      if (snapshot.val()) {
        res.status(400).json({ message: "Email đã tồn tại" });
        return;
      }
      // check password
      if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password)) {
        res
          .status(400)
          .json({ message: "mật khẩu phải có cả chữ, số và ký tự đặt biệt " });
        return;
      }
      // check phone
      if (!/^\d{10}$/.test(phone)) {
        res.status(400).json({ message: "số điện thoại không hợp lệ" });
        return;
      }
      // hash password, mã hóa pạt quợt
      const secretPass = await bcrypt.hash(password, 10);
      const id = uuidv4();
      await users
        .child(id)
        .set({ email, secretPass, name, phone, verified: false });
      // gửi email xác nhận
      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpref = db.ref("otp").child(email.replace(/\./g, "_"));
      await otpref.set({ otp, expires: Date.now() + 300000 });
      await transporter.sendMail({
        from: "ngttien.3725@gmail.com",
        to: email,
        subject: "Xác nhận tài khoản",
        text: `Ma opt cua ban: ${otp}`,
      });
      return res.json({ success: true });
    } catch (error) {
      return res.status(401).json({ message: "lỗi đầy mình" });
    }
  }
  //check otp
  async verify(req, res) {
    try {
      const { email, otp } = req.body;

      const Otp = db.ref("otp").child(email.replace(".", "_"));
      const snapshot = await Otp.once("value");
      const data = snapshot.val();

      if (!data) {
        res.status(400).json({ error: "OTP không hợp lệ hoặc đã hết hạn!" });
        return;
      } else if (data.otp != otp) {
        res.status(400).json({ error: "Mã OTP không đúng!" });
        return;
      }

      const userdata = db.ref("users");
      const usersnapshot = await userdata.once("value");
      const list = usersnapshot.val();
      // lay userid tuong ung voi cai emai.
      let userId = null;
      for (const id in list) {
        if (list[id].email === email) {
          userId = id;
          break;
        }
      }
      const user = db.ref("users").child(userId);
      await user.update({ verified: true });

      await Otp.remove();

      res.json({ message: "Xác thực thành công! Tài khoản đã kích hoạt." });
    } catch (error) {
      res.status(500).json({ message: "lỗi xác thực!", error: error.message });
      return;
    }
  }
  // quen mk
  async forgot(req, res) {
    const { email } = req.body; // lay email tu ban phim ng dung nhap
    const Fpass = db.ref("users").orderByChild("email").equalTo(email);
    const Fmail = await Fpass.once("value");
    if (!Fmail.exists()) {
      res.status(400).json({ message: "sai thi cook" });
      return;
    }
    //neu co du lieu
    //guwir laij opt xac nhan mk moi
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpref = db.ref("otp").child(email.replace(/\./g, "_")); // tao 1 cai node opt
    await otpref.set({ otp, expires: Date.now() + 300000 }); //luu ma otp va thgian het han vao otpref
    await transporter.sendMail({
      from: "ngttien.3725@gmail.com",
      to: email,
      subject: "Xác nhận tài khoản",
      text: `Ma opt cua ban: ${otp}`,
    });
    return res.json({ success: true });
  }
  //dat lai mk
  async ResetPass(req, res) {
    const { email, otp, password } = req.body;
    const Otp = db.ref("otp").child(email.replace(".", "_"));
    const snapshot = await Otp.once("value");
    const data = snapshot.val();
    console.log("vdung r ");
    if (!data) {
      res.status(400).json({ error: "OTP không hợp lệ hoặc đã hết hạn!" });
      return;
    } else if (data.otp != otp) {
      res.status(400).json({ error: "Mã OTP không đúng!" });
      return;
    }
    console.log("vdung r 2 ");
    // otp da dung
    const userdata = db.ref("users");
    const usersnapshot = await userdata.once("value");
    const list = usersnapshot.val();
    console.log("vdung r3 ");
    // lay userid tuong ung voi cai emai.
    let userId = null;
    for (const id in list) {
      if (list[id].email === email) {
        userId = id;
        break;
      }
      console.log("vdung r4 ");
    }
    const user = db.ref("users").child(userId);
    const secretPass = await bcrypt.hash(password, 10);
    await user.update({ secretPass });

    await Otp.remove();
    res.json({ success: true, message: "u dr em" });
  }
}

module.exports = new AuthController();
