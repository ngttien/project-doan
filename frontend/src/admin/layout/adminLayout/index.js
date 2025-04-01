import AdminHeader from '../AdminHeader/index';
import AdminSidebar from '../AdminSidebar/index';
import styles from './adminLayout.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function AdminLayout({ children }) {
    return (
        <div>
            <AdminHeader />
            <div className={cx('row')}>
                <div className={cx('col-ad-2')}>
                    <AdminSidebar />
                </div>
                <div className={cx('col-ad-8')}>
                    <div className={cx('iner')}>
                        <div>{children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;
