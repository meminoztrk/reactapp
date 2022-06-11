// import logo from './logo.svg';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Nav from './components/Nav';
import { Routes, Route, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { User } from './stores/user';



function App() {

  const location = useLocation();
  const dispatch = useDispatch();
  const origin = location.pathname.split("/")[1];

  useEffect(() => {
    dispatch(User());
  }, [])

  return (
    <div className="font-poppins">


      {origin !== 'admin' ? <Nav /> : null}
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/giris" element={<Login />} />
        <Route path="/kayit" element={<Register />} />
        <Route path="/sepet" element={<Basket />} />
        <Route path="/kategori/*" element={<Products />} />
        <Route path="/urunler/:category/:name/:id" element={<ProductDetails />} />
        <Route path="*" element={<MainNotFound />} />

        <Route path="/admin" element={<AppAdmin />}>
          <Route index element={<Dashboard />} />
          <Route path="/admin/kategoriler" element={<Categories />} />
          <Route path='/admin/kategori-ozellik' element={<CatFeature />} />
          <Route path="/admin/markalar" element={<Brand />} />
          <Route path="/admin/siparisler" element={<Orders />} />
          <Route path="/admin/urunler" element={<AProducts />} />
          <Route path="/admin/urunler/:id" element={<ProductEdit />} />
          <Route path="/admin/urun-ekle" element={<ProductAdd />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        {/* <Route path="/products" element={<ProductListing />} /> */}
        {/* <Route path="/product/:productId" element={<ProductDetails />} /> */}
      </Routes>
      {origin !== 'admin' ? <Footer /> : null}



    </div>
  );
}

export default App;
