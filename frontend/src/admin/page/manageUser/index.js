import classNames from 'classnames/bind';
import styles from './manageUser.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';

const cx = classNames.bind(styles);

function ManageUser() {
  const [customerList, setCustomerList] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [verified, setVerified] = useState(false);
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const formData = { userId, name, email, phone, verified };

  useEffect(() => {
    const fetchCustomerList = async () => {
      try {
        const response = await axios.get('http://localhost:5000/useradmin/getusersadmin');
        const data = Object.entries(response.data).map(([id, customer]) => ({
          ID_khachhang: id,
          ...customer,
        }));
        setCustomerList(data);
      } catch (error) {
        if (error.response?.status === 404) {
          setCustomerList([]);
        } else {
          console.error('Lỗi lấy danh sách khách hàng:', error);
          setError('Không thể tải danh sách khách hàng. Vui lòng thử lại sau.');
        }
      }
    };
    fetchCustomerList();

    const interval = setInterval(fetchCustomerList, 10000);
    return () => clearInterval(interval);
  }, []);

  const validateForm = () => {
    if (!name) {
      setError('Tên là bắt buộc.');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    try {
      await axios.put('http://localhost:5000/useradmin/updateuseradmin', formData);
      setSuccess('Cập nhật khách hàng thành công!');

      const response = await axios.get('http://localhost:5000/useradmin/getuseradmin');
      const data = Object.entries(response.data).map(([id, customer]) => ({
        ID_khachhang: id,
        ...customer,
      }));
      setCustomerList(data);
      resetForm();
    } catch (error) {
      setError('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (customer) => {
    setUserId(customer.ID_khachhang);
    setName(customer.name);
    setEmail(customer.email);
    setPhone(customer.phone || '');
    setVerified(customer.verified);
    setIsEditing(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Bạn có chắc muốn xóa khách hàng này?')) {
      try {
        await axios.delete('http://localhost:5000/useradmin/deleteuseradmin', {
          data: { userId },
        });
        setSuccess('Xóa khách hàng thành công!');

        const response = await axios.get('http://localhost:5000/useradmin/getuseradmin');
        const data = Object.entries(response.data).map(([id, customer]) => ({
          ID_khachhang: id,
          ...customer,
        }));
        setCustomerList(data);
      } catch (error) {
        setError('Lỗi khi xóa khách hàng: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const resetForm = () => {
    setUserId('');
    setName('');
    setEmail('');
    setPhone('');
    setVerified(false);
    setIsEditing(false);
  };

  return (
    <div className={cx('parent')}>
      {error && <div className={cx('alert', 'alert-error')}>{error}</div>}
      {success && <div className={cx('alert', 'alert-success')}>{success}</div>}

      {/*danh sách khách hàng*/}
      <div className={cx('customer')}>
        <div className={cx('cart')}>
          <div className={cx('cart-item')}>
            <table className={cx('cart-table')}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Số Điện Thoại</th>
                  <th>Xác Thực</th>
                  <th>Ngày Cập Nhật</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {customerList.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>
                      Không có khách hàng nào.
                    </td>
                  </tr>
                ) : (
                  customerList.map((item, idx) => (
                    <tr key={item.ID_khachhang}>
                      <td>{idx + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td>{item.verified ? 'Đã xác thực' : 'Chưa xác thực'}</td>
                      <td>
                        {item.updatedAt
                          ? new Date(item.updatedAt).toLocaleDateString('vi-VN')
                          : 'N/A'}
                      </td>
                      <td>
                        <button
                          className={cx('action-btn', 'edit-btn')}
                          onClick={() => handleEdit(item)}
                        >
                          Sửa
                        </button>
                        <button
                          className={cx('action-btn', 'delete-btn')}
                          onClick={() => handleDelete(item.ID_khachhang)}
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

      {/*cập nhật khách hàng*/}
      {isEditing && (
        <div className={cx('form')}>
          <h2>Cập Nhật Khách Hàng</h2>
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
              disabled // không cho chỉnh sửa gmail
            />
            <input
              type="tel"
              name="phone"
              placeholder="Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <label>
              <input
                type="checkbox"
                checked={verified}
                onChange={(e) => setVerified(e.target.checked)}
              />
              Đã xác thực
            </label>
            <button type="submit">Cập Nhật</button>
            <button
              type="button"
              className={cx('cancel-btn')}
              onClick={resetForm}
            >
              Hủy
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ManageUser;