import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { deleteToCart, GetCart, increaseQuantity, decreaseQuantity } from '../stores/user';
import { Row, Col, Spin } from 'antd';


const Basket = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state.user.user);
  const cart = useSelector(state => state.user.cart);

  const removeCart = async (userId, productFeatureId) => {
    setLoading(true);
    await fetch(process.env.REACT_APP_API + '/Products/DeleteCart?userId=' + userId + '&productFeatureId=' + productFeatureId, {
      method: 'DELETE',
      headers: {
        'ApiKey': process.env.REACT_APP_API_KEY,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
    }).then(response => {
      dispatch(GetCart(userId))
      setLoading(false);
    }).catch(error => {
      console.log(error)
      setLoading(false);
    });
  }

  const setQuantity = async (userId, productFeatureId, method) => {
    setLoading(true);
    await fetch(process.env.REACT_APP_API + '/Products/SetCartQuantity?userId=' + userId + '&productFeatureId=' + productFeatureId + '&method=' + method, {
      method: 'PUT',
      headers: {
        'ApiKey': process.env.REACT_APP_API_KEY,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
    }).then(response => {
      dispatch(GetCart(userId))
      setLoading(false)
    }).catch(error => {
      console.log(error)
      setLoading(false)
    });
  }

  const setSessionQuantity = async (productFeatureId, method) => {
    setLoading(true);
    var getSessionCart = JSON.parse(sessionStorage.getItem("userCart"));
    if (getSessionCart !== null && getSessionCart.find(x => x.id === productFeatureId)) {
      if (method === "increase") {
        getSessionCart.find(x => x.id === productFeatureId).count++
        dispatch(increaseQuantity(productFeatureId))
      } else {
        getSessionCart.find(x => x.id === productFeatureId).count--
        dispatch(decreaseQuantity(productFeatureId))
      }
      sessionStorage.setItem("userCart", JSON.stringify(getSessionCart));
    }
    setLoading(false);
  }

  const deleteCartItem = (id) => {
    if (user.id) {
      removeCart(user.id, id)
    } else {
      const getSessionCart = JSON.parse(sessionStorage.getItem("userCart"));
      const newCart = getSessionCart.filter(x => x.id !== id);
      sessionStorage.setItem("userCart", JSON.stringify(newCart));
      dispatch(deleteToCart(id));
    }
  }

  const sum = () => {
    let sum = 0;
    cart.map(item => sum += item.price * item.count);
    return sum.toFixed(2).toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  return (
    <div className='md:container mx-auto py-4 '>


      <Spin spinning={loading}>
        {cart.length > 0 ?
          <div className='flex py-4 justify-between space-x-4 h-full'>
            <div className='w-[75%] '>
              <div className='rounded py-2 bg-white border-gray-300 border-opacity-100 border-x-2 border-y shadow divide-y'>
                <Row className='p-4 text-lg'>Sepetim ({cart.length} Ürün)</Row>
                {cart.map((item, index) => (
                  <div key={index}>
                    <Row className='text-gray-600 flex items-center py-4'>
                      <Col span={4} className="justify-center flex pr-2">
                        <div className="p-2">
                          <img className='w-20' src={item.image} alt={item.name} ></img>
                        </div>
                      </Col>
                      <Col span={10}>
                        <p className='font-medium'>{item.name} - {item.color}</p>
                        <p className='text-xs text-gray-400'><i className="fas fa-truck text-orange-500 mr-1"></i>Tahmini 2-3 gün içinde kargo</p>
                      </Col>
                      <Col span={4} className="flex items-center">
                        <button {...item.count === 1 && { disabled: true }} onClick={() => user.id ? setQuantity(user.id, item.id, "decrease") : setSessionQuantity(item.id, "decrease")}
                          className="text-lg text-orange-400 font-medium px-2 border rounded-l-lg cursor-pointer hover:text-white hover:bg-orange-500">-</button>

                        <div className="flex flex-col text-center border-y py-[6px]">
                          <input type="number" readOnly value={item.count} className="w-8 text-xs text-center outline-none appearance-none"></input>
                        </div>

                        <button onClick={() => user.id ? setQuantity(user.id, item.id, "increase") : setSessionQuantity(item.id, "increase")}
                          className="text-lg text-orange-400 font-medium px-2 border rounded-r-lg cursor-pointer hover:text-white hover:bg-orange-500">+</button>
                      </Col>
                      <Col span={4}>
                        <p className='text-orange-500'>{(item.price * item.count).toFixed(2).toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')} TL</p>
                      </Col>
                      <Col span={2}>
                        <button onClick={() => deleteCartItem(item.id)} className='right-0 mr-8 bg-gray-100 px-2 py-1 rounded-xl hover:bg-gray-300'><i className='fa fa-trash' /></button>
                      </Col>


                    </Row>
                  </div>

                ))}
                <span className='h-[5vw] block'></span>
              </div>
            </div>
            <div className='w-[25%]'>

              <Link to="/" className='font-medium flex bg-orange-500 hover:bg-orange-700 text-white w-full rounded-lg py-3 text-lg text-center'>
                <p className='flex items-center mx-auto'>Sepeti Onayla <span className='text-3xl pl-2'>{">"}</span></p>
              </Link>

              <div className='rounded bg-white mt-4 border-gray-300 border-opacity-100 border-x-2 border-y shadow p-6'>
                <h1 className='text-lg'>Sipariş Özeti</h1>
                <div className='mt-2 flex justify-between'>
                  <p className='text-gray-600'>Ürünün Toplamı</p>
                  <p className='text-black font-semibold'>{sum()} TL</p>
                </div>
                <div className='flex mb-2 justify-between'>
                  <p className='text-gray-600'>Kargo Toplam</p>
                  <p className='text-black font-semibold'>0 TL</p>
                </div>
                <hr />
                <div className='flex justify-end mt-2'>
                  <p className='text-orange-500 font-semibold text-lg'>{sum()} TL</p>
                </div>
              </div>

              <Link to="/" className='font-medium flex bg-orange-500 hover:bg-orange-700 text-white w-full rounded-lg py-3 mt-8 text-lg text-center'>
                <p className='flex items-center mx-auto'>Sepeti Onayla <span className='text-3xl pl-2'>{">"}</span></p>
              </Link>

            </div>
          </div> :
          <div className=''>
            <Row className='px-10 py-8 justify-between rounded bg-white my-4 text-lg text-orange-500 flex items-center'>
              <div className='flex items-center'>
                <i className="fas fa-shopping-cart bg-orange-50 rounded-full p-4 mr-3"></i>
                <span className='block'>Sepetinizde ürün bulunmamaktadır.</span>
              </div>
              <div className='flex items-center'>
                <Link to="/" className='font-medium bg-orange-500 hover:bg-orange-700 text-white w-full rounded-md ml-1 py-2 px-8 text-center' >
                  Alışverişe Başla
                </Link>
              </div>
            </Row>
          </div>}

        <div className='h-[15vw]'></div>

      </Spin>
    </div>



  );
};
export default Basket;