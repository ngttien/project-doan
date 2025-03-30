import { Link, useLocation } from "react-router-dom"; // Import useLocation
import styles from "./sidebarAdmin.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function AdminSidebar() {
    const location = useLocation(); // Lấy pathname hiện tại

    return (
        <div className={cx("sidebar_container")}>
            <div className={cx("content")}>
                <Link to="/admin/revenue" className={cx("select", { active: location.pathname === "/admin/revenue" })}>
                    <p>Doanh Thu</p>
                </Link>
                <Link to="/admin/staff" className={cx("select", { active: location.pathname === "/admin/sstaff" })}>
                    <p>Quản Lí Nhân Viên</p>
                </Link>
                <Link to="/admin/manageuser" className={cx("select", { active: location.pathname === "/admin/manageuser" })}>
                    <p>Quản Lí Khách Hàng</p>
                </Link>
                <Link to="/admin/room" className={cx("select", { active: location.pathname === "/admin/room" })}>
                    <p>Quản Lí Phòng</p>
                </Link>
                <Link to="/admin/managerbooking" className={cx("select", { active: location.pathname === "/admin/managerbooking" })}>
                    <p>Quản Lí Đặt Phòng</p>
                </Link>
                <Link to="/admin/manageservices" className={cx("select", { active: location.pathname === "/admin/manageservices" })}>
                    <p>Quản Lí Dịch Vụ</p>
                </Link>
                <Link to="/admin/managebills" className={cx("select", { active: location.pathname === "/admin/managebills" })}>
                    <p>Quản Lí Hoá Đơn</p>
                </Link>
                <Link to="/admin/reviews" className={cx("select", { active: location.pathname === "/admin/reviews" })}>
                    <p>Quản Lí Đánh Giá và Phản Hồi</p>
                </Link>
            </div>
        </div>
    );
}

export default AdminSidebar;
