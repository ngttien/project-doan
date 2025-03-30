import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './loginAdmin.module.scss';
import classNames from 'classnames/bind';
import { FaUser, FaLock } from 'react-icons/fa';
import axios from 'axios';

const cx = classNames.bind(styles);

function LoginAdmin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/authadmin/login', { email, password }, { withCredentials: true });
            if (response.data.success) {
                navigate('/admin'); // Chuyển hướng đến trang chính
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Đăng nhập thất bại!');
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className={cx('background_login')}>
            <div className={cx('login_container')}>
                <form className={cx('login_form')} onSubmit={handleSubmit}>
                    <div className={cx('login_title')}>
                        <h1>Admin Login</h1>
                    </div>
                    {error && <p className={cx('error_message')}>{error}</p>}

                    {/* Email */}
                    <input
                        className={cx('input_username')}
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <FaUser className={cx('icon')} />

                    {/* Password */}
                    <input
                        className={cx('input_password')}
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FaLock className={cx('icon')} />

                    <div className={cx('remember_forgot')}>
                        <label className={cx('remember_label')}>
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="/forgotAdmin" className={cx('forgot_password')}>
                            Forgot password?
                        </a>
                    </div>

                    <div className={cx('login_btn')}>
                        <button type="submit" className={cx('login_button')}>
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginAdmin;