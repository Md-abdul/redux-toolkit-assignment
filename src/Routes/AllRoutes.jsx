import React from "react";
import { Route, Routes } from "react-router-dom";
import AddProduct from "../Components/AddProduct";
import Home from "../Components/Home";
import { ToastContainer,  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addproduct" element={<AddProduct />} />

      </Routes>
      <ToastContainer/>
    </>
  );
};

export default AllRoutes;
