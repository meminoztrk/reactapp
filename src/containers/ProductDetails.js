import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Breadcrumb, Tabs, Rate, BackTop,notification } from 'antd';
import { BsTruck, BsFillCartFill } from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import Slider from "react-slick";
import { GetCart,addToCart } from "../stores/user";
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
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({});
  const [selected, setSelected] = useState({ productFeatureId: 0, color: "", price: 0, cdx: 0, quantity: 1 });
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
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
        setSelected({ productFeatureId: data.data.features[0].id, color: data.data.features[0].color, price: data.data.features[0].fePrice, cdx: 0, quantity: 1 });
      })
  }

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

  const addCart = () => {
    setLoading(true)
    const cart = {
      id: selected.productFeatureId,
      name: product.name,
      image: product.pictures[0],
      color: selected.color,
      price: selected.price,
      count: selected.quantity
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
      dispatch(addToCart(cart))
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
    if (id && id !== "") getProduct(id);
  }, [id]);

  const toggleActiveColor = (index) => {
    if (selected.cdx === index) { return "border-orange-400 text-orange-500" } else { return "border-gray-400 text-gray-500" }
  }

  const changeQuantity = (status) => {
    if (status === "increase") {
      setSelected({ ...selected, quantity: selected.quantity + 1 })
    } else {
      selected.quantity !== 1 && setSelected({ ...selected, quantity: selected.quantity - 1 })
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
                <span className="text-4xl font-light">{selected.price.toFixed(2).toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')} ₺</span>
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
                    <span key={index} className={(toggleActiveColor(index)) + 'block border-2 text-md rounded-lg px-4 py-2 cursor-pointer'}
                      onClick={() => { setSelected({ ...selected, productFeatureId: x.id, cdx: index, color: x.color, price: x.fePrice }) }}>{x.color}</span>
                  ))}
                </div>
              </div>

              <div className="mt-6"><hr /></div>

              <div className="mt-6 p-2 flex items-center">
                <button onClick={() => changeQuantity("decrease")} className="text-2xl text-orange-400 font-medium py-2 px-4 border rounded-l-lg cursor-pointer hover:text-white hover:bg-orange-500">-</button>

                <div className="flex flex-col text-center border-y py-[5.5px]">
                  <input type="number" readOnly value={selected.quantity} className="w-12 text-center outline-none appearance-none"></input>
                  <span className="text-xs text-gray-400">Adet</span>
                </div>

                <button onClick={() => changeQuantity("increase")} className="text-2xl text-orange-400 font-medium py-2 px-4 border rounded-r-lg cursor-pointer hover:text-white hover:bg-orange-500">+</button>

                <button {...loading && {disabled:true}} onClick={() => addCart()} className="text-md ml-4 flex items-center font-medium py-[14px] px-10 border rounded-lg cursor-pointer text-white bg-orange-500 hover:bg-orange-600">
                {loading ? (<svg role="status" className="inline mr-2 w-6 h-6 text-gray-200 animate-spin dark:text-gray-500 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>) : <BsFillCartFill className="mr-2" size={20} />}
                Sepete Ekle
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
