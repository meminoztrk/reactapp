import React from 'react'
// import { Link, Routes, Route, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { deleteToCart, GetCart } from '../stores/user';
import { Row,Col } from 'antd';


const Basket = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const cart = useSelector(state => state.user.cart);

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

  return (
    <div className='md:container mx-auto py-4'>
      <div className='flex py-4 justify-between space-x-4 h-full'>
        <div className='w-4/5  rounded-md py-2 bg-white border-gray-300 border-opacity-100 border-x-2 border-y shadow divide-y-2 p-4'>
            <Row>TEST</Row>
          {cart.length > 0 ? cart.map((item, index) =>
            <Row key={index} className='text-gray-600 flex items-start pt-2 relative'>
              <Col span={6} className="justify-center flex pr-2">
                <div className="border rounded-lg shadow p-1">
                  <img className='w-20' src={item.image} ></img>
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
        <div className='w-1/5 rounded-md py-2 border-gray-300 border-opacity-100 border-x-2 border-y shadow divide-y-2 p-4'>
          asd
        </div>
      </div>


    </div>
  );
};
export default Basket;