import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Home from './Frontend/Home';
import App from './Frontend/App';
import ProfileSettings from './Frontend/Account';
import Cart from './Frontend/Cart';
import Orders from './Frontend/Orders';
import Orders2 from './Frontend/Orders2';
import Promotionform from './Frontend/Promotion';
import Bestsellerform1 from './Frontend/Bestsellerform1';
import NewSection from './Frontend/new';
import FaceSection from './Frontend/face';
import EyeSection from './Frontend/Eye';
import LipSection from './Frontend/Lip';
import CheekSection from './Frontend/Cheek';
import Best1 from './Frontend/best1';
import Best2 from './Frontend/best2';
import Pay from './Frontend/Pay';
import Payment from './Frontend/Payment';
import Shipping from './Frontend/Shipping';
import Information from './Frontend/Information';
import ForgotPasswordSystem from './Frontend/forgot';
import AdminDashboard from './Frontend/Admin/AdminDashboard';
import AdminOrders from './Frontend/Admin/AdminOrders';
import AdminProducts from './Frontend/Admin/AdminProducts';
import AdminPromotions from './Frontend/Admin/AdminPromotions';
import AdminPriceRange from './Frontend/Admin/AdminPriceRange';
import AdminUsers from './Frontend/Admin/AdminUsers';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<App />} />
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/insert" element={<Navigate to="/auth" replace />} />
        <Route path="/forgot" element={<ForgotPasswordSystem />} />
        <Route path="/account" element={<ProfileSettings />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders2" element={<Orders2 />} />
        <Route path="/promotion" element={<Promotionform />} />
        <Route path="/bestsellerform" element={<Bestsellerform1 />} />
        <Route path="/new" element={<NewSection />} />
        <Route path="/face" element={<FaceSection />} />
        <Route path="/eye" element={<EyeSection />} />
        <Route path="/lip" element={<LipSection />} />
        <Route path="/cheek" element={<CheekSection />} />
        <Route path="/best1/:id" element={<Best1 />} />
        <Route path="/best2/:id" element={<Best2 />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/information" element={<Information />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/promotions" element={<AdminPromotions />} />
        <Route path="/admin/price-ranges" element={<AdminPriceRange />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
