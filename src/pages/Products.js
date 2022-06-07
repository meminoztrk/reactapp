import React, { useEffect, useState } from 'react'
import ProductFilter from '../containers/ProductFilter'
import ProductList from '../containers/ProductList'
import { useLocation, Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';


const Products = () => {
    const location = useLocation();
    const [breadcrumb, setBreadcrumb] = useState([]);
    const [products, setProducts] = useState([]);
    const [productNav, setProductNav] = useState([]);
    const [features, setFeatures] = useState([]);

    const getAllData = async (loc) => {
        await fetch(process.env.REACT_APP_API + "/Products/GetProductsByCategoryName", {
          method: 'POST',
          body: JSON.stringify(loc),
          headers: {
            'ApiKey': process.env.REACT_APP_API_KEY,
            'Content-Type': 'application/json'
          }
        })
          .then(res => res.json())
          .then(data => {
            console.log(data.data);
            setBreadcrumb(data.data.navigation);
            setProducts(data.data.products);
            setProductNav(data.data.productNav)
            setFeatures(data.data.productFeatures);
          })
      }

    useEffect(() => {
        let categories = location.pathname.split('/')
        categories.splice(0, 1); categories.splice(0, 1);
        console.log(categories);
        getAllData(categories);
    }, [location])

    return (
        <div className='md:container mx-auto py-4'>
            <Breadcrumb className='text-xs' separator=">">
                <Breadcrumb.Item href="#">Ana Sayfa</Breadcrumb.Item>
                {breadcrumb.map((item, index) => {
                    return (breadcrumb.length - 1 !== index ? 
                        <Breadcrumb.Item key={index}><Link to={item.path}>{item.name}</Link></Breadcrumb.Item> : <Breadcrumb.Item key={index}>{item.name}</Breadcrumb.Item>)
                })}
            </Breadcrumb>
            <div className='flex py-4 justify-between space-x-4 h-full'>
                <ProductFilter features={features} />
                <ProductList products={products} nav={productNav} />
            </div>

        </div>
    )
}

export default Products
