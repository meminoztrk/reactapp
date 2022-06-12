import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { getMainCategory, setMenuVisibility } from '../stores/category';
import NavSubCategories from '../containers/NavSubCategories';
import { Popover, Col, Row, Badge } from 'antd';
import { User } from '../stores/user';
import { deleteToCart,clearCart,GetCart } from '../stores/user';


const Nav = (props) => {
    const categories = useSelector(state => state.category.mainCategories);
    const isHidden = useSelector(state => state.category.visibility);
    const [visible, setVisible] = useState(false);
    const user = useSelector(state => state.user.user);
    const cart = useSelector(state => state.user.cart);
    const [menu, setMenu] = useState(<></>);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getMainCategory())
    }, []);

    const removeCart = async (userId,productFeatureId) => {
        await fetch(process.env.REACT_APP_API + '/Products/DeleteCart?userId=' + userId + '&productFeatureId=' + productFeatureId, {
            method: 'DELETE',
            headers: {
                'ApiKey': process.env.REACT_APP_API_KEY,
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        }).then(response => {
            dispatch(GetCart(userId))
        });
    }

    const deleteCartItem = (id) => {
        if (user.id){
            removeCart(user.id,id)
        }else{
            const getSessionCart = JSON.parse(sessionStorage.getItem("userCart"));
            const newCart = getSessionCart.filter(x => x.id !== id);
            sessionStorage.setItem("userCart", JSON.stringify(newCart));
            dispatch(deleteToCart(id));
        }
    }

    const handleVisibleChange = (newVisible) => {
        setVisible(newVisible);
    };

    const toggleActive = (index) => {
        dispatch(setMenuVisibility({ display: "block", actState: index }))
    }
    const toggleActiveStyles = (index) => {
        if (isHidden.actState === index) { return "activeNav pointer-events-none " } else { return "" }
    }

    const logout = async () => {
        await fetch(process.env.REACT_APP_API + '/User/logout', {
            method: 'POST',
            headers: {
                'ApiKey': process.env.REACT_APP_API_KEY,
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        }).then(response => {
            sessionStorage.removeItem("userCart");
            dispatch(clearCart())
            dispatch(User())
        });
    }


    const content = (
        <div className='font-poppins cursor-pointer text-[13px] py-2 pr-2'>
            <p className='text-orange-500'>{user.email}</p><hr />
            <div className='space-y-2 mt-4'>
                <Row className='text-gray-600 hover:text-orange-500 flex items-center'>
                    <Col span={4} className="justify-center flex pr-2"><i className="fas fa-shopping-cart text-xs"></i></Col>
                    <Col span={20}>Siparişlerim</Col>
                </Row>
                <Row className='text-gray-600 hover:text-orange-500 flex items-center' onClick={logout}>
                    <Col span={4} className="justify-center flex pr-2"><i className="fas  fa-sign-out-alt text-xs"></i></Col>
                    <Col span={20}>Çıkış Yap</Col>
                </Row>
            </div>
        </div>
    );

    const cartDesign = (
        <div className='font-poppins text-[13px] w-80 py-2 pr-2'>
            <p className='text-black font-semibold'>Sepetim ({cart.length} Ürün)</p>
            <hr />
            <div className='space-y-2 divide-y'>
                {cart.length > 0 ? cart.map((item, index) =>
                    <Row key={index} className='text-gray-600 flex items-start pt-2'>
                        <Col span={6} className="justify-center flex pr-2">
                            <div className="border rounded-lg shadow p-1">
                                <img src={item.image} ></img>
                            </div>
                        </Col>
                        <Col span={18}>
                            <p className='text-xs font-medium'>{item.name}</p>
                            <p className='text-xs text-gray-400'>Adet: {item.count}</p>
                            <p>{item.price.toFixed(2).toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')} TL</p>
                        </Col>
                        <button onClick={() => deleteCartItem(item.id)} className='absolute right-0 mt-5 mr-8 bg-gray-100 px-2 py-1 rounded-xl hover:bg-gray-300'><i className='fa fa-trash' /></button>
                        <hr />
                    </Row>
                ) : <p className='text-gray-600 text-sm py-4'>Sepetiniz ürün bulunmamaktadır.</p>}
            </div>
            {cart.length > 0 &&
                <div className='mt-4'>
                    <hr />
                    <Row className='text-gray-600 mt-4'>
                        <Col span={12} className="flex justify-center">
                            <Link to="/sepet" className=' bg-gray-200 text-gray-600 w-full rounded-md mr-1 py-2 font-semibold text-center' onClick={() => setVisible(false)} >
                                Sepete Git
                            </Link>
                        </Col>
                        <Col span={12} className="flex justify-center">
                            <Link to="/sepet" className=' bg-orange-500 text-white w-full rounded-md ml-1 py-2 font-semibold text-center' onClick={() => setVisible(false)} >
                                Siparişi Tamamla
                            </Link>
                        </Col>
                    </Row>
                </div>
            }

        </div>
    );


    useEffect(() => {
        checkMenu();
    }, [user, cart, visible])



    const checkMenu = () => {
        if (!user.id) {
            setMenu(
                <ul className="flex space-x-8">
                    <Link to="/giris">
                        <li className="text-center hover:text-orange-500">
                            <i className="fas fa-sign-in-alt text-xl"></i>
                            <p className='text-xs'>Giriş Yap</p>
                        </li>
                    </Link>
                    <Link to="/kayit">
                        <li className="text-center hover:text-orange-500">
                            <i className="fas fa-user-plus text-xl"></i>
                            <p className='text-xs'>Kayıt Ol</p>
                        </li>
                    </Link>
                    <Popover placement="bottomRight" content={cartDesign} visible={visible} onVisibleChange={handleVisibleChange} trigger="hover">
                        <Link to="/sepet">
                            <Badge count={cart.length} size="small" color={"#f97316"}>
                                <li className="text-center hover:text-orange-500">
                                    <i className="fas fa-shopping-cart text-xl"></i>
                                    <p className='text-xs'>Sepetim</p>
                                </li>
                            </Badge>
                        </Link>
                    </Popover>
                </ul>
            )
        } else {
            setMenu(
                <ul className="flex space-x-8">
                    <Popover placement="bottom" content={content} trigger="hover">
                        <Link to="/giris">
                            <li className="text-center hover:text-orange-500">
                                <i className="fas fa-user text-xl"></i>
                                <p className='text-xs'>Hesabım</p>
                            </li>
                        </Link>
                    </Popover>
                    <Link to="/sepet" className="" >
                        <li className="text-center hover:text-orange-500">
                            <i className="fas fa-heart text-xl"></i>
                            <p className='text-xs'>Favorilerim</p>
                        </li>
                    </Link>
                    <Popover placement="bottomRight" content={cartDesign} visible={visible} onVisibleChange={handleVisibleChange} trigger="hover">
                        <Link to="/sepet" className="" >
                            <Badge count={cart.length} size="small" color={"#f97316"}>
                                <li className="text-center hover:text-orange-500">
                                    <i className="fas fa-shopping-cart text-xl"></i>
                                    <p className='text-xs'>Sepetim</p>
                                </li>
                            </Badge>
                        </Link>
                    </Popover>
                </ul>
            )
        }
    }

    // console.log("user nav " + props.name)



    const wrapperRef = useRef([]);
    const wrapperRef2 = useRef([]);
    useOutsideAlerter(wrapperRef, wrapperRef2);

    function useOutsideAlerter(ref, ref2) {
        useEffect(() => {
            /**
             * Alert if clicked on outside of element
             */
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target) && !ref2.current.contains(event.target)) {
                    // setActState(-1);
                    // setIsHidden("hidden")
                    dispatch(setMenuVisibility({ display: "hidden", actState: -1 }));
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    return (
        <div className='bg-gray-100'>
            <nav className='h-40 font-medium container mx-auto px-4'>
                <div className="container mx-auto flex items-center justify-between pt-1">
                    <div className='pl-4'>
                        <i className="fas fa-globe"></i><span className='pl-2 text-gray-400 text-sm'>TR</span>
                    </div>

                    <div className=''>
                        <ul className="flex space-x-8 p-1 pr-6 items-center">
                            <li className="text-center flex items-center hover:cursor-pointer">
                                <p className='text-xs pl-2 font-semibold'>424-00-42</p>
                                <p className='text-xs text-gray-400 pl-2'>Osmangazi</p>
                            </li>
                            <li className="text-center flex items-center">
                                <i className="fas fa-map-marker-alt text-xl"></i>
                                <p className='text-xs pl-2'>Bursa</p>
                            </li>
                            <li className="text-center hover:cursor-pointer">
                                <Link to="/admin"><p className='text-xs'>Kampanyalar</p></Link>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="container mx-auto flex items-end justify-between pt-6">
                    <div>
                        <Link to="/">
                            <img src='https://images.static-thomann.de/pics//images/logos/thomann-cyan-black.svg' className='w-48 pb-2' alt="mylogo" />
                        </Link>
                    </div>
                    <div className='grow pl-8'>
                        <div className="flex justify-center items-center px-4 sm:px-6 lg:px-8">
                            <div className="relative grow"> <input type="text" className="h-12 w-11/12 pl-12 pr-5 rounded-xl z-0 focus:shadow focus:outline-none" placeholder="Ürün, kategori veya marka ara" />
                                <div className="absolute left-4 cursor-pointer" style={{ top: '0.65rem' }}> <i className="fa fa-search text-gray-300 text-xl z-20 hover:text-gray-500"></i> </div>
                            </div>
                        </div>

                    </div>

                    <div className=''>
                        {menu}

                    </div>

                </div>


            </nav>

            <div lang='tr' className='px-2 py-2 md:text-sm text-2xl text-center items-center font-semibold divide-gray-400 uppercase bg-gray-100 border-b-2 border-gray-100 shadow'>
                <div ref={wrapperRef2} className='container mx-auto flex justify-between px-2 text-gray-700 cursor-pointer'>
                    {categories.map((category, index) => (
                        <React.Fragment key={category.id}>
                            <div className={(toggleActiveStyles(category.id)) + "px-2 py-2 group relative cursor-pointer cross"} onClick={() => toggleActive(category.id)}>
                                {category.name}
                            </div>
                            {categories.length - 1 !== index ? <span className='block h-8 border-l border-gray-300'></span> : ''}
                        </React.Fragment>
                    ))}
                </div>
                <div className={(isHidden.display) + ' bg-gradient-to-b from-black/25 to-gray-50/25 mt-3 h-screen w-full absolute left-0 z-50'}>
                    <div ref={wrapperRef} className='container block rounded-b-xl mx-auto w-screen opacity-100 left-0 right-0 group-hover:block bg-gray-100 shadow-2xl'>
                        <NavSubCategories categoryId={isHidden.actState} />
                    </div>
                </div>
            </div>

            {/* <button type="button" className="group hover:cursor-pointer bg-orange-color hover:bg-orange-400 text-white font-semibold py-2 px-4 border-blue-700 hover:border-blue-500 rounded-lg flex mx-auto items-center" disabled>
                <svg className="group-hover:animate-spin hidden group-hover:block -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
            </button>
            <div className="bg-indigo-400 text-center py-4 lg:px-4 mt-2">
                <div className="p-2 bg-indigo-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex" role="alert">
                    <span className="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">New</span>
                    <span className="font-semibold mr-2 text-left flex-auto">Get the coolest t-shirts from our brand new store</span>
                    <svg className="fill-current opacity-75 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" /></svg>
                </div>
            </div>

            <div className="bg-gray-900 shadow rounded-md p-4 max-w-sm w-full mx-auto mt-4">
                <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-gray-700 h-10 w-10"></div>
                    <div className="flex-1 space-y-6 py-1">
                        <div className="h-2 bg-gray-700 rounded"></div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="h-2 bg-gray-700 rounded col-span-2"></div>
                                <div className="h-2 bg-gray-700 rounded col-span-1"></div>
                            </div>
                            <div className="h-2 bg-gray-700 rounded"></div>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default Nav
