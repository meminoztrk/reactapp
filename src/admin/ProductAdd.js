import React, { useState, useEffect } from 'react';
import { setNavigation } from '../stores/admin/navigation';
import { useDispatch } from 'react-redux';
import {
    Form,
    Modal,
    Input,
    Cascader,
    Select,
    Upload
} from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';

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
    const dispatch = useDispatch();

    const { Option } = Select;

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
    //#endregion


    useEffect(() => {
        dispatch(setNavigation("Ürün Ekle"))
    }, [dispatch])
    useEffect(() => {
        getCategories()
        getBrands()
    }, [])



    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

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

    useEffect(() => {
        console.log(fileList)
    }, [fileList])


    return (
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                autoComplete="off">
                <Form.Item
                    label="Marka"
                    name="brand"
                    rules={[{ required: true, message: 'Lütfen marka seçin!' }]}
                >
                    <Select
                        showSearch
                        className='w-40'
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
                <Form.Item
                    name="residence"
                    label="Kategori"
                    rules={[
                        { type: 'array', required: true, message: 'Lütfen kategori seçin!' },
                    ]}>

                    <Cascader className='font-poppins' onChange={(e)=>console.log(e.slice(-1))} options={categories} placeholder='Kategori seçiniz' />

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
