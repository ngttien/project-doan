// import { useState, useEffect } from "react";
import styles from './home.module.scss';
import { Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css';
import classNames from 'classnames/bind';
import Carousel from "react-multi-carousel";
import saleImg1 from '../../../assets/user/images/sale/sale_1.png';
import saleImg2 from '../../../assets/user/images/sale/sale_2.png';
import saleImg3 from '../../../assets/user/images/sale/sale_3.png';
import saleImg4 from '../../../assets/user/images/sale/sale_4.png';
import routesconfig from '~/config/routes'; // Import routesconfig


const cx = classNames.bind(styles);
const Home = () => {
    const responsive = {
        superLargeDesktop: {
          breakpoint: { max: 4000, min: 3000 },
          items: 2
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 2
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
      };

      const sliderItems = [
        { bgImg: saleImg1 },
        { bgImg: saleImg2 },
        { bgImg: saleImg3 },
        { bgImg: saleImg4 }
      ];

    return ( 
        <home className={cx("home_container")}>
            <div className={cx('background_container')}>
                <div className={cx('frame_intro')}>
                <div className={cx('intro')}>
                    <h1>VAAHotel - Nâng tầm trải nghiệm nghỉ dưỡng</h1>
                    <p>
                        Chào mừng quý khách đến với <strong>VAAHotel</strong> – nơi mỗi khoảnh khắc lưu trú đều trở thành kỷ niệm đáng nhớ!  
                        Tọa lạc ngay trung tâm <strong>quận Phú Nhuận</strong>, khách sạn chúng tôi mang đến không gian nghỉ dưỡng tinh tế với 
                        thiết kế hiện đại, tiện nghi cao cấp và dịch vụ tận tâm.  
                    </p>
                    <p>
                        Tận hưởng kỳ nghỉ của bạn với hệ thống phòng nghỉ sang trọng, nhà hàng đẳng cấp, hồ bơi vô cực, 
                        cùng nhiều dịch vụ độc quyền chỉ có tại <strong>VAAHotel</strong>.
                    </p>
                    <p>
                        <strong>Đặt phòng ngay</strong> để nhận ưu đãi đặc biệt – chúng tôi sẵn sàng chào đón bạn!
                    </p>

                    <Link to={routesconfig.room} className={cx('booking')}>
                                Đặt phòng tại đây
                    </Link>
                </div>

                </div>
            </div>
            <div className={cx('container')}>
                <div className={cx('home')}>
                    <div className={cx('home_title')}>
                        <p>Tham khảo phòng giá tốt</p>
                    </div>
                    <div className={cx('sale_slider')}>
                        <Carousel 
                            responsive={responsive} 
                            className={cx('slider')} 
                            infinite={true}
                            autoPlay={true}
                            autoPlaySpeed={3000}
                        >
                            {sliderItems.map((item, key) => (
                                <div 
                                    className={cx('slider_items')}
                                    style={{backgroundImage: `url(${item.bgImg})`}}
                                    onClick={() => window.location.href = '/room'}
                                    key={key}
                                ></div>
                            ))} 
                        </Carousel>
                    </div>
                    <div className={cx('service')}>
                        <div className={cx('service_title')}>
                            <p>Khám phá dịch vụ</p>
                        </div>
                        <div className={cx("service_items")}>
                            <Link to="/room" className={cx("rooms")}><h1>Đặt phòng</h1></Link>
                            <Link to="/sales" className={cx("sale")}><p>Khuyến mãi</p></Link>
                            <Link to="/infor" className={cx("infor")}><p>Thông tin khách sạn</p></Link>
                        </div>
                    </div>
                </div>
            </div>
        </home>
    ); 
}

export default Home;