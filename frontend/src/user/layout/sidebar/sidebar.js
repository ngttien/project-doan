import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import styles from './sidebar.module.scss';
import classNames from 'classnames/bind';
import { MdArrowDropDown } from 'react-icons/md';
import routesconfig from '~/config/routes'; // Import routesconfig

const cx = classNames.bind(styles);

function Sidebar({ isOpen, toggleSidebar }) {
    const sidebarRef = useRef(null);
    const [isServiceOpen, setIsServiceOpen] = useState(false);

    // Đóng sidebar khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                toggleSidebar();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, toggleSidebar]);

    return (
        <>
            {/* Overlay nền khi sidebar mở */}
            {isOpen && <div className={cx('backdrop')} onClick={toggleSidebar}></div>}

            {/* Sidebar */}
            <nav ref={sidebarRef} className={cx('sidebar', { active: isOpen })}>
                <div className={cx('close-btn')} onClick={toggleSidebar}>
                    &times;
                </div>

                {/* Sidebar nội dung */}
                <div className={cx('sidebar-top')}>
                    <div className={cx('profile')}>
                        <div className={cx('row')}>
                            <Link className={cx('avatar')} to="#">
                                <img src="/logo/test-avt.png" alt="Avatar" />
                            </Link>
                            <div className={cx('user')}>
                                <Link className={cx('user-infor')} to="/user">
                                    Trần Văn A
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={cx('sidebar-middle')}>
                    <Link to={routesconfig.sale} className={cx('sale')}>
                        <p>Khuyến mãi</p>
                    </Link>
                    <Link to={routesconfig.room} className={cx('booking')}>
                        <p>Phòng</p>
                    </Link>
                    <Link to={routesconfig.booking} className={cx('booking')}>
                        <p>Đặt Phòng</p>
                    </Link>

                    {/* Dropdown dịch vụ */}
                    <div
                        className={cx('service-wrapper')}
                        onMouseEnter={() => setIsServiceOpen(true)}
                        onMouseLeave={() => setIsServiceOpen(false)}
                    >
                        {' '}
                    </div>

                    <Link to={routesconfig.introduce} className={cx('intro')}>
                        <p>Giới thiệu</p>
                    </Link>
                    <Link to={routesconfig.sale} className={cx('sale')}>
                        <p>Khuyến mãi</p>
                    </Link>
                </div>

                {/* Sidebar bottom */}
                <div className={cx('sidebar-bottom')}>
                    <Link to="#">Trợ giúp</Link>
                    <Link to="#">Gửi ý kiến phản hồi</Link>
                </div>
            </nav>
        </>
    );
}

export default Sidebar;
