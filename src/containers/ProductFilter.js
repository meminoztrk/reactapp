import React, { useState, useEffect } from 'react'
import { Collapse, Input, Button, Checkbox, Radio, Space, Rate } from 'antd'
import { useLocation } from 'react-router-dom';
import CustomTreeNode from './../hooks/CustomTreeNode';
const { Panel } = Collapse;
const { Search } = Input;

const ProductFilter = (props) => {
    const [value, setValue] = useState(0);
    const [search, setSearch] = useState("");
    const [price, setPrice] = useState({ min: null, max: null });
    const [checkBoxes, setCheckBoxes] = useState({ brands: [], ratings: [], colors: [], status: [] });
    const location = useLocation();

    const onChangeBox = (e, i, field) => {
        let checkBoxCurrentState = checkBoxes[field];
        checkBoxCurrentState[i] = !checkBoxCurrentState[i];
        setCheckBoxes({
            ...checkBoxes,
            [field]: checkBoxCurrentState
        });
    };

    useEffect(() => {
        setValue(0);
        setSearch("");
        setPrice({ min: null, max: null });
        // let resetBrands = new Array(props.features.brands.length).fill(false);
        setCheckBoxes({
            brands: [false, false, false, false, false],
            ratings: [false, false, false, false, false],
            colors: [false, false],
            status: [false, false],
        });
    }, [location.pathname])

    const onSearch = (value) => console.log(value);


    return (
        <div className='w-1/5 bg-white rounded-md py-2 border-gray-300 border-opacity-100 border-x-2 border-y shadow divide-y-2'>
            <Collapse bordered={false} className="bg-white font-medium gap-y-5 pb-12 site-collapse-custom-collapse" expandIconPosition="right" defaultActiveKey={['1', '2', '3', '4', '5', '6', '7', "a0","a1","a2","a3"]}>
                <Panel header="Kategoriler" key="1">
                    <div className='text-xs font-light pb-4'>
                        <CustomTreeNode treeData={props.features.treeData} />
                    </div>
                </Panel>

                {props.features.brands !== undefined ?
                    <Panel header="Markalar" key="2">
                        <Space direction="vertical" className='font-light pl-1 pb-4'>
                            {props.features.brands.map((item, index) => (
                                <Checkbox
                                    checked={checkBoxes.brands[index] ? true : false}
                                    onChange={e => onChangeBox(e, index, 'brands')}
                                    key={index}
                                    className='text-xs'>
                                    {item}
                                </Checkbox>
                            ))}
                        </Space>
                    </Panel> : null}


                <Panel header="Seçili Kriterlerde Ara" key="3">
                    <div className='text-xs pb-4'>
                        <Search placeholder="Ara" size='medium' allowClear value={search} onChange={(e) => setSearch(e.target.value)} onSearch={onSearch} className='w-full my-2' />
                    </div>

                </Panel>

                <Panel header="Fiyat" key="4">
                    <div className='text-xs relative'>
                        <div>
                            <Input type="number" value={price.min} onChange={(e) => setPrice({ ...price, min: e.target.value })} style={{ width: 95, textAlign: 'center', borderRadius: 0 }} size="medium" placeholder="En az" />
                            <Input className="site-input-split" style={{ width: 30, borderLeft: 0, borderRight: 0, pointerEvents: 'none', borderRadius: 0 }} placeholder="-" size="medium" disabled />
                            <Input type="number" value={price.max} onChange={(e) => setPrice({ ...price, max: e.target.value })} className="site-input-right" size="medium" style={{ width: 95, textAlign: 'center', borderRadius: 0 }} placeholder="En çok" />
                            <Button size='medium' className='bg-orange-500 border-0 rounded-none rounded-r-md' type="primary">{">"}</Button>
                        </div>
                        <Radio.Group className='font-light pt-2 pl-1 pb-4' value={value}>
                            <Space direction="vertical">
                                <Radio value={1} onClick={() => setValue(1)} className="text-xs">750 TL Altında</Radio>
                                <Radio value={2} onClick={() => setValue(2)} className="text-xs">750 - 1000 TL</Radio>
                                <Radio value={4} onClick={() => setValue(4)} className="text-xs">1000 - 1500 TL</Radio>
                                <Radio value={5} onClick={() => setValue(5)} className="text-xs">1500 - 2000 TL</Radio>
                                <Radio value={6} onClick={() => setValue(6)} className="text-xs">2000 - 3000 TL</Radio>
                                <Radio value={7} onClick={() => setValue(7)} className="text-xs">3000 - 4000 TL</Radio>
                                <Radio value={8} onClick={() => setValue(8)} className="text-xs">4000 - 5000 TL</Radio>
                                <Radio value={9} onClick={() => setValue(9)} className="text-xs">5000 TL üzerinde</Radio>
                            </Space>
                        </Radio.Group>
                    </div>
                </Panel>

                <Panel header="Ürün Puanı" key="5">
                    <Space direction="vertical" className='font-light pl-1 pb-4'>
                        {[5, 4, 3, 2, 1].map((item, index) => (
                            <Checkbox
                                checked={checkBoxes.ratings[index] ? true : false}
                                onChange={e => onChangeBox(e, index, 'ratings')}
                                key={index}
                                value={item}
                                className='text-xs'>
                                <Rate disabled defaultValue={item} className="text-sm text-orange-400" />
                            </Checkbox>
                        ))}
                    </Space>
                </Panel>


                {typeof props.features.values != "function" && props.features.values != null ?
                    props.features.values.map((x, i) => (
                        <Panel header={x.name} key={"a"+i}>
                            <Space direction="vertical" className='font-light pl-1 pb-4'>
                                {x.values.map((item, index) => (
                                    <Checkbox
                                        // checked={checkBoxes.colors[index] ? true : false}
                                        // onChange={e => onChangeBox(e, index, 'colors')}
                                        key={index}
                                        className='text-xs'>
                                        {item}
                                    </Checkbox>
                                ))}
                            </Space>
                        </Panel>
                    ))
                    : null}


                {props.features.colors !== undefined ?
                    <Panel header="Renk" key="6">
                        <Space direction="vertical" className='font-light pl-1 pb-4'>
                            {props.features.colors.map((item, index) => (
                                <Checkbox
                                    checked={checkBoxes.colors[index] ? true : false}
                                    onChange={e => onChangeBox(e, index, 'colors')}
                                    key={index}
                                    className='text-xs'>
                                    {item}
                                </Checkbox>
                            ))}
                        </Space>
                    </Panel> : null}



                <Panel header="Durumu" key="7">

                    <Space direction="vertical" className='font-light pl-1'>
                        {["Sıfır", "İkinci El"].map((item, index) => (
                            <Checkbox
                                checked={checkBoxes.status[index] ? true : false}
                                onChange={e => onChangeBox(e, index, 'status')}
                                key={index}
                                value={index}
                                className='text-xs'>
                                {item}
                            </Checkbox>
                        ))}
                    </Space>


                </Panel>
            </Collapse>
        </div>
    )
}

export default ProductFilter
