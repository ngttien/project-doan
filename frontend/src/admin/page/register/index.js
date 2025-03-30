import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './registerAdmin.module.scss';
import classNames from 'classnames/bind';
import { FaUser, FaLock, FaEnvelope, FaPhone } from 'react-icons/fa';

const cx = classNames.bind(styles);

function RegisterAdmin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('https://qlks1-918e7-default-rtdb.firebaseio.com/admins.json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name, phone })
            });

            if (!response.ok) throw new Error('Đăng ký thất bại! Vui lòng thử lại.');

            alert('Đăng ký thành công! Chuyển hướng đến trang đăng nhập.');
            setTimeout(() => navigate('/admin/login'), 2000);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className={cx('background_register')}>
            <div className={cx('register_container')}>
                <form className={cx('register_form')} onSubmit={handleSubmit}>
                    <h1>Register Admin</h1>
                    {error && <p className={cx('error_message')}>{error}</p>}

                    <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <FaUser className={cx('icon')} />

                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <FaEnvelope className={cx('icon')} />

                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <FaLock className={cx('icon')} />

                    <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    <FaPhone className={cx('icon')} />

                    <button type="submit" className={cx('register_button')}>Register</button>
                </form>
            </div>
        </div>
    );
}

export default RegisterAdmin;
