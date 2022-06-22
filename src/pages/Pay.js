import React, { useEffect, useState } from 'react'
import { useSelector,useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Row, Col, notification } from 'antd';
import Checkbox from '@mui/material/Checkbox';
import { orange } from '@mui/material/colors';
import { GoLocation } from 'react-icons/go';
import axios from 'axios';
import {
  LoadingOutlined,
  WalletOutlined,
  ContainerOutlined
} from '@ant-design/icons';
import { clearCart } from '../stores/user';


export const Pay = () => {
  let navigate = useNavigate();
  const [ploading, setPLoading] = useState(false);
  const user = useSelector(state => state.user.user);
  const cart = useSelector(state => state.user.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      await axios.get(process.env.REACT_APP_API + "/User/user", {
        headers: {
          'ApiKey': process.env.REACT_APP_API_KEY,
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      }).catch((err) => {
        navigate('/giris')
      });
    }
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sum = () => {
    let sum = 0;
    cart.map(item => sum += item.price * item.count);
    return sum.toFixed(2).toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  const payItems = (id) => {
    setPLoading(true);
    setTimeout(() => {
      fetch(process.env.REACT_APP_API + "/Orders?userid=" + id, {
        method: 'POST',
        headers: {
          'ApiKey': process.env.REACT_APP_API_KEY,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          openNotificationWithIcon('success')
          sessionStorage.removeItem("userCart");
          dispatch(clearCart())
          navigate('/hesabim/siparisler')
        }
      })
        .catch(function (err) {
          setPLoading(false);
        });
    }, 200);
  }

  const openNotificationWithIcon = (type) => {
    notification[type]({
        message: <p className='font-semibold'>Sipariş</p>,
        description: <p className='font-semibold text-base text-green-500'>Sipariş başarı ile oluşturuldu.</p>,
        placement: 'bottomRight',
    });
};

  return (
    <div className='md:container mx-auto py-4 '>
      {cart.length > 0 && user.id &&
        <div className='flex py-4 justify-between space-x-3 h-full'>

          <div className='w-[75%] '>
            <div className='rounded py-2 bg-white border-gray-300 border-opacity-100 border-x-2 border-y shadow divide-y'>
              <div className='py-2 px-4 flex items-center space-x-4'>
                <div className='rounded-full flex justify-center items-center h-12 w-12 bg-gray-100'><GoLocation size={25} /></div>
                <span className='font-semibold text-lg'>Adres Ekle</span>
              </div>
              <hr />
            </div>

            <div className='rounded py-2 mt-4 bg-white border-gray-300 border-opacity-100 border-x-2 border-y shadow divide-y'>
              <div className='py-2 px-4 flex items-center space-x-4'>
                <div className='rounded-full flex justify-center items-center h-12 w-12 bg-gray-100'><WalletOutlined className='text-lg' /></div>
                <span className='font-semibold text-lg'>Ödeme Yöntemi</span>
              </div>
              <hr />
            </div>

            <div className='rounded py-2 mt-4 bg-white border-gray-300 border-opacity-100 border-x-2 border-y shadow divide-y'>
              <Row className='py-2 px-4 text-lg flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div className='rounded-full flex justify-center items-center h-12 w-12 bg-gray-100'><ContainerOutlined className='text-lg' /></div>
                  <span className='font-semibold text-lg'>Alışveriş Özeti</span>
                </div>
                <div className='text-sm pr-5'>Toplam {cart.length} Ürün</div>
              </Row>
              {cart.map((item, index) => (
                <div key={index}>
                  <Row className='text-gray-600 flex items-center py-2'>
                    <Col span={4} className="justify-center flex pr-2">
                      <div className="p-2">
                        <img className='w-20' src={item.image} alt={item.name} ></img>
                      </div>
                    </Col>
                    <Col span={13}>
                      <p className='font-medium'>{item.name} - {item.color}</p>
                      <p className='text-xs text-gray-400'><i className="fas fa-truck text-orange-500 mr-1"></i>Tahmini 2-3 gün içinde kargo</p>
                    </Col>
                    <Col span={3} className="flex items-center">
                      {item.count} Adet
                    </Col>
                    <Col span={2}>
                      <p className='text-orange-500'>{(item.price * item.count).toFixed(2).toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')} TL</p>
                    </Col>


                  </Row>
                </div>

              ))}
              <span className='h-[5vw] block'></span>
            </div>
          </div>

          <div className='w-[25%]'>


            <div className='rounded bg-white border-gray-300 border-opacity-100 border-x-2 border-y shadow p-6'>
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
              <div className='flex justify-between items-center mt-2'>
                <p className='text-md font-medium'>Ödenecek Tutar</p>
                <p className='text-orange-500 font-semibold text-lg'>{sum()} TL</p>
              </div>

              <div className='flex items-start mt-3' style={{ fontSize: 10.5 }}>
                <Checkbox sx={{
                  padding: 0,
                  color: orange[500],
                  '&.Mui-checked': {
                    color: orange[600],
                  },
                }} /><span className='px-2 leading-3 mt-1'>Ön bilgilendirme formunu ve Mesafeli satış sözleşmesini kabul ediyorum.</span>
              </div>

              <div style={{ fontSize: 10.5 }}>

                <span className='block py-3 pl-1 leading-3'>
                  Kişisel verilerinizin işlenmesine ilişkin olarak lütfen
                  <span className='text-orange-500 font-semibold'> Gizlilik ve Çerez</span> Politikasını inceleyiniz.
                </span>
              </div>

              <button onClick={() => payItems(user.id)} className='font-medium flex bg-orange-500 hover:bg-orange-700 text-white w-full rounded-lg py-3 mt-8 text-lg text-center'>
                <p className='flex items-center mx-auto'>{ploading ? <LoadingOutlined className='text-xl' /> : "Ödeme Yap"}</p>
              </button>
            </div>



          </div>
        </div>}

      <div className='h-[15vw]'></div>
    </div>
  )
}
