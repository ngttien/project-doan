import Home from '~/user/page/home';
// import Menu from '~/user/page/menu';
import Contact from '~/user/page/contact';
import Login from '~/user/page/login';
import Room from '~/user/page/room';
// import Sale from '~/user/page/sale';
// import Search from '~/user/page/search';
import Register from '~/user/page/register';
import introduce from '~/user/page/introduce';
import Booking from '~/user/page/booking';
import UserPage from '~/user/page/user.infor/index';

//////////////////////////////////////////////////////////////
import Dashboard from '~/admin/page/dashboard';
import AdLogin from '~/admin/page/login';
import ManagerBooking from '~/admin/page/managerbooking';
import ManageUser from '~/admin/page/manageUser';
import Staff from '~/admin/page/manageStaff';
// import Reviews from '~/admin/page/reviews';
import AdminLayout from '~/admin/layout/adminLayout';
import routesconfig from '~/config/routes';

const config = [
    { path: routesconfig.home, component: Home },
    // { path: routesconfig.menu, component: Menu },
    { path: routesconfig.contact, component: Contact },
    { path: routesconfig.login, component: Login, Layout: null }, // Ẩn Header, Sidebar, Footer
    { path: routesconfig.room, component: Room },
    // { path: routesconfig.sale, component: Sale },
    // { path: routesconfig.search, component: Search },
    { path: routesconfig.introduce, component: introduce },
    { path: routesconfig.register, component: Register, Layout: null },
    { path: routesconfig.booking, component: Booking },
    { path: routesconfig.user, component: UserPage },
    ////////// //
    { path: routesconfig.dashboard, component: Dashboard, Layout: AdminLayout },
    { path: routesconfig.adlogin, component: AdLogin, Layout: null },
    { path: routesconfig.managerbooking, component: ManagerBooking, Layout: AdminLayout },
    { path: routesconfig.manageuser, component: ManageUser, Layout: AdminLayout },
    { path: routesconfig.staff, component: Staff, Layout: AdminLayout },
    //{ path: routesconfig.homeadmin, component: Home, Layout: AdminLayout },
    // { path: '/admin/reviews', component: Reviews , Layout: AdminLayout },
];

export default config;
