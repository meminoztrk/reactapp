import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Breadcrumb, Tabs, Rate, BackTop } from 'antd';
import { BsTruck, BsFillCartFill } from 'react-icons/bs';
import Slider from "react-slick";
const { TabPane } = Tabs;

const settings = {
  arrows: false,
  dots: true,
  centerMode: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
};

const ProductDetails = () => {
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [color, setColor] = useState(0);
  const { id } = useParams();

  const getProduct = async (productId) => {
    await fetch(process.env.REACT_APP_API + "/Products/GetSingleProduct?id=" + productId, {
      method: 'GET',
      headers: {
        'ApiKey': process.env.REACT_APP_API_KEY,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        setProduct(data.data);
        setBreadcrumb(data.data.navigation);
        setPrice(data.data.features[0].fePrice);
        console.log(data.data)
      })
  }


  useEffect(() => {
    if (id && id !== "") getProduct(id);
  }, [id]);

  const toggleActiveColor = (index) => {
    if (color === index) { return "border-orange-400 text-orange-500" } else { return "border-gray-400 text-gray-500" }
  }

  const changeQuantity = (status) => {
    if (status === "increase") {
      setQuantity(quantity + 1)
    } else {
      quantity !== 1 && setQuantity(quantity - 1)
    }
  }

  return (
    <div className='md:container mx-auto py-4'>
      <BackTop />
      <Breadcrumb className='text-xs ml-2' separator=">">
        <Breadcrumb.Item href="#">Ana Sayfa</Breadcrumb.Item>
        {breadcrumb.map((item, index) => {
          return (breadcrumb.length - 1 !== index ?
            <Breadcrumb.Item key={index}><Link to={item.path}>{item.name}</Link></Breadcrumb.Item> : <Breadcrumb.Item key={index}>{item.name}</Breadcrumb.Item>)
        })}
      </Breadcrumb>
      <div className='flex flex-col py-4 justify-between space-y-4 h-full'>

        <div className='w-full bg-white rounded-md p-6 border-gray-300 border-opacity-100 border-x-2 border-y shadow'>
          <div className="flex pb-10">
            <div className="w-1/2 h-[30rem] p-2 sc">
              <Slider className='cursor-pointer border-opacity-100 border shadow-xs rounded-md flex justify-center' {...settings}>
                {product.pictures && product.pictures.map((x, index) => (
                  <div key={index}><img className='object-contain h-[30rem] w-[36rem] pb-12 pt-6' src={x} alt='banner1' /></div>
                ))}

              </Slider>
            </div>
            <div className="w-1/2 p-2 h-full">

              <div className='flex'>
                <span className='block bg-red-700 py-1 px-4 text-md rounded-3xl text-white'>Süper Fiyat</span>
              </div>

              <span className="text-xs font-light block pt-2">{product.brand}</span>
              <h1 className="text-lg">{product.name}</h1>




              <div className="flex pt-2">
                <Rate disabled defaultValue={5} className="text-sm text-orange-400" /><span className="pt-[2.5px] pl-2 text-orange-300 text-xs">0 (0 Değerlendirme)</span>
              </div>

              <div className="mt-4 flex flex-col bg-gray-200 p-4 rounded-lg">
                <span className="text-4xl font-light">{price.toFixed(2).toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')} ₺</span>
                <div className="text-xs text-gray-500 flex items-center mt-2 font-light">
                  <BsTruck className="text-green-700" size={18} />
                  <span className="block pl-2 font-semibold">Ücretsiz 2-3 gün içinde kargo</span>
                </div>
              </div>

              <div className="mt-6"><hr /></div>

              <div className="mt-2 p-2">
                <span className="text-xs text-gray-400 font-medium">Renk Seçiniz</span>
                <div className="flex mt-2 space-x-4">
                  {product.features && product.features.map((x, index) => (
                    <span key={index} className={(toggleActiveColor(index)) + 'block border-2 text-md rounded-lg px-4 py-2 cursor-pointer'} onClick={() => {setColor(index);setPrice(x.fePrice)}}>{x.color}</span>
                  ))}
                </div>
              </div>

              <div className="mt-6"><hr /></div>

              <div className="mt-6 p-2 flex items-center">
                <button onClick={() => changeQuantity("decrease")} className="text-2xl text-orange-400 font-medium py-2 px-4 border rounded-l-lg cursor-pointer hover:text-white hover:bg-orange-500">-</button>

                <div className="flex flex-col text-center border-y py-[5.5px]">
                  <input type="number" readOnly value={quantity} className="w-12 text-center outline-none appearance-none"></input>
                  <span className="text-xs text-gray-400">Adet</span>
                </div>

                <button onClick={() => changeQuantity("increase")} className="text-2xl text-orange-400 font-medium py-2 px-4 border rounded-r-lg cursor-pointer hover:text-white hover:bg-orange-500">+</button>

                <button onClick={() => null} className="text-md ml-4 flex items-center font-medium py-[14px] px-10 border rounded-lg cursor-pointer text-white bg-orange-500 hover:bg-orange-600">
                  <BsFillCartFill className="mr-2" size={20} />Sepete Ekle
                </button>

              </div>



            </div>
          </div>
        </div>

        <div className='w-full bg-white rounded-md p-6 border-gray-300 border-opacity-100 border-x-2 border-y shadow'>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Ürün Açıklaması" key="1">
            <div className="flex justify-center" dangerouslySetInnerHTML={{ __html: product.description }} />
            </TabPane>
            <TabPane tab="Ürün Özellikleri" key="2">
              Tab 2
            </TabPane>
            <TabPane tab="Ürün Yorumları" key="3">
              Tab 3
            </TabPane>
          </Tabs>
        </div>
      </div>

    </div>
  );
};

export default ProductDetails;
