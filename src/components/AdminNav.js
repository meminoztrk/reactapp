import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout, Menu, Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
    BuildOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}



const items = [
    getItem(<Link to="/admin">Gösterge Paneli</Link>, 'admin', <PieChartOutlined />),
    getItem(<Link to="/admin/kategoriler">Kategoriler</Link>, 'kategoriler', <BuildOutlined />),
    getItem('Ürün', 'sub1', <UserOutlined />, [
        getItem('Tom', '3'),
        getItem('Bill', '4'),
        getItem('Alex', '5'),
    ]),
    getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Files', '9', <FileOutlined />),
];

const AdminNav = () => {
    const [collapse, setCollapse] = useState(false)
    const location = useLocation();
    const origin = location.pathname.split("/").pop();

    return (
        <div>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapse} onCollapse={() => setCollapse(!collapse)}>
                    <div className='img'>
                        <div className="logo" />
                    </div>

                    <Menu theme="dark" selectedKeys={[origin]} mode="inline" items={items} />
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0 }} />
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Admin</Breadcrumb.Item>
                            <Breadcrumb.Item>Gösterge Paneli</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            <Outlet />
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Bilecik Şeyh Edebali Üniversitesi</Footer>
                </Layout>
            </Layout>
        </div>
    )
}

export default AdminNav
