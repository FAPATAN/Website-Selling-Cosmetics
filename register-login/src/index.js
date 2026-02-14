import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import App from './Frontend/App';
import Home from './Home';
import ForgotPasswordSystem from './Frontend/forgot';
import Bestsellerform from './Frontend/Bestsellerform';
import Best1 from './Frontend/best1';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Home/home.html" replace />} />
        <Route path="/app" element={<App />} />
        <Route path="/forgot" element={<ForgotPasswordSystem />} />
        <Route path="/bestsellerform" element={<Bestsellerform />} />
        <Route path="/best1" element={<Best1 />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
