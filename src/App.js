// import logo from './logo.svg';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Nav from './components/Nav';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Footer from './components/Footer';
import Basket from './pages/Basket';

function App() {

  const [name, setName] = useState();

  useEffect(() => {
    (
      async () => {
        const response = await fetch('https://localhost:7168/api/User/user', {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        const content = await response.json();
        console.log(content)
        setName(content.username);
        console.log("app js tarafında name " + content.username)
      }
    )();
  })

  return (
    <div className="App font-poppins">

      <BrowserRouter>
        <Nav name={name} setName={setName} />
        <Routes>
          <Route path="/" exact element={<Home name={name} setName={setName} />} />
          <Route path="/giris" element={<Login setName={setName} />} />
          <Route path="/kayit" element={<Register />} />
          <Route path="/sepet" element={<Basket />} />
        </Routes>

      </BrowserRouter>
      <Footer/>
    </div>
  );
}

export default App;
