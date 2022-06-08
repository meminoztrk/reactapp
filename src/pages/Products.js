import React, { useEffect, useState } from 'react'
import ProductFilter from '../containers/ProductFilter'
import ProductList from '../containers/ProductList'
import { useLocation, Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';

let allProducts = [];
const Products = () => {
  const location = useLocation();
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [products, setProducts] = useState([]);
  const [productNav, setProductNav] = useState([]);
  const [features, setFeatures] = useState([]);
  const [filter, setFilter] = useState({});

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
        // console.log(data.data);
        setBreadcrumb(data.data.navigation);
        setProducts(data.data.products);
        allProducts = data.data.products;
        setProductNav(data.data.productNav)
        setFeatures(data.data.productFeatures);
      })
  }

  const pFilters = (filt, value, isSearch, isPrice) => {
    let newItem = { ...filter };

    if(isSearch){
      if(value.length > 0){
        setFilter({...filter, search: value})
      }
      else{
        delete newItem[filt]
        setFilter(newItem)
      }
    }
    else if(isPrice){
      if(value != null){
        setFilter({...filter, price: value})
      }else{
        delete newItem[filt]
        setFilter(newItem)
      }
      
    }
    else{
      if (filter[filt] === undefined) {
        setFilter({ ...filter, [filt]: [value] })
      }
      else {
        newItem[filt].includes(value) ? newItem[filt].splice(newItem[filt].indexOf(value), 1) : newItem[filt].push(value);
        newItem[filt].length < 1 && delete newItem[filt];
        setFilter(newItem)
      }
    }
    
  };

  useEffect(() => {
    let lastdata = [];

    console.log(filter)
    lastdata = lastdata.concat(allProducts.filter(x =>
      (!filter.brand || filter.brand.length < 1 || filter.brand.includes(x.brand)) &&
      (!filter.color || filter.color.length < 1 || filter.color.includes(x.color)) &&
      (!filter.status || filter.status.length < 1 || filter.status.includes(x.status)) &&
      (!filter.price || (x.price > filter.price.min && x.price < filter.price.max)) &&
      (!filter.search || filter.search.length < 1 || x.name.toLowerCase().includes(filter.search.toLowerCase())) 
    ));

    setProducts(Object.keys(filter).length < 1 ? allProducts : lastdata);
    setProductNav({categoryName: productNav.categoryName,   productCount: lastdata.length});  
  }, [filter]);

  // useEffect(() => {
  //   let lastdata = [];
  //   for (var key in filter) {
  //     filter[key].map(item => {
  //       lastdata = lastdata.concat(allProducts.filter(x => x[key] === item))
  //     })
  //   }
  //   console.log(lastdata, allProducts);
  //   setProducts(lastdata);
  // }, [filter]);


  useEffect(() => {
    let categories = location.pathname.split('/')
    categories.splice(0, 1); categories.splice(0, 1);
    getAllData(categories);
    setFilter({})
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
        <ProductFilter features={features} filter={pFilters} />
        <ProductList products={products} nav={productNav} />
      </div>

    </div>
  )
}

export default Products
