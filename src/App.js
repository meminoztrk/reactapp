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

function App() {

  const [name, setName] = useState();
  const location = useLocation();
  const origin = location.pathname.split("/")[1];
  useEffect(() => {
    (
      async () => {
        const response = await fetch(process.env.REACT_APP_API+'/User/user', {
          headers: { 
            'ApiKey':process.env.REACT_APP_API_KEY,
            'Content-Type': 'application/json' },
          credentials: 'include',
        });

        const content = await response.json();
        console.log(content)
        setName(content.username);
        console.log("app js tarafında name " + content.username)
      }
    )();
  },[])

  return (
    <div className="font-poppins">


      {origin !== 'admin' ? <Nav name={name} setName={setName} /> : null}
      <Routes>
        <Route path="/" exact element={<Home name={name} setName={setName} />} />
        <Route path="/giris" element={<Login setName={setName} />} />
        <Route path="/kayit" element={<Register />} />
        <Route path="/sepet" element={<Basket />} />
        <Route path="/kategori/*" element={<Products />} />
        <Route path="*" element={<MainNotFound />} />

        <Route path="/admin" element={<AppAdmin />}>
          <Route index element={<Dashboard />} />
          <Route path="/admin/kategoriler" element={<Categories />} />
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
