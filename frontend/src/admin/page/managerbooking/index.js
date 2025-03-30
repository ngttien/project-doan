import styles from './managebooking.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';

function ManagerBooking() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get('http://localhost:5000/booking/list', { withCredentials: true });
                setBookings(Object.values(response.data));
            } catch (error) {
                console.error('Lỗi lấy danh sách đặt phòng:', error);
            }
        };
        fetchBookings();
    }, []);

    const handleConfirm = async (bookingCode) => {
        try {
            await axios.post('http://localhost:5000/booking/confirm', { bookingCode }, { withCredentials: true });
            alert('Xác nhận đặt phòng thành công');
            window.location.reload();
        } catch (error) {
            alert('Lỗi khi xác nhận đặt phòng!');
        }
    };

    const handleCancel = async (bookingCode) => {
        try {
            await axios.post('http://localhost:5000/booking/cancel', { bookingCode }, { withCredentials: true });
            alert('Hủy đặt phòng thành công');
            window.location.reload();
        } catch (error) {
            alert('Lỗi khi hủy đặt phòng!');
        }
    };

    return (
        <div className={styles.parent}>
            <div className={styles.bookingList}>
                <h2>Quản lý Đặt Phòng</h2>
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên Người Đặt</th>
                            <th>Thông Tin Phòng</th>
                            <th>Giá Tiền</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking, idx) => (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{booking.name}</td>
                                <td>{booking.roomId} - {booking.roomName}</td>
                                <td>{booking.price} VND</td>
                                <td>{booking.TrangThai}</td>
                                <td>
                                    {booking.TrangThai === 'dang cho xac nhan' && (
                                        <button onClick={() => handleConfirm(booking.bookingCode)}>Xác nhận</button>
                                    )}
                                    {booking.TrangThai !== 'da huy' && (
                                        <button onClick={() => handleCancel(booking.bookingCode)}>Hủy</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ManagerBooking;