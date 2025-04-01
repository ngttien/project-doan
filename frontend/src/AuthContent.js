import axios from 'axios';
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();
// api dang nhap
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        axios
            .get('http://localhost:5000/auth/checklogin', { withCredentials: true })
            .then((res) => setUser(res.data.user))
            .catch(() => setUser(null));
    }, []);
    const login = async (email, password) => {
        try {
            const res = await axios.post(
                'http://localhost:5000/auth/login',
                { email, password },
                { withCredentials: true },
            );
            setUser(res.data.user);
        } catch (error) {
            alert(error.response?.data?.message || 'ngpu qua dnhap sai');
        }
    };
    const logout = async () => {
        const res = await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
        if (res.data.success) {
            setUser(null);
        }
        // api dang ki
    };
    const register = async (name, email, password, phone,date) => {
        try {
            const res = await axios.post('http://localhost:5000/auth/register', {
                name,
                email,
                password,
                phone,
                date,
            });
            alert(res.data.message || 'Đăng ký thành công!otp đã được gửi về mấy, kiểm tra email của bạn');
        } catch (error) {
            alert(error.response?.data?.message || 'Đăng ký thất bại!');
        }
    };
    return <AuthContext.Provider value={{ user, login, logout, register }}>{children}</AuthContext.Provider>;
};
export default AuthProvider;
