import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Styles from './headerAdmin.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Styles);

function AdminHeader() {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdminLogin = async () => {
            try {
                setLoading(true);
                // Sử dụng API checkLogin đã định nghĩa trong AuthAdminController
                const response = await axios.get('http://localhost:5000/authadmin/checklogin', {
                    withCredentials: true
                });

                if (response.data.login) {
                    setAdmin(response.data.admin);
                } else {
                    setAdmin(null);
                }
            } catch (error) {
                console.error('Lỗi khi kiểm tra đăng nhập:', error);
                setAdmin(null);
            } finally {
                setLoading(false);
            }
        };

        checkAdminLogin();
    }, []);

    // Xử lý đăng xuất
    const handleLogout = async () => {
        try {
            // Sử dụng API logout đã định nghĩa trong AuthAdminController
            await axios.post('http://localhost:5000/authadmin/logout', {}, {
                withCredentials: true
            });
            setAdmin(null);
            navigate('/admin/login');
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
        }
    };

    const handleLogin = () => {
        navigate('/admin/login');
    };

    return (
        <header className={cx("header_container")}>
            <div className={cx("container")}>
                <div className={cx("header")}>
                    <div className={cx("user_info")}>
                        {loading ? (
                            <span>Đang tải...</span>
                        ) : admin ? (
                            <>
                                <span>Xin chào, {admin.email}</span>
                                <button className={cx("logout_button")} onClick={handleLogout}>Đăng xuất</button>
                            </>
                        ) : (
                            <>
                                <span>Chưa đăng nhập</span>
                                <button className={cx("login_button")} onClick={handleLogin}>Đăng nhập</button>
                            </>
                        )}
                    </div>

                    <h1 className={cx("admin_title")} onClick={() => navigate('/admin')}>Admin</h1>
                </div>
            </div>
        </header>
    );
}

export default AdminHeader;