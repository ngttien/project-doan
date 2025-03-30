import classNames from 'classnames/bind';
import styles from './booking.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';

const cx = classNames.bind(styles);

function Booking() {
    const [rooms, setRooms] = useState([]);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckout] = useState('');
    const [roomId, setroomId] = useState('');
    const formData = { name, email, phone, checkIn, checkOut, roomId };

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get('http://localhost:5000/booking/phong', { withCredentials: true });
                const item = response.data;
                const data = Object.keys(item).map((key) => ({
                    ID_phong: key,
                    ...item[key],
                }));
                setRooms(data);
            } catch (error) {
                console.error('Lỗi lấy danh sách phòng:', error);
            }
        };
        fetchRooms();
    }, []);
    console.log(rooms);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/booking/booking', formData, {
                withCredentials: true,
            });
            alert('đặt thành công');
        } catch (error) {
            alert('Lỗi khi đặt phòng!');
        }
    };

    return (
        <div className={cx('parent')}>
            <div className={cx('room')}>
                <div className={cx('cart')}>
                    <div className={cx('cart-item')}>
                        <table className={cx('cart-table')}>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Phòng</th>
                                    <th>Giá</th>
                                    <th>Loại phòng</th>
                                    <th>Thành tiền</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td>
                                            <img src={item.image} alt={item.name} className={cx('food-image')} />{' '}
                                            {item.name}
                                        </td>
                                        <td>{Number(item.price)} đ</td>
                                        <td>{item.type}</td>
                                        <td>{item.price} đ</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Form đặt phòng */}
            <div className={cx('form')}>
                <h2>Đặt Phòng</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Họ và Tên"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Số điện thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                    <input
                        type="date"
                        name="checkIn"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        required
                    />
                    <input
                        type="date"
                        name="checkOut"
                        value={checkOut}
                        onChange={(e) => setCheckout(e.target.value)}
                        required
                    />
                    <select name="roomId" value={roomId} onChange={(e) => setroomId(e.target.value)} required>
                        <option value="">Chọn phòng</option>
                        {rooms.map((room) => (
                            <option key={room.ID_phong} value={room.ID_phong}>
                                {room.name} - {room.price} đ
                            </option>
                        ))}
                    </select>
                    <button type="submit">Đặt Phòng</button>
                </form>
            </div>
        </div>
    );
}

export default Booking;
