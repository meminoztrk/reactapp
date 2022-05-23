import React, { useState, useEffect } from 'react';
import { setNavigation } from '../stores/admin/navigation';
import { useDispatch } from 'react-redux';
import {
    Form,
    Modal,
    Input,
    InputNumber,
    Cascader,
    Select,
    Row,
    Col,
    Checkbox,
    Button,
    AutoComplete,
    message, Upload
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
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(setNavigation("Ürün Ekle"))
    }, [dispatch])

    const residences = [
        {
            value: 'zhejiang',
            label: 'Elektronik',
            children: [
                {
                    value: '1',
                    label: 'Cep Telefonu ve Aksesuar',
                    children: [
                        {
                            value: '3',
                            label: 'Cep Telefonu',
                            children: [
                                {
                                    value: '3',
                                    label: 'Cep Telefonu',
                                },
                                {
                                    value: '4',
                                    label: 'Cep Telefonu Aksesuar',
                                },
                            ],
                        },
                        {
                            value: '4',
                            label: 'Cep Telefonu Aksesuar',
                        },
                    ],
                },
                {
                    value: '2',
                    label: 'Bilgisayar, Tablet',
                    children: [
                    ],
                },
            ],
        },
        {
            value: 'jiangsu',
            label: 'Jiangsu',
            children: [
                {
                    value: 'nanjing',
                    label: 'Nanjing',
                    children: [
                        {
                            value: 'zhonghuamen',
                            label: 'Zhong Hua Men',
                        },
                    ],
                },
            ],
        },
    ];

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
                className="space-y-3"
                autoComplete="off">
                <Form.Item
                    name="residence"
                    label="Kategori"
                    rules={[
                        { type: 'array', required: true, message: 'Please select your habitual residence!' },
                    ]}>

                    <Cascader className='font-poppins' options={residences} placeholder='Lütfen Kategori Seçiniz' />

                </Form.Item>
                <Form.Item
                    name="upload"
                    label="Upload"
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
