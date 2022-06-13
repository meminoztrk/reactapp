import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import colourStyles from '../hooks/selectColourStyles'
import { useLocation, Link } from 'react-router-dom';
import { Rating } from '@mui/material';
import { Empty, Spin, notification } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import UseSeoHelper from './../hooks/useSeoHelper';
import { addToCart, GetCart } from '../stores/user';

const options = [
    { value: 'smartSort', label: 'Akıllı Sıralama' },
    { value: 'maxToMin', label: 'Fiyata Göre (Önce En Yüksek)' },
    { value: 'minToMax', label: 'Fiyata Göre (Önce En Düşük)' },
    { value: '3', label: 'En Yüksek Puanlılar', isDisabled: true },
    { value: '4', label: 'En Çok Değerlendirilenler', isDisabled: true },
    { value: '5', label: 'En Çok Satanlar', isDisabled: true },
]


const ProductList = (props) => {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [region, setRegion] = useState(options[0]);
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch()

    const addCartToDB = async (userId, scart) => {
        await fetch(process.env.REACT_APP_API + '/Products/AddCart', {
            method: 'POST',
            headers: {
                'ApiKey': process.env.REACT_APP_API_KEY,
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                userid: userId,
                cart: scart
            })
        }).then(response => {
            dispatch(GetCart(user.id));
        });
    }

    const addCart = (id, name, image, price, count, color) => {
        setLoading(true)
        const cart = {
            id: id,
            name: name,
            image: image,
            color: color,
            price: price,
            count: count
        }
        if (user.id) {
            addCartToDB(user.id, cart)
        } else {
            var getSessionCart = JSON.parse(sessionStorage.getItem("userCart"));

            if (getSessionCart !== null) {
                getSessionCart.find(x => x.id === id) ? getSessionCart.find(x => x.id === id).count++ : getSessionCart.push(cart);
                sessionStorage.setItem("userCart", JSON.stringify(getSessionCart));
            } else {
                sessionStorage.setItem("userCart", JSON.stringify([cart]));
            }
        }

        setTimeout(() => {
            setLoading(false)
            openNotificationWithIcon('success')
        }, 500);

        return cart;
    }

    const openNotificationWithIcon = (type) => {
        notification[type]({
            message: <p className='font-semibold'>Sepet</p>,
            description: <p className='font-semibold text-base text-green-500'>Ürün sepete eklendi.</p>,
            placement: 'bottomRight',
        });
    };

    useEffect(() => {
        setRegion(options[0])
    }, [location.pathname])


    const product = (image, name, price, id, fid, brand, color) => (<div className='group xl:w-1/4 lg:w-1/3 w-1/2 p-2 h-[33rem] relative'>
        <Link className='hover:text-black' to={"/urunler/" + UseSeoHelper(props.nav.categoryName ? props.nav.categoryName : "kategori") + "/" + UseSeoHelper(name) + "/" + id}>
            <div className='flex flex-col bg-white rounded-md border h-full group-hover:shadow-lg group-hover:drop-shadow-xl group-hover:border-gray-50 cursor-pointer p-2'>
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
                        <span className='text-2xl font-medium'>{price.toFixed(2).toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')} TL</span>
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

                </div>
            </div>
        </Link>
        <div className='hidden group-hover:block px-2'>
            <button {...loading ? { disabled: true } : { disabled: false }} onClick={() => dispatch(addToCart(addCart(fid, name, image, price, 1, color)))} 
            className='bg-orange-500 ease-out hover:bg-orange-700 mb-6 ml-1 text-sm absolute bottom-0 w-[calc(100%-40px)] rounded-md text-white py-2 px-4'>
                {loading ? (<svg role="status" className="inline mr-2 w-6 h-6 text-gray-200 animate-spin dark:text-gray-500 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>) : "Sepete Ekle"}
            </button>
        </div>
    </div>)

    return (
        <div className='w-4/5 bg-white rounded-md p-6 border-gray-300 border-opacity-100 border-x-2 border-y shadow'>
            <Spin spinning={props.loading}>
                <div className='flex justify-between items-center'>
                    <div className='p-2'>
                        <span className='text-sm font-light'><b className='font-semibold'>{props.nav.categoryName}</b> kategorisinde <b className='font-semibold'>{props.nav.productCount}</b> adet ürün bulundu.</span>
                    </div>

                    <div className='w-60 text-sm'>
                        <Select onChange={(e) => { setRegion(e); props.sort(e.value) }} styles={colourStyles} value={region} defaultValue={options[0]} options={options} isSearchable={false} noOptionsMessage={() => 'Seçenek bulunamadı'} />
                    </div>
                </div>
                <div className='flex flex-wrap mt-4'>

                    {props.products.length > 0 ?
                        props.products.map((x, index) => (
                            <React.Fragment key={index}>{product(x.image, x.name, x.price, x.id, x.productFeatureId, x.brand , x.color)}</React.Fragment>
                        ))
                        :
                        <Empty className='mx-auto scale-125' image={Empty.PRESENTED_IMAGE_SIMPLE} description={"Ürün bulunamadı"} />}
                </div>
            </Spin>
        </div>
    )
}

export default ProductList
