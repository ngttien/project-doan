// src/components/RoomManagement.js
import classNames from 'classnames/bind';
import styles from './manageRooms.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';

const cx = classNames.bind(styles);

function ManageRooms() {
    const [roomList, setRoomList] = useState([]);
    const [roomCode, setRoomCode] = useState(''); // For editing
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [size, setSize] = useState('');
    const [beds, setBeds] = useState('');
    const [view, setView] = useState('');
    const [image, setImage] = useState('');
    const [amenities, setAmenities] = useState('');
    const [offers, setOffers] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [status, setStatus] = useState('trống');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const formData = {
        roomCode,
        name,
        price,
        size,
        beds,
        view,
        image,
        amenities: amenities ? amenities.split(',').map(item => item.trim()) : [],
        offers: offers ? offers.split(',').map(item => item.trim()) : [],
        description,
        type,
        status,
    };

    // Fetch room list on component mount
    useEffect(() => {
        const fetchRoomList = async () => {
            try {
                const response = await axios.get('http://localhost:5000/room/getroom');
                const data = Object.entries(response.data).map(([id, room]) => ({
                    ID_phong: id,
                    ...room,
                }));
                setRoomList(data);
            } catch (error) {
                if (error.response?.status === 404) {
                    setRoomList([]);
                } else {
                    console.error('Lỗi lấy danh sách phòng:', error);
                    setError('Không thể tải danh sách phòng. Vui lòng thử lại sau.');
                }
            }
        };
        fetchRoomList();
    }, []);

    // Validate form inputs
    const validateForm = () => {
        if (!name || !price) {
            setError('Tên và giá phòng là bắt buộc.');
            return false;
        }
        if (price && isNaN(price) || Number(price) <= 0) {
            setError('Giá phòng phải là số dương.');
            return false;
        }
        return true;
    };

    // Handle form submission (add or update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) return;

        try {
            if (isEditing) {
                // Update room
                await axios.put('http://localhost:5000/room/updateroom', formData);
                setSuccess('Cập nhật phòng thành công!');
            } else {
                // Add new room
                await axios.post('http://localhost:5000/room/addroom', formData);
                setSuccess('Thêm phòng thành công!');
            }

            // Refresh room list
            const response = await axios.get('http://localhost:5000/room/getroom');
            const data = Object.entries(response.data).map(([id, room]) => ({
                ID_phong: id,
                ...room,
            }));
            setRoomList(data);
            resetForm();
        } catch (error) {
            setError('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    // Handle edit button click
    const handleEdit = (room) => {
        setRoomCode(room.ID_phong);
        setName(room.name);
        setPrice(room.price);
        setSize(room.size || '');
        setBeds(room.beds || '');
        setView(room.view || '');
        setImage(room.image || '');
        setAmenities(room.amenities ? room.amenities.join(', ') : '');
        setOffers(room.offers ? room.offers.join(', ') : '');
        setDescription(room.description || '');
        setType(room.type || '');
        setStatus(room.status || 'trống');
        setIsEditing(true);
    };

    // Handle delete button click
    const handleDelete = async (roomCode) => {
        if (window.confirm('Bạn có chắc muốn xóa phòng này?')) {
            try {
                await axios.delete('http://localhost:5000/room/deleteroom', {
                    data: { roomCode },
                });
                setSuccess('Xóa phòng thành công!');

                // Refresh room list
                const response = await axios.get('http://localhost:5000/room/getroom');
                const data = Object.entries(response.data).map(([id, room]) => ({
                    ID_phong: id,
                    ...room,
                }));
                setRoomList(data);
            } catch (error) {
                setError('Lỗi khi xóa phòng: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    // Reset form
    const resetForm = () => {
        setRoomCode('');
        setName('');
        setPrice('');
        setSize('');
        setBeds('');
        setView('');
        setImage('');
        setAmenities('');
        setOffers('');
        setDescription('');
        setType('');
        setStatus('trống');
        setIsEditing(false);
    };

    return (
        <div className={cx('parent')}>
            {/* Display Success/Error Messages */}
            {error && <div className={cx('alert', 'alert-error')}>{error}</div>}
            {success && <div className={cx('alert', 'alert-success')}>{success}</div>}

            {/* Room List */}
            <div className={cx('room')}>
                <div className={cx('cart')}>
                    <div className={cx('cart-item')}>
                        <table className={cx('cart-table')}>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã Phòng</th>
                                    <th>Tên Phòng</th>
                                    <th>Giá</th>
                                    <th>Kích Thước</th>
                                    <th>Số Giường</th>
                                    <th>Tình Trạng</th>
                                    <th>Loại Phòng</th>
                                    <th>Ngày Tạo</th>
                                    <th>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roomList.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" style={{ textAlign: 'center' }}>
                                            Không có phòng nào.
                                        </td>
                                    </tr>
                                ) : (
                                    roomList.map((item, idx) => (
                                        <tr key={item.ID_phong}>
                                            <td>{idx + 1}</td>
                                            <td>{item.roomCode}</td>
                                            <td>{item.name}</td>
                                            <td>{Number(item.price).toLocaleString('vi-VN')} đ</td>
                                            <td>{item.size || 'N/A'}</td>
                                            <td>{item.beds || 'N/A'}</td>
                                            <td>{item.status}</td>
                                            <td>{item.type || 'N/A'}</td>
                                            <td>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</td>
                                            <td>
                                                <button
                                                    className={cx('action-btn', 'edit-btn')}
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    className={cx('action-btn', 'delete-btn')}
                                                    onClick={() => handleDelete(item.roomCode)}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Form to Add/Edit Room */}
            <div className={cx('form')}>
                <h2>{isEditing ? 'Cập Nhật Phòng' : 'Thêm Phòng'}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Tên phòng"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Giá phòng"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        name="size"
                        placeholder="Kích thước (e.g., 30m2)"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                    />
                    <input
                        type="text"
                        name="beds"
                        placeholder="Số giường (e.g., 1 giường đôi)"
                        value={beds}
                        onChange={(e) => setBeds(e.target.value)}
                    />
                    <input
                        type="text"
                        name="view"
                        placeholder="Hướng nhìn (e.g., Biển)"
                        value={view}
                        onChange={(e) => setView(e.target.value)}
                    />
                    <input
                        type="text"
                        name="image"
                        placeholder="URL hình ảnh"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    />
                    <input
                        type="text"
                        name="amenities"
                        placeholder="Tiện nghi (cách nhau bằng dấu phẩy)"
                        value={amenities}
                        onChange={(e) => setAmenities(e.target.value)}
                    />
                    <input
                        type="text"
                        name="offers"
                        placeholder="Ưu đãi (cách nhau bằng dấu phẩy)"
                        value={offers}
                        onChange={(e) => setOffers(e.target.value)}
                    />
                    <textarea
                        name="description"
                        placeholder="Mô tả phòng"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <input
                        type="text"
                        name="type"
                        placeholder="Loại phòng (e.g., Deluxe)"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    />
                    <select
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="trống">Trống</option>
                        <option value="đã đặt">Đã đặt</option>
                        <option value="bảo trì">Bảo trì</option>
                    </select>
                    <button type="submit">{isEditing ? 'Cập Nhật' : 'Thêm'}</button>
                    {isEditing && (
                        <button
                            type="button"
                            className={cx('cancel-btn')}
                            onClick={resetForm}
                        >
                            Hủy
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}

export default ManageRooms;