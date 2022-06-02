import React from 'react'
import { Button, Input, Table, Space, Modal, Switch, Empty, Tag } from "antd";
import Highlighter from 'react-highlight-words';
import { useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { AiFillEdit, AiOutlineDelete } from 'react-icons/ai';
import { MdOutlineError } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { setNavigation } from '../stores/admin/navigation';
import { useNavigate } from 'react-router-dom';

function compareByAlph(a, b) {
    if (a > b) {
        return -1;
    }
    if (a < b) {
        return 1;
    }
    return 0;
}

const Products = () => {
    const [table, setTable] = useState({ data: [], loading: false })
    const [search, setSearch] = useState({ searchText: '', searchedColumn: '' })
    const [deleteForm, setDeleteForm] = useState({ visible: false, deleteId: 0 })
    const dispatch = useDispatch();
    let navigate = useNavigate();

    //#region API 
    const getProducts = async () => {
        setTable({ loading: true });
        setTimeout(() => {
            fetch(process.env.REACT_APP_API + "/Products/GetUndeletedProducts", {
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
        await fetch(process.env.REACT_APP_API + `/Products/${id}`, {
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
        await fetch(process.env.REACT_APP_API + `/Products/${id}`, {
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
                    getProducts();
                }
            })
            .catch(function (err) {
                console.info(err);
            });
    }
    
    //#endregion

    useEffect(() => {
        dispatch(setNavigation("Ürünler"))
    }, [dispatch]);
    useEffect(() => {
        getProducts()
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
            title: 'Ürün Adı',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => compareByAlph(a.name, b.name),
            ...getColumnSearchProps('name', 'Ürün Adı'),
        },
        {
            title: 'Marka',
            dataIndex: ['brand', 'name'],
            key: 'brand',
            sorter: (a, b) => compareByAlph(a.brand.name, b.brand.name),
            ...getColumnSearchProps('brand', 'Marka', 'name'),
        },
        {
            title: 'Kategori',
            dataIndex: ['category', 'name'],
            key: 'category',
            sorter: (a, b) => compareByAlph(a.category.name, b.category.name),
            ...getColumnSearchProps('category', 'Kategori', 'name'),
        },
        {
            title: 'Stok',
            dataIndex: 'stock',
            key: 'stock',
            align: 'center',
            sorter: (a, b) => compareByAlph(a.stock, b.stock),
            render: (text, record) => (
                <Tag className='rounded-md' color="blue" >
                  {record.stock}
                </Tag>
              )
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
                <div className='md:space-x-2 md:space-y-0 space-y-2'>
                    <Button className='rounded-md p-2 hover:text-orange-500 hover:border-orange-500' onClick={() => navigate("/admin/urunler/" + record.id)} >
                        <AiFillEdit />
                    </Button>
                    <Button className='rounded-md p-2 hover:text-red-500 hover:border-red-500' onClick={() => setDeleteForm({ visible: true, deleteId: record.id })} >
                        <AiOutlineDelete />
                    </Button>
                </div>


            )
        },
    ];

    return (
        <div>
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

export default Products;