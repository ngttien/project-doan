import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaHotel, FaBed, FaUserTie, FaUser, FaConciergeBell, FaFileInvoice, FaTags, FaStar, FaChartLine } from "react-icons/fa";
import styles from "./dashboard.module.scss";
import classNames from "classnames/bind";
import axios from "axios";

const cx = classNames.bind(styles);

const menuItems = [
    { icon: <FaChartLine />, label: "Doanh thu", path: "/admin/revenue" },
    { icon: <FaUserTie />, label: "Nhân viên", path: "/admin/staff" },
    { icon: <FaUser />, label: "Khách", path: "/admin/manageuser" },
    { icon: <FaHotel />, label: "Phòng", path: "/admin/room" },
    { icon: <FaBed />, label: "Đặt phòng", path: "/admin/managerbooking" },
    // { icon: <FaConciergeBell />, label: "Dịch vụ", path: "/admin/manage-services" },
    // { icon: <FaFileInvoice />, label: "Hóa đơn", path: "/admin/manage-bills" },
    // { icon: <FaTags />, label: "Khuyến mãi", path: "/admin/promotions" },
    // { icon: <FaStar />, label: "Phản hồi", path: "/admin/reviews" },

];

const Dashboard = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Kiểm tra trạng thái đăng nhập khi component được tạo
    useEffect(() => {
        checkLoginStatus();
    }, []);

    // Hàm kiểm tra xem admin đã đăng nhập chưa
    const checkLoginStatus = async () => {
        try {
            const response = await axios.get('http://localhost:5000/authadmin/checklogin', {
                withCredentials: true
            });
            console.log("Phản hồi trạng thái đăng nhập:", response.data);
            setIsLoggedIn(response.data.login);
        } catch (error) {
            console.error("Lỗi kiểm tra trạng thái đăng nhập:", error);
            setIsLoggedIn(false);
        }
    };

    // Hàm xử lý điều hướng với kiểm tra xác thực
    const handleNavigate = (path) => {
        if (!isLoggedIn) {
            alert("Bạn cần đăng nhập để sử dụng chức năng này.");
            navigate("/admin/login");
            return;
        }
        navigate(path);
    };

    return (
        <div className={cx("dashboard_container")}>
            <div className={cx("menu_grid")}>
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className={cx("menu_item")}
                        onClick={() => handleNavigate(item.path)}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;