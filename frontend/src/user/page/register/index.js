import { useState, useContext } from "react";
import { AuthContext } from "~/AuthContent";
import axios from "axios";
import {FaArrowLeft} from 'react-icons/fa'
import routesconfig from "~/config/routes";
import { Link, useNavigate } from "react-router-dom";
import styles from "./register.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function Register() {
  const [step, setStep] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    register(name, email, password, phone, date);
    setStep(true);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/verify", {
        email,
        otp,
      });
      setMessage(res.data.message);
      navigate(routesconfig.login);
    } catch (error) {
      setMessage(error.response?.data?.error || "Lỗi xác thực OTP!");
    }
  };

    return (
        <div className={cx("registerContainer")}>
            {!step ? (
                <form onSubmit={handleRegister} className={cx("registerForm")}>
                    {/* Nút quay về Home */}
                    <Link to="/" className={cx("back_home")}>
                        <FaArrowLeft className={cx("back_icon")} /> Home
                    </Link>

                    <h2 className={cx("form_Title")}>Đăng ký</h2>

                    <div className={cx("inputGroup")}>
                        <label htmlFor="email" className={cx("visually-hidden")}>
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={cx("input")}
                            aria-label="Email"
                        />
                    </div>

                    <div className={cx("inputGroup")}>
                        <label htmlFor="password" className={cx("visually-hidden")}>
                            Mật khẩu
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={cx("input")}
                            aria-label="Mật khẩu"
                        />
                    </div>

                    <div className={cx("inputGroup")}>
                        <label htmlFor="name" className={cx("visually-hidden")}>
                            Họ tên
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Họ tên"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className={cx("input")}
                            aria-label="Họ tên"
                        />
                    </div>

                    <div className={cx("inputGroup")}>
                        <label htmlFor="phone" className={cx("visually-hidden")}>
                            Số điện thoại
                        </label>
                        <input
                            id="phone"
                            type="text"
                            placeholder="Số điện thoại"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className={cx("input")}
                            aria-label="Số điện thoại"
                        />
                    </div>

                    <div className={cx("inputGroup")}>
                        <label htmlFor="date" className={cx("visually-hidden")}>
                            Ngày sinh
                        </label>
                        <input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className={cx("input")}
                            aria-label="Ngày sinh"
                        />
                    </div>

                    <button type="submit" className={cx("submitButton")}>
                        Đăng ký
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className={cx("linkButton")}
                    >
                        Chuyển lại trang đăng nhập
                    </button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp} className={cx("otpForm")}>
                    {/* Nút quay về Home */}
                    <Link to="/" className={cx("back_home")}>
                        <FaArrowLeft className={cx("back_icon")} /> Home
                    </Link>

                    <h2 className={cx("formTitle")}>Xác thực OTP</h2>

                    <div className={cx("inputGroup")}>
                        <label htmlFor="otp" className={cx("visually-hidden")}>
                            Mã OTP
                        </label>
                        <input
                            id="otp"
                            type="text"
                            placeholder="Nhập mã OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            className={cx("input")}
                            aria-label="Mã OTP"
                        />
                    </div>

                    <button type="submit" className={cx("submitButton")}>
                        Xác thực
                    </button>
                    <button type="button" className={cx("linkButton")}>
                        Gửi lại OTP
                    </button>
                </form>
            )}

            {message && <p className={cx("message")}>{message}</p>}
        </div>
    );
}

export default Register;