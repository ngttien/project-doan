import { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import classNames from 'classnames/bind';
import styles from './function.module.scss';
import { MdArrowDropDown } from 'react-icons/md';
import routesconfig from '~/config/routes'; // Import routesconfig

const cx = classNames.bind(styles);

function Function() {
    const [isServiceOpen, setIsServiceOpen] = useState(false);

    return (
        <div className={cx('function-container')}>
            <div className={cx('top_function')}></div>
            <div className={cx('bottom_function')}>
                <div className={cx('container')}>
                    <div className={cx('row')}>
                        <div className={cx('function')}>
                            <Link to={routesconfig.introduce} className={cx('intro')}>
                                Giới thiệu
                            </Link>
                            <Link to={routesconfig.sale} className={cx('sale')}>
                                Khuyến mãi
                            </Link>
                            <Link to={routesconfig.room} className={cx('booking')}>
                                Phòng
                            </Link>
                            <Link to={routesconfig.booking} className={cx('booking')}>
                                dat Phòng
                            </Link>
                            <div
                                className={cx('service-wrapper')}
                                onMouseEnter={() => setIsServiceOpen(true)}
                                onMouseLeave={() => setIsServiceOpen(false)}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Function;
