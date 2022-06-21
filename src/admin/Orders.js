import React from 'react'
import { Button, Input, Select, Table, Space, Modal, Form, Switch, Spin, Empty } from "antd";
import Highlighter from 'react-highlight-words';
import { useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { AiFillEdit, AiOutlineDelete } from 'react-icons/ai';
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


const Orders = () => {
    const [table, setTable] = useState({ data: [], loading: false })
    const [search, setSearch] = useState({ searchText: '', searchedColumn: '' })
    const [deleteForm, setDeleteForm] = useState({ visible: false, deleteId: 0 })
    const [editId, setEditId] = useState(0)
    const dispatch = useDispatch();
    const { Option } = Select;


    //#region API 
    const getOrders = async () => {
        setTable({ loading: true });
        setTimeout(() => {
            fetch(process.env.REACT_APP_API + "/Orders/GetUndeletedOrders", {
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
                    getOrders();
                }
            })
            .catch(function (err) {
                console.info(err);
            });
    }

    //#endregion

    useEffect(() => {
        dispatch(setNavigation("Bekleyen Siparişler"))
    }, [dispatch]);
    useEffect(() => {
        getOrders()
    }, [])

    const dateFormat = (dt) => {
        return dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate()
        + "/" + (dt.getMonth() < 10 ? "0" + dt.getMonth() : dt.getMonth())
        + "/" + dt.getFullYear() + " " + (dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours()) + ":"
        + (dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes())
    }

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
            title: 'Sipariş Tarihi',
            dataIndex: 'orderdate',
            key: 'orderdate',
            width: '15%',
            align:'center',
            render: (text, record) => {
                var dt = new Date(record.createdDate);
                return  <p>{dateFormat(dt)}</p>
            }
               
        },
        {
            title: 'Alıcı',
            dataIndex: 'user',
            key: 'user',
            width: '15%',
            align:'center',
            render: (text, record) => (
                <p>{record.user.name + " " + record.user.surname}</p>
            )
        },
        {
            title: 'Sipariş Özeti',
            dataIndex: 'summary',
            key: 'summary',
            width: '15%',
            align:'center',
            render: (text, record) => (
                <p>{record.orderDetail.length} Ürün</p>
            )
        },
        {
            title: 'Tutar',
            dataIndex: 'summary',
            key: 'summary',
            width: '10%',
            align:'center',
            render: (text, record) => (
                <p className='font-semibold pr-4 text-orange-500'>{record.total.toFixed(2).toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')} TL</p>
            )
        },
        {
            title: 'Durum',
            dataIndex: 'status',
            key: 'status',
            width: '20%',
            align:'center',
            render: (text, record) => (
                <Select className='w-60 text-left' defaultValue={record.status} onChange={e => null} placeholder="Durum seçin">
                    <Option className='font-poppins' value="Sipariş Beklemede">Sipariş Beklemede</Option>
                    <Option className='font-poppins' value="Sipariş Onaylandı">Sipariş Onaylandı</Option>
                    <Option className='font-poppins' value="Sipariş İptal Edildi">Sipariş İptal Edildi</Option>
                    <Option className='font-poppins' value="Sipariş Kargoya Verildi">Sipariş Kargoya Verildi</Option>
                    <Option className='font-poppins' value="Teslim Edildi">Teslim Edildi</Option>
                </Select>
            )
        },
        {
            title: 'İşlem',
            dataIndex: 'address',
            key: 'address',
            render: (text, record) => (
                <div className='space-x-2'>
                    <Button className='rounded-md p-2 hover:text-orange-500 hover:border-orange-500' onClick={() => null} >
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

            <Modal forceRender className='font-poppins' cancelText="İptal" okText="Kaydet" title="Kategori Özellik Form" centered >
                <Spin>

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

export default Orders;
