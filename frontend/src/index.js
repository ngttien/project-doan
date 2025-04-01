import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import GlobalStyle from './component/GlobalStyle';
import './style/style.scss';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <GlobalStyle>
            <App />
        </GlobalStyle>
    </React.StrictMode>,
);
reportWebVitals();
