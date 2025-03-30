// src/components/StaffManagement.js
import classNames from 'classnames/bind';
import styles from './manageStaff.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';

const cx = classNames.bind(styles);

function StaffManagement() {
    const [staffList, setStaffList] = useState([]);
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [staffId, setStaffId] = useState('');
    const [staffCode, setStaffCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const formData = { staffId, staffCode, name, position, email, phone };

    // Fetch staff list on component mount
    useEffect(() => {
        const fetchStaffList = async () => {
            try {
                const response = await axios.get('http://localhost:5000/staff/getstaff');
                const data = Object.entries(response.data).map(([id, staff]) => ({
                    ID_nhanvien: id,
                    ...staff,
                }));
                setStaffList(data);
            } catch (error) {
                console.error('Lỗi lấy danh sách nhân viên:', error);
                setError('Không thể tải danh sách nhân viên. Vui lòng thử lại sau.');
            }
        };
        fetchStaffList();
    }, []);

    // Validate form inputs
    const validateForm = () => {
        if (!name || !position) {
            setError('Tên và vị trí là bắt buộc.');
            return false;
        }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Email không hợp lệ.');
            return false;
        }
        if (phone && !/^\d{10}$/.test(phone)) {
            setError('Số điện thoại phải có 10 chữ số.');
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
                // Update staff
                await axios.put('http://localhost:5000/staff/updatestaff', formData);
                setSuccess('Cập nhật nhân viên thành công!');
            } else {
                // Add new staff
                await axios.post('http://localhost:5000/staff/addstaff', formData);
                setSuccess('Thêm nhân viên thành công!');
            }
            // Refresh staff list and reset form
            const response = await axios.get('http://localhost:5000/staff/getstaff');
            const data = Object.entries(response.data).map(([id, staff]) => ({
                ID_nhanvien: id,
                ...staff,
            }));
            setStaffList(data);
            resetForm();
        } catch (error) {
            setError('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    // Handle edit button click
    const handleEdit = (staff) => {
        setStaffId(staff.ID_nhanvien);
        setStaffCode(staff.staffCode);
        setName(staff.name);
        setPosition(staff.position);
        setEmail(staff.email || '');
        setPhone(staff.phone || '');
        setIsEditing(true);
    };

    // Handle delete button click
    const handleDelete = async (staffCode) => {
        if (window.confirm('Bạn có chắc muốn xóa nhân viên này?')) {
            try {
                await axios.delete('http://localhost:5000/staff/deletestaff', {
                    data: { staffCode },
                });
                setSuccess('Xóa nhân viên thành công!');
                // Refresh staff list
                const response = await axios.get('http://localhost:5000/getstaff');
                const data = Object.entries(response.data).map(([id, staff]) => ({
                    ID_nhanvien: id,
                    ...staff,
                }));
                setStaffList(data);
            } catch (error) {
                setError('Lỗi khi xóa nhân viên: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    // Reset form
    const resetForm = () => {
        setStaffId('');
        setStaffCode('');
        setName('');
        setPosition('');
        setEmail('');
        setPhone('');
        setIsEditing(false);
    };

    return (
        <div className={cx('parent')}>
            {/* Display Success/Error Messages */}
            {error && <div className={cx('alert', 'alert-error')}>{error}</div>}
            {success && <div className={cx('alert', 'alert-success')}>{success}</div>}

            {/* Staff List */}
            <div className={cx('staff')}>
                <div className={cx('cart')}>
                    <div className={cx('cart-item')}>
                        <table className={cx('cart-table')}>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã Nhân Viên</th>
                                    <th>Tên</th>
                                    <th>Vị Trí</th>
                                    <th>Email</th>
                                    <th>Số Điện Thoại</th>
                                    <th>Ngày Tạo</th>
                                    <th>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staffList.map((item, idx) => (
                                    <tr key={item.ID_nhanvien}>
                                        <td>{idx + 1}</td>
                                        <td>{item.staffCode}</td>
                                        <td>{item.name}</td>
                                        <td>{item.position}</td>
                                        <td>{item.email}</td>
                                        <td>{item.phone}</td>
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
                                                onClick={() => handleDelete(item.staffCode)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Form to Add/Edit Staff */}
            <div className={cx('form')}>
                <h2>{isEditing ? 'Cập Nhật Nhân Viên' : 'Thêm Nhân Viên'}</h2>
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
                        type="text"
                        name="position"
                        placeholder="Vị Trí"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Số điện thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
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

export default StaffManagement;