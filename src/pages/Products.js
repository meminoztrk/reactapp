import React from 'react'
import ProductFilter from '../containers/ProductFilter'
import ProductList from '../containers/ProductList'
import { useLocation } from 'react-router-dom';



const Products = () => {
    // const location = useLocation();
    // console.log(location.pathname)
    return (
        <div className='md:container mx-auto py-4'>
            <nav className='text-xs text-gray-600'>Ana Sayfa &gt;
                Ev, Bahçe ve Ofis &gt;
                Ev, Dekorasyon, Bahçe &gt;
                Mobilya &gt;
                Salon, Oturma Odası Mobilyaları</nav>
            <div className='flex py-4 justify-between space-x-4 h-full'>
                <ProductFilter />
                <ProductList />
            </div>

        </div>
    )
}

export default Products
