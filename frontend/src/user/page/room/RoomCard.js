import React from 'react';
import styles from './roomCard.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const RoomCard = ({ rooms, OnClick }) => {
    return (
        <>
            {rooms.map((room) => (
                <div key={room.name} className={cx('room-card')}>
                    <div className={cx('room_image_container')}>
                        <img src={room.image} alt={room.name} className={cx('room_image')} />
                    </div>
                    <div className={cx('room-info')}>
                        <h2>
                            {room.name} - {room.price}
                        </h2>
                        <p>
                            <strong>Diện tích:</strong> {room.size} | <strong>View:</strong> {room.view} |{' '}
                            <strong>Giường:</strong> {room.beds}
                        </p>
                        <p>
                            <strong>Ưu Đãi:</strong>
                        </p>
                        <ul>
                            {room.offers.map((offer, index) => (
                                <li key={index}>{offer}</li>
                            ))}
                        </ul>
                        <div className={cx('room-actions')}>
                            <button className={cx('booking')} onClick={() => OnClick(room)}>
                                Đặt phòng
                            </button>
                            <button className={cx('detail')}>Xem chi tiết</button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default RoomCard;