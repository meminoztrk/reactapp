import React,{useState,useEffect} from 'react'
import { Collapse, Input, Button, Checkbox, Radio, Space, Rate  } from 'antd'
import { useLocation } from 'react-router-dom';
const { Panel } = Collapse;
const { Search } = Input;

const ProductFilter = () => {
    const [value, setValue] = useState(0);
    const [search, setSearch] = useState("");
    const [price, setPrice] = useState({min:null,max:null});
    const location = useLocation();

    useEffect(() => {
        setValue(0);
        setSearch("");
        setPrice({min:null,max:null});
    }, [location.pathname])

    const onSearch = (value) => console.log(value);

    return (
        <div className='w-1/5 bg-white rounded-md py-2 border-gray-300 border-opacity-100 border-x-2 border-y shadow divide-y-2'>
            <Collapse bordered={false} className="bg-white font-medium gap-y-5 pb-12 site-collapse-custom-collapse" expandIconPosition="right" defaultActiveKey={['1', '2', '3','4','5']}>
                <Panel header="Kategoriler" key="1">
                    <div className='text-xs font-light pb-4'>
                        Elektronik
                    </div>
                </Panel>

                <Panel header="Markalar" key="2">
                    <Checkbox.Group className='font-light pl-1 pb-4'>
                        <Space direction="vertical">
                            <Checkbox className='text-xs'>Samsung</Checkbox>
                            <Checkbox className='text-xs'>Apple</Checkbox>
                            <Checkbox className='text-xs'>Reeder</Checkbox>

                        </Space>
                    </Checkbox.Group>
                </Panel>

                <Panel header="Seçili Kriterlerde Ara" key="3">
                    <div className='text-xs pb-4'>
                        <Search placeholder="Ara" size='medium' allowClear value={search} onChange={(e)=>setSearch(e.target.value)} onSearch={onSearch} className='w-full my-2' />
                    </div>

                </Panel>

                <Panel header="Fiyat" key="4">
                    <div className='text-xs relative'>
                        <div>
                            <Input type="number" value={price.min} onChange={(e)=>setPrice({...price,min:e.target.value})} style={{ width: 95, textAlign: 'center',borderRadius:0 }} size="medium" placeholder="En az" />
                            <Input className="site-input-split" style={{ width: 30, borderLeft: 0, borderRight: 0, pointerEvents: 'none',borderRadius:0 }} placeholder="-" size="medium" disabled />
                            <Input type="number" value={price.max} onChange={(e)=>setPrice({...price,max:e.target.value})} className="site-input-right" size="medium" style={{ width: 95, textAlign: 'center', borderRadius:0 }} placeholder="En çok" />
                            <Button size='medium' className='bg-orange-500 border-0 rounded-none rounded-r-md' type="primary">{">"}</Button>
                        </div>
                        <Radio.Group className='font-light pt-2 pl-1 pb-4' value={value}>
                            <Space direction="vertical">
                                <Radio value={1} onClick={()=>setValue(1)} className="text-xs">750 TL Altında</Radio>
                                <Radio value={2} onClick={()=>setValue(2)} className="text-xs">750 - 1000 TL</Radio>
                                <Radio value={4} onClick={()=>setValue(4)} className="text-xs">1000 - 1500 TL</Radio>
                                <Radio value={5} onClick={()=>setValue(5)} className="text-xs">1500 - 2000 TL</Radio>
                                <Radio value={6} onClick={()=>setValue(6)} className="text-xs">2000 - 3000 TL</Radio>
                                <Radio value={7} onClick={()=>setValue(7)} className="text-xs">3000 - 4000 TL</Radio>
                                <Radio value={8} onClick={()=>setValue(8)} className="text-xs">4000 - 5000 TL</Radio>
                                <Radio value={9} onClick={()=>setValue(9)} className="text-xs">5000 TL üzerinde</Radio>
                            </Space>
                        </Radio.Group>
                    </div>
                </Panel>

                <Panel header="Ürün Puanı" key="5">
                    <Checkbox.Group className='font-light pl-1'  >
                        <Space direction="vertical">
                            <Checkbox value={1} className='text-xs'><Rate disabled defaultValue={5} className="text-sm text-orange-400" /></Checkbox>
                            <Checkbox value={2} className='text-xs'><Rate disabled defaultValue={4} className="text-sm text-orange-400" /></Checkbox>
                            <Checkbox value={3} className='text-xs'><Rate disabled defaultValue={3} className="text-sm text-orange-400" /></Checkbox>
                            <Checkbox value={4} className='text-xs'><Rate disabled defaultValue={2} className="text-sm text-orange-400" /></Checkbox>
                            <Checkbox value={5} className='text-xs'><Rate disabled defaultValue={1} className="text-sm text-orange-400" /></Checkbox>

                        </Space>
                    </Checkbox.Group>

                </Panel>
            </Collapse>
        </div>
    )
}

export default ProductFilter
