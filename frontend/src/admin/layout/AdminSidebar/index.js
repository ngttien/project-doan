import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./sidebarAdmin.module.scss";
import classNames from "classnames/bind";
import axios from "axios";

const cx = classNames.bind(styles);

function AdminSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    //check login chưa
    useEffect(() => {
        checkLoginStatus();
    }, [location.pathname]);

    const checkLoginStatus = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://localhost:5000/authadmin/checklogin', {
                withCredentials: true
            });
            console.log("Phản hồi trạng thái đăng nhập:", response.data);
            setIsLoggedIn(response.data.login);
        } catch (error) {
            console.error("Lỗi kiểm tra trạng thái đăng nhập:", error);
            setIsLoggedIn(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNavigation = (e, path) => {
        if (isLoading) {
            e.preventDefault();
            return false;
        }

        if (!isLoggedIn) {
            e.preventDefault();
            alert("Bạn cần đăng nhập để sử dụng chức năng này.");
            navigate("/admin/login");
            return false;
        }
        return true;
    };

    return (
        <div className={cx("sidebar_container")}>
            <div className={cx("content")}>
                <Link
                    to="/admin/revenue"
                    className={cx("select", { active: location.pathname === "/admin/revenue" })}
                    onClick={(e) => handleNavigation(e, "/admin/revenue")}
                >
                    <p>Doanh Thu</p>
                </Link>
                <Link
                    to="/admin/staff"
                    className={cx("select", { active: location.pathname === "/admin/staff" })}
                    onClick={(e) => handleNavigation(e, "/admin/staff")}
                >
                    <p>Quản Lí Nhân Viên</p>
                </Link>
                <Link
                    to="/admin/manageuser"
                    className={cx("select", { active: location.pathname === "/admin/manageuser" })}
                    onClick={(e) => handleNavigation(e, "/admin/manageuser")}
                >
                    <p>Quản Lí Khách Hàng</p>
                </Link>
                <Link
                    to="/admin/room"
                    className={cx("select", { active: location.pathname === "/admin/room" })}
                    onClick={(e) => handleNavigation(e, "/admin/room")}
                >
                    <p>Quản Lí Phòng</p>
                </Link>
                <Link
                    to="/admin/managerbooking"
                    className={cx("select", { active: location.pathname === "/admin/managerbooking" })}
                    onClick={(e) => handleNavigation(e, "/admin/managerbooking")}
                >
                    <p>Quản Lí Đặt Phòng</p>
                </Link>
                {/* <Link
                    to="/admin/managebills"
                    className={cx("select", { active: location.pathname === "/admin/managebills" })}
                    onClick={(e) => handleNavigation(e, "/admin/managebills")}
                >
                    <p>Quản Lí Hoá Đơn</p>
                </Link>
                <Link
                    to="/admin/reviews"
                    className={cx("select", { active: location.pathname === "/admin/reviews" })}
                    onClick={(e) => handleNavigation(e, "/admin/reviews")}
                >
                    <p>Quản Lí Đánh Giá và Phản Hồi</p>
                </Link> */}
            </div>
        </div>
    );
}

export default AdminSidebar;

