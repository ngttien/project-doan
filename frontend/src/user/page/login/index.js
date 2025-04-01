import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import styles from './login.module.scss';
import classNames from 'classnames/bind';
import { FaUser, FaLock, FaArrowLeft } from 'react-icons/fa'; // Import icon
import Button from '../../../component/Button/index';
import { AuthContext } from '~/AuthContent';
import { useNavigate } from 'react-router-dom';
import routes from '~/config/routes';
const cx = classNames.bind(styles);

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { user, login } = useContext(AuthContext);
    const navigate = useNavigate();
    if (user) {
        navigate(routes.home);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <div className={cx('background_login')}>
            <div className={cx('login_container')}>
                {/* Nút quay về Home */}
                <Link to="/" className={cx('back_home')}>
                    <FaArrowLeft className={cx('back_icon')} /> Home
                </Link>

                <form className={cx('login_form')} onSubmit={handleSubmit}>
                    <div className={cx('login_title')}>
                        <h1>Login</h1>
                    </div>

                    {/* Username */}
                    <input
                        className={cx('input_username')}
                        type="text"
                        name="username"
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
                        name="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FaLock className={cx('icon')} />

                    {/* Remember me & Forgot password */}
                    <div className={cx('remember_forgot')}>
                        <label className={cx('remember_label')}>
                            <input type="checkbox" name="remember" /> Remember me
                        </label>
                        <a href="/forgot" className={cx('forgot_password')}>
                            Forgot password?
                        </a>
                    </div>

                    {/* Button Login */}
                    <div className={cx('login_btn')}>
                        <button type="submit" className={cx('login_button')}>
                            Login
                        </button>
                    </div>

                    {/* Register */}
                    <div className={cx('register_link')}>
                        <p>
                            To register new account →
                            <Button className={cx('button_regis')} primary to={'/register'}>
                                Click Here
                            </Button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
