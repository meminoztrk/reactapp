import React from 'react'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useLocation } from "react-router-dom";
import { Link, Routes, Route, useParams } from "react-router-dom";


const Basket = () => {
  const location = useLocation();

  return (
    <div className='md:container mx-auto py-4'>
      <div className='flex py-4 justify-between space-x-4 h-full'>
        <div className='w-4/5  rounded-md py-2 border-gray-300 border-opacity-100 border-x-2 border-y shadow divide-y-2'>
          asd
        </div>
        <div className='w-1/5 rounded-md py-2 border-gray-300 border-opacity-100 border-x-2 border-y shadow divide-y-2'>
          asd
        </div>
      </div>


    </div>
  );
};
export default Basket;