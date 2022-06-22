import React from 'react'
// import { Button, Input, Select, Table, Space, Modal, Row, Col, Empty } from "antd";
import { Button, Select, Table, Modal, Row, Col, Empty } from "antd";
// import Highlighter from 'react-highlight-words';
import { useState, useEffect } from "react";
// import { SearchOutlined, ContainerOutlined, UserOutlined } from "@ant-design/icons";
import { ContainerOutlined, UserOutlined } from "@ant-design/icons";
import { AiOutlineEye, AiOutlineDelete } from 'react-icons/ai';
import { MdOutlineError } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { setNavigation } from '../stores/admin/navigation';


const OrdersCompleted = () => {
    const [table, setTable] = useState({ data: [], loading: false })
    // const [search, setSearch] = useState({ searchText: '', searchedColumn: '' })
    const [deleteForm, setDeleteForm] = useState({ visible: false, deleteId: 0 })
    const [preview, setPreview] = useState({ data: [], customer: {}, modal: false })
    const dispatch = useDispatch();
    const { Option } = Select;


    //#region API 
    const getOrders = async () => {
        setTable({ loading: true });
        setTimeout(() => {
            fetch(process.env.REACT_APP_API + "/Orders/GetUndeletedCompletedOrders", {
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
    const getDetails = (id) => {
        let previewData = table.data.find(x => x.id === id);
        setPreview({ data: previewData.orderDetail, customer: previewData.user, modal: true });

    }
    const setStatus = async (id, status) => {
        await fetch(process.env.REACT_APP_API + `/Orders/${id}`, {
            method: 'PATCH',
            headers: {
                'ApiKey': process.env.REACT_APP_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([{ path: "status", value: status },{ path: "updatedDate", value: new Date() }])
        }).then(response => {
            if (response.ok) {
                getOrders();
            }
        })
        .catch(function (err) {
            console.info(err);
        });
    }
    const setDeleted = async (id) => {
        await fetch(process.env.REACT_APP_API + `/Orders/${id}`, {
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
        dispatch(setNavigation("Tamamlanan Siparişler"))
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
    // const handleSearch = (selectedKeys, confirm, dataIndex) => {
    //     confirm();
    //     setSearch({
    //         searchText: selectedKeys[0],
    //         searchedColumn: dataIndex,
    //     });
    // };

    // const handleReset = clearFilters => {
    //     clearFilters();
    //     setSearch({ searchText: '' });
    // };

    // const getColumnSearchProps = (dataIndex, placeName, subName) => ({
    //     filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
    //         <div style={{ padding: 8 }}>
    //             <Input
    //                 placeholder={`${placeName} Ara `}
    //                 value={selectedKeys[0]}
    //                 onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
    //                 onPressEnter={(e) => handleSearch(selectedKeys, confirm, dataIndex)}
    //                 style={{ marginBottom: 8, display: 'block' }}
    //             />
    //             <Space>
    //                 <Button
    //                     className='bg-blue-400 text-white'
    //                     onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
    //                     size="small"
    //                     style={{ width: 90 }}
    //                 >
    //                     <div className='flex items-center justify-center space-x-2'>
    //                         <span>Ara</span>
    //                         <SearchOutlined />
    //                     </div>

    //                 </Button>
    //                 <Button onClick={() => { handleReset(clearFilters); confirm({ closeDropdown: false }) }} size="small" style={{ width: 90 }}>
    //                     Sıfırla
    //                 </Button>
    //                 <Button
    //                     type="link"
    //                     size="small"
    //                     onClick={() => {
    //                         confirm({ closeDropdown: false });
    //                         setSearch({
    //                             searchText: selectedKeys[0],
    //                             searchedColumn: dataIndex,
    //                         });
    //                     }}
    //                 >
    //                     Filtre
    //                 </Button>
    //             </Space>
    //         </div>
    //     ),
    //     filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    //     // onFilter: (value, record) =>
    //     //     record[dataIndex]
    //     //         ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
    //     //         : '',
    //     onFilter: (value, record) => subName ? record[dataIndex]['name'].toString().toLowerCase().includes(value.toLowerCase()) :
    //         record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    //     render: text =>
    //         search.searchedColumn === dataIndex ? (
    //             <Highlighter
    //                 highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
    //                 searchWords={[search.searchText]}
    //                 autoEscape
    //                 textToHighlight={text ? text.toString() : ''}
    //             />
    //         ) : (
    //             text
    //         ),
    // });
    //#endregion 

    const columns = [
        {
            title: 'Sipariş Tarihi',
            dataIndex: 'orderdate',
            key: 'orderdate',
            width: '20%',
            align: 'center',
            render: (text, record) => {
                var dt = new Date(record.createdDate);
                return <p>{dateFormat(dt)}</p>
            }

        },
        {
            title: 'Alıcı',
            dataIndex: 'user',
            key: 'user',
            width: '15%',
            align: 'center',
            render: (text, record) => (
                <p>{record.user.name + " " + record.user.surname}</p>
            )
        },
        {
            title: 'Sipariş Özeti',
            dataIndex: 'summary',
            key: 'summary',
            width: '15%',
            align: 'center',
            render: (text, record) => (
                <p>{record.orderDetail.length} Ürün</p>
            )
        },
        {
            title: 'Tutar',
            dataIndex: 'summary',
            key: 'summary',
            width: '15%',
            align: 'center',
            render: (text, record) => (
                <p className='font-semibold pr-4 text-orange-500'>{record.total.toFixed(2).toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')} TL</p>
            )
        },
        {
            title: 'Durum',
            dataIndex: 'status',
            key: 'status',
            width: '20%',
            align: 'center',
            render: (text, record) => (
                <Select className='w-60 text-left' defaultValue={record.status} onChange={e => setStatus(record.id,e)} placeholder="Durum seçin">
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
                    <Button className='rounded-md p-2 hover:text-orange-500 hover:border-orange-500' onClick={() => getDetails(record.id)} >
                        <AiOutlineEye />
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

            <Modal forceRender width={1200} visible={preview.modal} onCancel={() => setPreview({ ...preview, modal: false })} className='font-poppins' footer={null} title="Sipariş Detayı" centered >
                <div className='rounded py-2 bg-white border-gray-300 border-opacity-100 border-x-2 border-y shadow divide-y'>
                    <Row className='py-2 px-4 text-lg flex items-center justify-between'>
                        <div className='flex items-center space-x-3'>
                            <div className='rounded-full flex justify-center items-center h-12 w-12 bg-gray-100'><ContainerOutlined className='text-lg' /></div>
                            <span className='font-semibold text-lg'>Alışveriş Özeti</span>
                        </div>
                        <div className='text-sm pr-5'>Toplam {preview.data.length} Ürün</div>
                    </Row>
                    {preview.data.map((item, index) => (
                        <div key={index}>
                            <Row className='text-gray-600 flex items-center py-2'>
                                <Col span={4} className="justify-center flex pr-2">
                                    <div className="p-2">
                                        <img className='w-20' src={item.path} alt={item.productName} ></img>
                                    </div>
                                </Col>
                                <Col span={13}>
                                    <p className='font-medium'>{item.productName} - {item.color}</p>
                                </Col>
                                <Col span={3} className="flex items-center">
                                    {item.quantity} Adet
                                </Col>
                                <Col span={2}>
                                    <p className='text-orange-500'>{item.total.toFixed(2).toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')} TL</p>
                                </Col>


                            </Row>
                        </div>

                    ))}
                    <span className='h-[2vw] block'></span>
                </div>

                <div className='rounded py-2 mt-2 bg-white border-gray-300 border-opacity-100 border-x-2 border-y shadow divide-y'>
                    <Row className='py-2 px-4 text-lg flex items-center'>
                        <div className='flex items-center space-x-3'>
                            <div className='rounded-full flex justify-center items-center h-12 w-12 bg-gray-100'><UserOutlined className='text-lg' /></div>
                            <span className='font-semibold text-lg'>Müşteri Bilgileri</span>
                        </div>
                    </Row>
                    <Row className='py-2 flex items-center'>
                        <Col span={6} className="justify-center flex pr-2">
                            <p className='font-semibold'>Müşteri</p>
                        </Col>
                        <Col span={6} className="justify-center flex pr-2">
                            <p className='font-semibold'>Telefon</p>
                        </Col>
                        <Col span={6} className="justify-center flex pr-2">
                            <p className='font-semibold'>Mail</p>
                        </Col>
                        <Col span={6} className="justify-center flex pr-2">
                            <p className='font-semibold'>Adres</p>
                        </Col>
                    </Row>
                    <div>
                        {preview.customer.id &&
                            <Row className='text-gray-600 flex items-center py-8'>
                                <Col span={6} className="justify-center flex">
                                    <p className='font-medium'>{preview.customer.name} {preview.customer.surname}</p>
                                </Col>
                                <Col span={6} className="justify-center flex">
                                    <p className='font-medium'>{preview.customer.phone}</p>
                                </Col>
                                <Col span={6} className="justify-center flex">
                                    <p className='font-medium'>{preview.customer.email}</p>
                                </Col>
                                <Col span={6} className="justify-center flex">
                                    <p className='font-medium'>Osmangazi/Bursa</p>
                                </Col>
                            </Row>
                        }

                    </div>
                    <span className='h-[2vw] block'></span>
                </div>
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

export default OrdersCompleted;
