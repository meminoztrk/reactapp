import React, { useState, useEffect } from 'react';
import { setNavigation } from '../stores/admin/navigation';
import { useDispatch } from 'react-redux';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
    Form,
    InputNumber,
    Modal,
    Input,
    Cascader,
    Select,
    Upload,
    Button
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => resolve(reader.result);

        reader.onerror = (error) => reject(error);
    });

const ProductAdd = () => {
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([])
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [inputList, setInputList] = useState([{ color: null, status: null, stock: null, fePrice: null }])
    const dispatch = useDispatch();
    const { Option } = Select;
    const [form] = Form.useForm();

    //#region Navigation
    useEffect(() => {
        dispatch(setNavigation("Ürün Ekle"))
    }, [dispatch])
    //#endregion

    //#region API 
    const getCategories = async () => {
        fetch(process.env.REACT_APP_API + "/Products/GetCategoryWithChild", {
            method: 'GET',
            headers: {
                'ApiKey': process.env.REACT_APP_API_KEY,
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                setCategories(data.data)
            });
    }
    const getBrands = async () => {
        fetch(process.env.REACT_APP_API + "/Brands/GetBrands", {
            method: 'GET',
            headers: {
                'ApiKey': process.env.REACT_APP_API_KEY,
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                setBrands(data.data)
            });
    }
    useEffect(() => {
        getCategories()
        getBrands()
    }, [])
    //#endregion

    //#region Product Images
    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    useEffect(() => {
        console.log(fileList)
    }, [fileList])

    const handleCancel = () => setPreviewVisible(false);

    const handleImagePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleImageChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );
    //#endregion

    //#region Product Feature

    useEffect(() => {
        inputList.map((x, i) =>
            form.setFieldsValue({
                ['status' + (i + 1)]: x.status,
                ['color' + (i + 1)]: x.color,
                ['stock' + (i + 1)]: x.stock,
                ['fePrice' + (i + 1)]: x.fePrice,
            })
        )
    }, [form, inputList])

    const handleInputChange = (val, name, index) => {
        const list = [...inputList];
        list[index][name] = val;
        setInputList(list);
    };
    const handleRemoveClick = index => {
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };
    const handleAddClick = () => {
        setInputList([...inputList, { color: null, status: null, stock: null, fePrice: null }]);
    };

    //#endregion

    return (
        <div>
            <Form
                form={form}
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 20 }}
                autoComplete="off">
                <Form.Item
                    label="Marka"
                    name="brand"
                    rules={[{ required: true, message: 'Lütfen marka seçin!' }]}
                >
                    <Select
                        showSearch
                        className='w-48'
                        placeholder="Marka seçiniz"
                        optionFilterProp="children"
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                    >
                        {brands.map(cat => <Option className='font-poppins' key={cat.id} value={cat.id}>{cat.name}</Option>)}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Ürün Adı"
                    name="name"
                    rules={[{ required: true, message: 'Lütfen ürün adı girin!' }]}
                >
                    <Input placeholder='Ürün adı girin' />
                </Form.Item>
                {inputList.map((x, i) => {
                    return (
                        <Form.Item key={i} label={"Ürün Özelliği " + (i + 1)}>
                            <Input.Group className='md:space-x-4' compact>
                                <Form.Item
                                    name={'status' + (i + 1)}
                                    noStyle
                                    rules={[{ required: true, message: 'Lütfen ürün durumu seçin' }]}
                                >
                                    <Select className='w-40' value={x.status} onChange={e => handleInputChange(e, 'status', i)} placeholder="Durum seçin">
                                        <Option value="0">Sıfır</Option>
                                        <Option value="1">İkinci El</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name={'color' + (i + 1)}
                                    noStyle
                                    rules={[{ required: true, message: 'Lütfen renk girin' }]}
                                >
                                    <Input value={x.color} onChange={e => handleInputChange(e.target.value, 'color', i)} className='md:w-40' placeholder="Renk girin" />
                                </Form.Item>
                                <Form.Item
                                    name={'stock' + (i + 1)}
                                    noStyle
                                    rules={[{ required: true, message: 'Lütfen stok girin' }]}
                                >
                                    <Input value={x.stock} className='md:w-40' onChange={e => handleInputChange(e.target.value, 'stock', i)} placeholder="Stok girin" />
                                </Form.Item>
                                <Form.Item
                                    name={'fePrice' + (i + 1)}
                                    noStyle
                                    rules={[{ required: true, message: 'Lütfen ürün fiyatı girin' }]}
                                >
                                    <InputNumber
                                        className='md:w-40'
                                        placeholder='Fiyat girin'
                                        value={x.fePrice}
                                        onChange={e => handleInputChange(e, 'fePrice', i)}
                                        min={0}
                                        addonAfter={<span>₺</span>}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value.replace(/\\s?|(,*)/g, '')}
                                    />
                                </Form.Item>
                                {inputList.length !== 1 ? <Form.Item noStyle>
                                    <div className='pl-10'>
                                        <Button danger
                                            className='flex items-center'
                                            onClick={() => handleRemoveClick(i)}
                                        >
                                            <DeleteOutlined /> Özellik Sil
                                        </Button>
                                    </div>
                                </Form.Item> : ""}
                                {inputList.length === (i + 1) ? <Form.Item noStyle>
                                    <div className={inputList.length === 1 ? 'pl-10' : ''}>
                                        <Button
                                            className='flex items-center'
                                            onClick={() => handleAddClick()}
                                        >
                                            <PlusOutlined /> Özellik Ekle
                                        </Button>
                                    </div>
                                </Form.Item> : ""}

                            </Input.Group>
                        </Form.Item>

                    )
                })}

                <Form.Item
                    name="residence"
                    label="Kategori"
                    rules={[
                        { type: 'array', required: true, message: 'Lütfen kategori seçin!' },
                    ]}>

                    <Cascader className='font-poppins' onChange={(e) => console.log(e.slice(-1))} options={categories} placeholder='Kategori seçiniz' />

                </Form.Item>
                <Form.Item
                    name="upload"
                    label="Resimler"
                    valuePropName="file">

                    <Upload
                        name="logo"
                        customRequest={dummyRequest}
                        onPreview={handleImagePreview}
                        onChange={handleImageChange}
                        accept='image/png, image/jpeg'
                        listType="picture-card">
                        {fileList.length >= 6 ? null : uploadButton}
                    </Upload>

                </Form.Item>
                <Form.Item label='Ürün Açıklaması'
                    name='body'
                    valuePropName='data'
                    getValueFromEvent={(event, editor) => {
                        const data = editor.getData();
                        return data;
                    }}
                    rules={[{ required: true, message: 'Lütfen açıklama girin' }]}>
                    <CKEditor onChange={(event, editor) => { const data = editor.getData(); console.log(data) }} editor={ClassicEditor} />
                </Form.Item>

            </Form>

            <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>
        </div>
    )
}

export default ProductAdd;
