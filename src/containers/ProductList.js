import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import colourStyles from '../hooks/selectColourStyles'
import { useLocation } from 'react-router-dom';
import { Rating } from '@mui/material';
import { Empty } from 'antd';

const options = [
    { value: 'chocolate', label: 'Akıllı Sıralama' },
    { value: 'strawberry', label: 'Fiyata Göre (Önce En Yüksek)' },
    { value: 'vanilla', label: 'Fiyata Göre (Önce En Düşük)' },
    { value: '3', label: 'En Yüksek Puanlılar' },
    { value: '4', label: 'En Çok Değerlendirilenler' },
    { value: '5', label: 'En Çok Satanlar' },
]


const ProductList = (props) => {
    const location = useLocation();
    // const [value, setValue] = useState("");

    const [region, setRegion] = useState(options[0]);

    useEffect(() => {
        setRegion(options[0])
    }, [location.pathname])


    const product = (image, name, price, id, brand) => (<div className='xl:w-1/4 lg:w-1/3 w-1/2 p-2 h-[33rem] relative'>
        <div className='group flex flex-col bg-white rounded-md border h-full hover:shadow-lg hover:drop-shadow-xl hover:border-gray-50 cursor-pointer p-2'>
            <div className='h-1/2 flex justify-center'>
                <div className='p-2'>
                    <img alt='telefon' className="object-cover h-56" src={image} />
                </div>
            </div>
            <div className='h-1/2 flex flex-col relative'>
                <div className='p-2 text-sm'>
                    <p className='text-xs'>{brand}</p>
                    <span className='font-medium'>{name.length > 60 ? name.substring(0, 60) + "..." : name}</span>
                </div>
                
                <div className='bg-gray-100 w-[calc(100%-10px)] absolute mt-[4.3rem] m-1 rounded-lg py-2 px-4 text-right'>
                    <span className='text-2xl font-medium'>{price.toFixed(2).toString().replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')} TL</span>
                </div>


                <div className='flex mt-[7rem] absolute p-2 flex-col space-y-2 group-hover:hidden'>
                    <div className='flex items-center'>
                        <Rating size='small' name="half-rating-read" defaultValue={4.5} precision={0.5} readOnly />
                        <span className='text-xs pl-1 pt-1'><b>{id}</b> (460)</span>
                    </div>
                    <div className='flex'>
                        <span className='block bg-red-700 py-1 px-2 text-xs rounded-lg text-white'>Süper Fiyat</span>

                    </div>
                </div>
                <div className='hidden group-hover:block'>
                    <button className='bg-orange-500 ease-out hover:bg-orange-700 mb-4 ml-1 text-sm absolute bottom-0 w-[calc(100%-10px)] rounded-md text-white py-2 px-4'>Sepete Ekle</button>
                </div>
            </div>
        </div>
    </div>)

    return (
        <div className='w-4/5 bg-white rounded-md p-6 border-gray-300 border-opacity-100 border-x-2 border-y shadow'>
            <div className='flex justify-between items-center'>
                <div className='p-2'>
                    <span className='text-sm font-light'><b className='font-semibold'>{props.nav.categoryName}</b> kategorisinde <b className='font-semibold'>{props.nav.productCount}</b> adet ürün bulundu.</span>
                </div>

                <div className='w-60 text-sm'>
                    <Select onChange={(e) => { setRegion(e); }} styles={colourStyles} value={region} defaultValue={options[0]} options={options} isSearchable={false} noOptionsMessage={() => 'Seçenek bulunamadı'} />
                </div>
            </div>
            <div className='flex flex-wrap mt-4'>

                {props.products.length > 0 ?
                    props.products.map((x, index) => (
                        <React.Fragment key={index}>{product(x.image, x.name, x.price, x.id, x.brand)}</React.Fragment>
                    ))
                    :
                    <Empty className='mx-auto scale-125' image={Empty.PRESENTED_IMAGE_SIMPLE} description={"Ürün bulunamadı"} />}




            </div>
        </div>
    )
}

export default ProductList
