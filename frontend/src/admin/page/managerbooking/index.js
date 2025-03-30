import classNames from 'classnames/bind';
import styles from './managebooking.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';

const cx = classNames.bind(styles);

function ManageBooking() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get('http://localhost:5000/bookingadmin/getbooking', { withCredentials: true });

                if (response.data.success && Array.isArray(response.data.bookedRooms)) {
                    setBookings(response.data.bookedRooms);
                } else if (Object.entries(response.data).length > 0) {
                    setBookings(Object.entries(response.data).map(([id, booking]) => ({ bookingCode: id, ...booking })));
                } else {
                    setBookings([]);
                }
            } catch (error) {
                console.error('Lỗi lấy danh sách đặt phòng:', error);
                setError('Không thể tải danh sách đặt phòng. Vui lòng thử lại sau.');
            }
        };
        fetchBookings();
        const interval = setInterval(fetchBookings, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleUpdate = async (bookingCode, newStatus) => {
        setError('');
        setSuccess('');
        try {
            await axios.put('http://localhost:5000/bookingadmin/updatebooking', { bookingCode, TrangThai: newStatus }, { withCredentials: true });
            setSuccess(`Cập nhật trạng thái thành ${newStatus} thành công!`);
            setBookings(prev => prev.map(b => b.bookingCode === bookingCode ? { ...b, TrangThai: newStatus } : b));
        } catch (error) {
            console.error('Lỗi cập nhật:', error);
            setError('Lỗi khi cập nhật trạng thái đặt phòng!');
        }
    };

    const handleDelete = async (bookingCode) => {
        if (window.confirm('Bạn có chắc muốn xóa đặt phòng này?')) {
            setError('');
            setSuccess('');
            try {
                await axios.delete('http://localhost:5000/bookingadmin/deletebooking', {
                    data: { bookingCode },
                    withCredentials: true
                });
                setSuccess('Xóa đặt phòng thành công!');
                setBookings(prev => prev.filter(b => b.bookingCode !== bookingCode));
            } catch (error) {
                console.error('Lỗi xóa:', error);
                setError('Lỗi khi xóa đặt phòng!');
            }
        }
    };

    return (
        <div className={cx('parent')}>
            {error && <div className={cx('alert', 'alert-error')}>{error}</div>}
            {success && <div className={cx('alert', 'alert-success')}>{success}</div>}

            <div className={cx('bookingList')}>
                <h2>Quản lý Đặt Phòng</h2>
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên Người Đặt</th>
                            <th>Phòng</th>
                            <th>Ngày Check-in</th>
                            <th>Ngày Check-out</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center' }}>Không có đặt phòng nào.</td>
                            </tr>
                        ) : (
                            bookings.map((booking, idx) => (
                                <tr key={booking.bookingCode}>
                                    <td>{idx + 1}</td>
                                    <td>{booking.name}</td>
                                    <td>{booking.roomId}</td>
                                    <td>{booking.checkIn}</td>
                                    <td>{booking.checkOut}</td>
                                    <td>{booking.TrangThai}</td>
                                    <td>
                                        {booking.TrangThai === 'dang cho xac nhan' && (
                                            <button className={cx('confirm-btn')} onClick={() => handleUpdate(booking.bookingCode, 'da xac nhan')}>Xác nhận</button>
                                        )}
                                        {booking.TrangThai !== 'da huy' && (
                                            <button className={cx('cancel-btn')} onClick={() => handleUpdate(booking.bookingCode, 'da huy')}>Hủy</button>
                                        )}
                                        <button className={cx('delete-btn')} onClick={() => handleDelete(booking.bookingCode)}>Xóa</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ManageBooking;