import React from 'react'
import { Button, Input, Select, Table, Space, Modal, Form, Switch, Spin, Empty } from "antd";
import { useModalForm } from 'sunflower-antd';
import Highlighter from 'react-highlight-words';
import { useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { AiOutlinePlus, AiFillEdit, AiOutlineDelete } from 'react-icons/ai';
import { MdOutlineError } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { setNavigation } from '../stores/admin/navigation';

function compareByAlph(a, b) {
    if (a > b) {
        return -1;
    }
    if (a < b) {
        return 1;
    }
    return 0;
}

const CatFeature = () => {
    const [table, setTable] = useState({ data: [], loading: false })
    const [search, setSearch] = useState({ searchText: '', searchedColumn: '' })
    const [deleteForm, setDeleteForm] = useState({ visible: false, deleteId: 0 })
    const [categories, setCategories] = useState([])
    const [ispost, setIsPost] = useState(true)
    const [editId, setEditId] = useState(0)
    const dispatch = useDispatch();
    const { Option } = Select;


    //#region API 
    const getFeature = async (id) => {
        form.resetFields();
        setIsPost(false)
        await fetch(process.env.REACT_APP_API + "/Features/" + id, {
            method: 'GET',
            headers: {
                'ApiKey': process.env.REACT_APP_API_KEY,
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                setEditId(data.data.id)
                form.setFieldsValue({ name: data.data.name, active: data.data.isActive, categoryId: data.data.categoryId })
                show();
            })
    }
    const getFeatures = async () => {
        setTable({ loading: true });
        setTimeout(() => {
            fetch(process.env.REACT_APP_API + "/Features/GetCategoryFeatures", {
                method: 'GET',
                headers: {
                    'ApiKey': process.env.REACT_APP_API_KEY,
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    setTable({
                        loading: false,
                        data: data.data,
                    });
                });
        }, 200);
    }
    const setActive = async (id, isActive) => {
        await fetch(process.env.REACT_APP_API + `/Features/${id}`, {
            method: 'PATCH',
            headers: {
                'ApiKey': process.env.REACT_APP_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([{ path: "isActive", value: isActive }])
        }).catch(function (err) {
            console.info(err);
        });
    }
    const setDeleted = async (id) => {
        await fetch(process.env.REACT_APP_API + `/Features/${id}`, {
            method: 'PATCH',
            headers: {
                'ApiKey': process.env.REACT_APP_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([{ path: "isDeleted", value: true }])
        })
            .then(response => {
                if (response.ok) {
                    setDeleteForm({ visible: false })
                    getFeatures();
                }
            })
            .catch(function (err) {
                console.info(err);
            });
    }
    const postFeature = async (name, status, categoryId) => {
        await fetch(process.env.REACT_APP_API + '/Features/', {
            method: 'POST',
            headers: {
                'ApiKey': process.env.REACT_APP_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, isActive: status, categoryId: categoryId })
        })
            .then(response => {
                if (response.ok) {
                    getFeatures();
                }
            })
            .catch(function (err) {
                console.info(err);
            });
    }
    const editFeature = async (name, status, categoryId) => {
        await fetch(process.env.REACT_APP_API + `/Features/${editId}`, {
            method: 'PATCH',
            headers: {
                'ApiKey': process.env.REACT_APP_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([{ path: "name", value: name }, { path: "isActive", value: status }, { path: "categoryId", value: categoryId }])
        })
            .then(response => {
                if (response.ok) {
                    getFeatures();
                }
            })
            .catch(function (err) {
                console.info(err);
            });
    }
    const getCategories = async () => {
        setTimeout(() => {
            fetch(process.env.REACT_APP_API + "/Features/GetLastCategories", {
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
        }, 200);
    }
    //#endregion

    useEffect(() => {
        dispatch(setNavigation("Kategori Özellikleri"))
    }, [dispatch]);
    useEffect(() => {
        getFeatures()
        getCategories()
    }, [])

    //#region Table Search
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearch({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearch({ searchText: '' });
    };

    const getColumnSearchProps = (dataIndex, placeName, subName) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`${placeName} Ara `}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={(e) => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        className='bg-blue-400 text-white'
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        <div className='flex items-center justify-center space-x-2'>
                            <span>Ara</span>
                            <SearchOutlined />
                        </div>

                    </Button>
                    <Button onClick={() => { handleReset(clearFilters); confirm({ closeDropdown: false }) }} size="small" style={{ width: 90 }}>
                        Sıfırla
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearch({
                                searchText: selectedKeys[0],
                                searchedColumn: dataIndex,
                            });
                        }}
                    >
                        Filtre
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        // onFilter: (value, record) =>
        //     record[dataIndex]
        //         ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        //         : '',
        onFilter: (value, record) => subName ? record[dataIndex]['name'].toString().toLowerCase().includes(value.toLowerCase()) :
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        render: text =>
            search.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[search.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    //#endregion 

    const columns = [
        {
            title: 'Özellik',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => compareByAlph(a.name, b.name),
            width: '30%',
            ...getColumnSearchProps('name', 'Özellik'),
        },
        {
            title: 'Kategori',
            dataIndex: ['category', 'name'],
            key: 'category',
            sorter: (a, b) => compareByAlph(a.category.name, b.category.name),
            width: '20%',
            ...getColumnSearchProps('category', 'Kategori', 'name'),
        },

        {
            title: 'Durum',
            dataIndex: 'sub',
            key: 'sub',
            width: '10%',
            align: 'center',
            render: (text, record) => (
                <Switch
                    {...record.isActive ? { 'defaultChecked': true } : { 'defaultChecked': false }}
                    onChange={(e) => setActive(record.id, e)}
                    checkedChildren="Aktif"
                    unCheckedChildren="Pasif"
                />
            )
        },
        {
            title: 'İşlem',
            dataIndex: 'address',
            key: 'address',
            render: (text, record) => (
                <div className='space-x-2'>
                    <Button className='rounded-md p-2 hover:text-orange-500 hover:border-orange-500' onClick={() => getFeature(record.id)} >
                        <AiFillEdit />
                    </Button>
                    <Button className='rounded-md p-2 hover:text-red-500 hover:border-red-500' onClick={() => setDeleteForm({ visible: true, deleteId: record.id })} >
                        <AiOutlineDelete />
                    </Button>
                </div>


            )
        },
    ];

    const [form] = Form.useForm();

    const {
        modalProps,
        formProps,
        show,
        formLoading,
        // formValues,
        // formResult,
    } = useModalForm({
        defaultVisible: false,
        autoSubmitClose: true,
        autoResetForm: true,
        async submit({ name, active, categoryId }) {
            ispost ? postFeature(name, active, categoryId) : editFeature(name, active, categoryId);
            return 'ok';
        },
        form,
    });


    return (
        <div>
            <div className='flex items-center mb-4 space-x-4'>
                <button className='bg-blue-500 rounded-md hover:bg-blue-700 text-white p-2' onClick={() => { show(); form.resetFields(); setIsPost(true); }} type='primary'><AiOutlinePlus size={20} /></button>
            </div>

            <Modal {...modalProps} forceRender className='font-poppins' cancelText="İptal" okText="Kaydet" title="Kategori Özellik Form" centered >
                <Spin spinning={formLoading}>
                    <Form
                        {...formProps}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        className="space-y-3"
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Özellik Adı"
                            name="name"
                            rules={[{ required: true, message: 'Lütfen özellik girin!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Kategori"
                            name="categoryId"
                            rules={[{ required: true, message: 'Lütfen kategori seçin!' }]}
                        >
                            <Select
                                showSearch
                                className='w-3/4'
                                placeholder="Kategori Seçiniz"
                                optionFilterProp="children"
                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            >
                                {categories.map(cat => <Option className='font-poppins' key={cat.id} value={cat.id}>{cat.name}</Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item name="active" label="Durum" valuePropName='checked' initialValue>
                            <Switch
                                checkedChildren="Aktif"
                                unCheckedChildren="Pasif"
                            />
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>

            <Modal
                className='font-poppins'
                title='Silme İşlemi'
                visible={deleteForm.visible}
                onOk={() => setDeleted(deleteForm.deleteId)}
                onCancel={() => setDeleteForm({ visible: false })}
                okText="Evet"
                cancelText="Hayır"
                width={400}
            >
                <div className='flex flex-col justify-center items-center text-red-500 space-y-3'>
                    <MdOutlineError size={50} />
                    <span>Silmek istediğinize emin misiniz ?</span>
                </div>

            </Modal>

            <Table
                locale={{
                    emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"Veri Bulunamadı"} />,
                    triggerDesc: 'Z-A ye Sıralama',
                    triggerAsc: 'A-Z ye Sıralama',
                    cancelSort: 'Standart Sıralama'
                }}
                rowKey="id"
                columns={columns}
                dataSource={table.data}
                loading={table.loading}
            />
        </div>
    )
}

export default CatFeature
