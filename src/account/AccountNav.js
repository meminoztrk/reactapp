import React from 'react'
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom'
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingCartOutlined,
  LogoutOutlined,
  UserOutlined
} from '@ant-design/icons';
const {Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const AccountNav = () => {
  const user = useSelector(state => state.user.user);
  const location = useLocation();
  const origin = location.pathname.split("/").pop();

  const items = [
    getItem(<Link to="/hesabim/siparisler">Siparişlerim</Link>, 'siparisler', <ShoppingCartOutlined />),
    getItem(<Link to="/hesabim/profil">Profilim</Link>, 'profil', <UserOutlined />),
    getItem(<Link to="/">Çıkış Yap</Link>, 'markalar', <LogoutOutlined />)
  ];

  return (
    <div>
      <div>
        <Layout style={{ minHeight: '60vh' }} className='h-full'>
          <Sider className='bg-white' width={300}>
            <div className='bg-orange-500 text-white p-6 mb-2 flex items-center'>
              <div className='relative rounded-full bg-white p-4 w-12 h-12 mr-3'>
                <img className="object-cover w-full h-full rounded-full" src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" loading="lazy" />
                <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
              </div>
              <div className='text-white'>
                <p className="">Hoşgeldin</p>
                <p className="font-semibold  ">{user.name + " " + user.surname}</p>
              </div>
            </div>
            <Menu className='userNav' theme="light" selectedKeys={[origin]} mode="inline" items={items} />
          </Sider>
          <Layout className="site-layout" style={{ backgroundColor: '#EBEBEB' }}>
            <Content style={{ margin: '0 16px' }}>
              <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                <Outlet />
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    </div>
  )
}

export default AccountNav;
