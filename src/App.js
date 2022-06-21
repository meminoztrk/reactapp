// import logo from './logo.svg';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Nav from './components/Nav';
import { Routes, Route, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import Footer from './components/Footer';
import Basket from './pages/Basket';
import Products from './pages/Products';
import AppAdmin from './admin/AppAdmin';
import { NotFound } from './admin/NotFound';
import Dashboard from './admin/Dashboard';
import { MainNotFound } from './pages/MainNotFound';
import Categories from './admin/Categories';
import Brand from './admin/Brand';
import Orders from './admin/Orders';
import CatFeature from './admin/CatFeature';
import ProductAdd from './admin/ProductAdd';
import AProducts from './admin/Products'
import ProductEdit from './admin/ProductEdit';
import ProductDetails from './containers/ProductDetails';
import { useDispatch } from 'react-redux';
import { User } from './stores/user';
import AppAccount from './account/AppAccount';
import UserOrders from './account/UserOrders';
import { UserProfile } from './account/UserProfile';
import { Pay } from './pages/Pay';
import OrdersCompleted from './admin/OrdersCompleted';



function App() {

  const location = useLocation();
  const dispatch = useDispatch();
  const origin = location.pathname.split("/")[1];

  useEffect(() => {
    dispatch(User());
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="font-poppins">
      {origin !== 'admin' ? <Nav /> : null}
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/giris" element={<Login />} />
        <Route path="/kayit" element={<Register />} />
        <Route path="/sepet" element={<Basket />} />
        <Route path="/kategori/*" element={<Products />} />
        <Route path="/odeme" element={<Pay />} />
        <Route path="/urunler/:category/:name/:id" element={<ProductDetails />} />
        <Route path="*" element={<MainNotFound />} />

        <Route path="/hesabim" element={<AppAccount />}>
          <Route index element={<UserOrders />} />
          <Route path="siparisler" element={<UserOrders />} />
          <Route path="profil" element={<UserProfile />} />
        </Route>

        <Route path="/admin" element={<AppAdmin />}>
          <Route index element={<Dashboard />} />
          <Route path="kategoriler" element={<Categories />} />
          <Route path='kategori-ozellik' element={<CatFeature />} />
          <Route path="markalar" element={<Brand />} />
          <Route path="bekleyen-siparisler" element={<Orders />} />
          <Route path="tamamlanan-siparisler" element={<OrdersCompleted />} />
          <Route path="urunler" element={<AProducts />} />
          <Route path="urunler/:id" element={<ProductEdit />} />
          <Route path="urun-ekle" element={<ProductAdd />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      {origin !== 'admin' ? <Footer /> : null}
    </div>
  );
}

export default App;
