import React, { useState, useEffect } from 'react'
import { Row, Col, Spin } from 'antd';
import { useSelector } from 'react-redux';


const UserOrders = () => {
  const [order, setOrder] = useState({ data: [], loading: false })
  const user = useSelector(state => state.user.user);

  const getOrders = async () => {
    setOrder({ ...order, loading: true });
    setTimeout(() => {
      fetch(process.env.REACT_APP_API + "/Orders/GetPendingOrderWithDetailByUserId?id=" + user.id, {
        method: 'GET',
        headers: {
          'ApiKey': process.env.REACT_APP_API_KEY,
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          setOrder({
            loading: false,
            data: data.data,
          });
          console.log(data.data)
        });
    }, 200);
  }

  useEffect(() => {
    user.id && getOrders()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const dateFormat = (date) => {
    var dt = new Date(date);
    return dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate()
      + "/" + (dt.getMonth() < 10 ? "0" + dt.getMonth() : dt.getMonth())
      + "/" + dt.getFullYear() + " " + (dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours()) + ":"
      + (dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes())
  }

  return (
    <div>
      <Row className='pt-2 text-lg flex items-center'>
        Siparişlerim
      </Row>
      <Spin spinning={order.loading}>
        {order.data.length > 0 ? order.data.map((item, index) => (
          <div key={index} className='mt-8 rounded bg-white border-gray-300 border-opacity-100 border divide-y'>
            <Row className='py-4 px-4 flex items-center bg-gray-100'>
              <Col span={5}>
                <p className='text-xs font-semibold text-gray-500'>Sipariş Tarihi</p>
                <p className='text-xs'>{dateFormat(item.createdDate)}</p>
              </Col>
              <Col span={5}>
                <p className='text-xs font-semibold text-gray-500'>Sipariş Özeti</p>
                <p className='text-xs'>{item.orderDetail.length} Ürün</p>
              </Col>
              <Col span={5}>
                <p className='text-xs font-semibold text-gray-500'>Alıcı</p>
                <p className='text-xs'>{item.user.name + " " + item.user.surname}</p>
              </Col>
              <Col span={5}>
                <p className='text-xs font-semibold text-gray-500'>Tutar</p>
                <p className='text-xs font-medium text-orange-500'>{item.total.toFixed(2).toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')} TL</p>
              </Col>
              <Col span={4} className="flex justify-center text-center">
                <button className='font-medium px-4 text-xs flex bg-orange-500 hover:bg-orange-700 text-white rounded-lg p-2 text-center'>
                  Sipariş Detayı
                </button>
              </Col>
            </Row>
            {item.orderDetail.map((detail, i) => (
              <Row key={i} className='py-4 px-8 flex items-center'>
                <Col span={6}>
                  <p className='text-xs font-semibold text-orange-500'>{item.status}</p>
                </Col>
                <Col span={6} className="flex items-center justify-center space-x-4">
                  <p className='text-xs font-semibold text-gray-500'>{detail.quantity}x</p>
                  <div className="p-2 border rounded-lg">
                    <img className='w-20' src={detail.path} alt={detail.productName} ></img>
                  </div>
                </Col>
              </Row>
            ))}

          </div>
        ))
          :
          <div>{order.loading === false && "Sipariş Bulunamadı."}</div>}
      </Spin>
    </div>
  )
}

export default UserOrders;
