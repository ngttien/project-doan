import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Styles from './headerAdmin.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Styles);

function AdminHeader() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         try {
    //             // Lấy userId hiện tại
    //             const userIdResponse = await axios.get('https://qlks1-918e7-default-rtdb.firebaseio.com/user.json');
    //             const userId = userIdResponse.data;

    //             if (!userId) {
    //                 navigate('/login');
    //                 return;
    //             }

    //             // Lấy thông tin user từ Realtime Database
    //             const userResponse = await axios.get(`https://qlks1-918e7-default-rtdb.firebaseio.com/users/${userId}.json`);
    //             setUser(userResponse.data);
    //         } catch (error) {
    //             console.error('Lỗi khi lấy thông tin user:', error);
    //             navigate('/login');
    //         }
    //     };

    //     fetchUserData();
    // }, [navigate]);

    // Xử lý đăng xuất
    const handleLogout = () => {
        axios.delete('https://qlks1-918e7-default-rtdb.firebaseio.com/user.json')
            .then(() => {
                navigate('/login');
            })
            .catch((error) => {
                console.error('Lỗi khi đăng xuất:', error);
            });
    };

    return (
        <header className={cx("header_container")}>
            <div className={cx("container")}>
                <div className={cx("header")}>
                    <div className={cx("user_info")}>
                        {user ? (
                            <>
                                <span>Xin chào, {user.name} ({user.email})</span>
                                <button className={cx("logout_button")} onClick={handleLogout}>Đăng xuất</button>
                            </>
                        ) : (
                            <span>Đang tải...</span>
                        )}
                    </div>

                    <h1 className={cx("admin_title")} onClick={() => navigate('/admin')}>Admin</h1>
                    <nav className={cx("admin_nav")}>
                        <Link to="/admin/payments" className={cx("nav_link")}>Quản lý thanh toán</Link>
                        <Link to="/admin/transaction-history" className={cx("nav_link")}>Lịch sử giao dịch</Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default AdminHeader;