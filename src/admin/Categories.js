import React from 'react'
import { Button, Input, Table, Space, Modal, Form, Switch, Spin, Tag, Empty } from "antd";
import { useModalForm } from 'sunflower-antd';
import Highlighter from 'react-highlight-words';
import { useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { AiOutlinePlus, AiFillEdit, AiOutlineBars, AiOutlineDelete } from 'react-icons/ai';
import { MdOutlineError } from 'react-icons/md';




function compareByAlph(a, b) {
  if (a > b) {
    return -1;
  }
  if (a < b) {
    return 1;
  }
  return 0;
}

const Categories = () => {
  const [table, setTable] = useState({ data: [], loading: false })
  const [search, setSearch] = useState({ searchText: '', searchedColumn: '' })
  const [deleteForm, setDeleteForm] = useState({ visible: false, deleteId: 0 })
  const [subId, setSubId] = useState(0)

  const getCategory = async (id) => {
    await fetch("https://localhost:7168/api/Categories/" + id)
      .then(res => res.json())
      .then(data => {
        console.log(data.data)
      });
  }

  const getCategories = async () => {
    setTable({ loading: true });
    setTimeout(() => {
      fetch("https://localhost:7168/api/Categories/GetCategories")
        .then(res => res.json())
        .then(data => {
          setTable({
            loading: false,
            data: data.data,
          });
        });
    }, 200);
  }
  const getSubCategories = async (id) => {
    setTable({ loading: true });
    setTimeout(() => {
      fetch("https://localhost:7168/api/Categories/GetSubCategoriesWithId?id=" + id)
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
    await fetch('https://localhost:7168/api/Categories/UpdateIsActive/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: id, isActive: isActive })
    })
      .then(response => {
        if (response.ok) {
          console.log("okey abi sıkıntı yok", response);
        }
      })
      .catch(function (err) {
        console.info(err);
      });
  }

  const setDeleted = async (id) => {
    await fetch('https://localhost:7168/api/Categories/UpdateIsDeleted/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: id, isDeleted: true })
    })
      .then(response => {
        if (response.ok) {
          console.log("okey abi sıkıntı yok", response);
          setDeleteForm({ visible: false })
          getCategories();

        }
      })
      .catch(function (err) {
        console.info(err);
      });
  }


  const postCategories = async (name, status, sub) => {
    await fetch('https://localhost:7168/api/Categories/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: name, subId: sub, isActive: status })
    })
      .then(response => {
        if (response.ok) {
          subId === 0 ? getCategories() : getSubCategories(subId);
        }
      })
      .catch(function (err) {
        console.info(err);
      });
  }

  useEffect(() => {
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
      width: '40%',
      ...getColumnSearchProps('name', 'İsim'),
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
      title: 'Alt Kategoriler',
      dataIndex: 'subQuantity',
      key: 'subQuantity',
      width: '10%',
      align: 'center',
      render: (text, record) => (
        <Tag className='rounded-md' color="blue" >
          {record.subCount}
        </Tag>
      )
    },
    {
      title: 'İşlem',
      dataIndex: 'address',
      key: 'address',
      render: (text, record) => (
        <div className='space-x-2'>
          <Button className='rounded-md p-2 hover:text-orange-500 hover:border-orange-500' onClick={() => getCategory(record.id)} >
            <AiFillEdit />
          </Button>
          <Button className='rounded-md p-2 hover:text-green-500 hover:border-green-500' onClick={() => { getSubCategories(record.id); setSubId(record.id) }} >
            <AiOutlineBars />
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
      postCategories(name, active, subId)
      return 'ok';
    },
    form,
  });

  return (
    <div>
      <button className='bg-blue-500 mb-4 rounded-md hover:bg-blue-700 text-white p-2' onClick={() => { show(); form.resetFields() }} type='primary'><AiOutlinePlus size={20} /></button>
      <Modal {...modalProps} className='font-poppins' cancelText="İptal" okText="Kaydet" title="Kategori Form" centered >
        <Spin spinning={formLoading}>
          <Form
            {...formProps}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            className="space-y-3"
            autoComplete="off"
          >
            <Form.Item
              label="Kategori Adı"
              name="name"
              rules={[{ required: true, message: 'Lütfen kategori adı girin!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="active" label="Durum"
              valuePropName="checked" initialValue>
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
        rowKey="id"
        columns={columns}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"Veri Bulunamadı"} /> }}
        // rowKey={record => record.login.uuid}
        dataSource={table.data}
        loading={table.loading}
      />
    </div>
  )
}

export default Categories;
