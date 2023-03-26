import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Complains from './Complains';
import AdminLogin from './Adminlogin';
// import Navbar from './Navbar';
import Products from './Products';
import Editproduct from './Editproduct';
import Addproduct from './Addproduct';
import Home from './components/Home';
import "aos/dist/aos.css";
import AOS from "aos";
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Otp from './components/OTP';
function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);
  return (
    <>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        {/* <Navbar /> */}
        <Routes>
          <Route exact path="/adminlogin" element={<AdminLogin />} />
          <Route exact path="/" element={<Home />} />
          <Route exact path="/otp" element={<Otp />} />
          <Route exact path="/addproduct" element={<Addproduct />} />
          <Route exact path="/complain" element={<Complains />} />
          <Route exact path="/login" element={<AdminLogin />} />
          <Route exact path="/products" element={<Products />} />
          <Route exact path="/editproduct" element={<Editproduct />} />
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </>
  );
}

export default App;