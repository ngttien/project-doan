import RoomCard from './RoomCard';
import styles from './roomCard.module.scss';
import classNames from 'classnames/bind';
import { useEffect } from 'react';
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import routesconfig from '~/config/routes';
const cx = classNames.bind(styles);

const BookingPage = () => {
    const [rooms, setRooms] = React.useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get('http://localhost:5000/room');
                const item = response.data;
                const data = Object.keys(item).map((key) => {
                    return {
                        ID_phong: key,
                        ...item[key],
                    };
                });

                setRooms(data);
            } catch (error) {}
        };
        fetchRooms();
    }, []);
    const OnClickRoom = async (room) => {
        const ks = await axios.post(
            'http://localhost:5000/booking/getbooking',
            { ID_phong: room.ID_phong },
            { withCredentials: true },
        );
        if (ks.data.success) {
            navigate(routesconfig.booking);
        }
    };
    return (
        <div className={cx('room_container')}>
            <div className={cx('container')}>
                <div className={cx('room-list')}>
                    <RoomCard rooms={rooms} OnClick={OnClickRoom} />
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
