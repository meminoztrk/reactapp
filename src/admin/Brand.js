import React from 'react'
import { Button, Input, Table, Space, Modal, Form, Switch, Spin, Empty } from "antd";
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

const Brand = () => {
    const [table, setTable] = useState({ data: [], loading: false })
    const [search, setSearch] = useState({ searchText: '', searchedColumn: '' })
    const [deleteForm, setDeleteForm] = useState({ visible: false, deleteId: 0 })
    const [ispost, setIsPost] = useState(true)
    const [editId, setEditId] = useState(0)
    const dispatch = useDispatch();


    //#region API 
    const getBrand = async (id) => {
        form.resetFields();
        setIsPost(false)
        await fetch(process.env.REACT_APP_API + "/Brands/" + id, {
            method: 'GET',
            headers: {
                'ApiKey': process.env.REACT_APP_API_KEY,
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                setEditId(data.data.id)
                form.setFieldsValue({ name: data.data.name, active: data.data.isActive })
                show();
            })
    }
    const getBrands = async () => {
        setTable({ loading: true });
        setTimeout(() => {
            fetch(process.env.REACT_APP_API + "/Brands/GetBrands", {
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
        await fetch(process.env.REACT_APP_API + `/Brands/${id}`, {
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
        await fetch(process.env.REACT_APP_API + `/Brands/${id}`, {
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
                    getBrands();
                }
            })
            .catch(function (err) {
                console.info(err);
            });
    }
    const postBrand = async (name, status, sub) => {
        await fetch(process.env.REACT_APP_API + '/Brands/', {
            method: 'POST',
            headers: {
                'ApiKey': process.env.REACT_APP_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, subId: sub, isActive: status })
        })
            .then(response => {
                if (response.ok) {
                    getBrands();
                }
            })
            .catch(function (err) {
                console.info(err);
            });
    }
    const editBrand = async (name, status) => {
        await fetch(process.env.REACT_APP_API + `/Brands/${editId}`, {
            method: 'PATCH',
            headers: {
                'ApiKey': process.env.REACT_APP_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([{ path: "name", value: name }, { path: "isActive", value: status }])
        })
            .then(response => {
                if (response.ok) {
                    getBrands();
                }
            })
            .catch(function (err) {
                console.info(err);
            });
    }
    //#endregion

    useEffect(() => {
        dispatch(setNavigation("Markalar"))
    }, [dispatch]);
    useEffect(() => {
        getBrands()
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

    const getColumnSearchProps = (dataIndex, placeName) => ({
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
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
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
            title: 'Kategoriler',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => compareByAlph(a.name, b.name),
            width: '20%',
            ...getColumnSearchProps('name', 'Marka'),
        },
        {
            title: 'Durum',
            dataIndex: 'sub',
            key: 'sub',
            width: '20%',
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
                    <Button className='rounded-md p-2 hover:text-orange-500 hover:border-orange-500' onClick={() => getBrand(record.id)} >
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
        async submit({ name, active }) {
            ispost ? postBrand(name, active) : editBrand(name, active);

            return 'ok';
        },
        form,
    });

    return (
        <div>
            <div className='flex items-center mb-4 space-x-4'>
                <button className='bg-blue-500 rounded-md hover:bg-blue-700 text-white p-2' onClick={() => { show(); form.resetFields(); setIsPost(true); }} type='primary'><AiOutlinePlus size={20} /></button>
            </div>

            <Modal {...modalProps} forceRender className='font-poppins' cancelText="İptal" okText="Kaydet" title="Marka Form" centered >
                <Spin spinning={formLoading}>
                    <Form
                        {...formProps}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        className="space-y-3"
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Marka Adı"
                            name="name"
                            rules={[{ required: true, message: 'Lütfen kategori adı girin!' }]}
                        >
                            <Input />
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

export default Brand;
