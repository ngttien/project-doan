import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DefaultLayout from './user/layout/defaultlayout';
import routes from '~/routes/Route';
import ScrollToTop from './ScrollToTop';
import AuthProvider from './AuthContent';

function App() {
    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />

                <div className="app-container">
                    <Routes>
                        {routes.map((route, idx) => {
                            let Layout = DefaultLayout;
                            const Page = route.component;
                            if (route.Layout === null) {
                                Layout = Fragment;
                            } else if (route.Layout) {
                                Layout = route.Layout;
                            }
                            return (
                                <Route
                                    key={idx}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
