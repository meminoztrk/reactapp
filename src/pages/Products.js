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
  const [sort, setSort] = useState("smartSort");

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
        setProducts(data.data.products.sort((a, b) => a.id - b.id));
        allProducts = data.data.products.sort((a, b) => a.id - b.id);
        setProductNav(data.data.productNav)
        setFeatures(data.data.productFeatures);
      })
  }

  const pFilters = (filt, value, isSearch, isPrice) => {
    let newItem = { ...filter };

    if (isSearch) {//arama filtrelemesi
      if (value.length > 0) {
        setFilter({ ...filter, search: value })
      }
      else {
        delete newItem[filt]
        setFilter(newItem)
      }
    }

    else if (isPrice) {//fiyat filtrelemesi
      if (value != null) {
        setFilter({ ...filter, price: value })
      } else {
        delete newItem[filt]
        setFilter(newItem)
      }

    }

    else if (filt === 'features') {//dinamik checkbox filtrelemesi
      if (filter[filt] === undefined) {
        setFilter({ ...filter, [filt]: [{name: value.name, value: [value.val]}] })
      }
      else{
        if(newItem[filt].some(x=>x.name === value.name)){
          var selectedItem = newItem[filt].find(x=>x.name === value.name).value;
          !selectedItem.includes(value.val) ? 
          selectedItem.push(value.val) :
          selectedItem.splice(selectedItem.indexOf(value.val),1)
          selectedItem.length < 1 && newItem[filt].splice(newItem[filt].indexOf(value.name),1);
          newItem[filt].length < 1 && delete newItem[filt]
        }else{
          newItem[filt].push({name: value.name, value: [value.val]})
        }
        setFilter(newItem)
      }
    }

    else {//standart checkbox filtrelemesi
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

    lastdata = lastdata.concat(allProducts.filter(x =>
      (!filter.brand || filter.brand.length < 1 || filter.brand.includes(x.brand)) &&
      (!filter.color || filter.color.length < 1 || filter.color.includes(x.color)) &&
      (!filter.status || filter.status.length < 1 || filter.status.includes(x.status)) &&
      (!filter.price || (x.price > filter.price.min && x.price < filter.price.max)) &&
      (!filter.search || filter.search.length < 1 || x.name.toLowerCase().includes(filter.search.toLowerCase())) &&
      (!filter.features || filter.features.length < 1 || x.features.some(n => filter.features.some(m => m.name === n.name && m.value.some(v => n.value.includes(v)))))
    ));

    var sentData = Object.keys(filter).length < 1 ? allProducts : lastdata;
    if (sort === "maxToMin") {
      sentData.sort((a, b) => b.price - a.price);
    }
    else if (sort === "minToMax") {
      sentData.sort((a, b) => a.price - b.price);
    } 
    else if (sort === "smartSort") {
      sentData.sort((a, b) => a.id - b.id);
    }

    setProducts(sentData);
    setProductNav({ ...productNav, productCount: lastdata.length });
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const sortBy = (opt) => {
    setSort(opt);
    if (opt === "maxToMin") {
      setProducts(products.sort((a, b) => b.price - a.price));
    }
    else if (opt === "minToMax") {
      setProducts(products.sort((a, b) => a.price - b.price));
    } 
    else if (opt === "smartSort") {
      setProducts(products.sort((a, b) => a.id - b.id));
    }
  }

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
        <ProductFilter features={features} filter={pFilters}/>
        <ProductList products={products} sort={sortBy}  nav={productNav} />
      </div>

    </div>
  )
}

export default Products
