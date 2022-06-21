import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom'
import { Layout, Menu, Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
    BuildOutlined,
    MediumOutlined,
    AlertOutlined,
    PieChartOutlined,
    DropboxOutlined,
    FileOutlined,
    TeamOutlined,
    ArrowLeftOutlined,
    // UserOutlined,
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


const AdminNav = () => {
    const [collapse, setCollapse] = useState(false)
    const location = useLocation();
    const origin = location.pathname.split("/").pop();
    const navigator = useSelector(state => state.navigation.navigator);

    const items = [
        getItem(<Link to="/admin">Gösterge Paneli</Link>, 'admin', <PieChartOutlined />),
        getItem('Siparişler', 'siparisler', <AlertOutlined />,[
            getItem(<Link to="/admin/bekleyen-siparisler">Bekleyen</Link>,'bekleyen-siparisler'),
            getItem(<Link to="/admin/tamamlanan-siparisler">Tamamlanan</Link>,'tamamlanan-siparisler')
        ]), 
        getItem('Kategori', 'kategori', <BuildOutlined />, [
            getItem(<Link to="/admin/kategoriler">Kategoriler</Link>, 'kategoriler'),
            getItem(<Link to="/admin/kategori-ozellik">Kategori Özellik</Link>, 'kategori-ozellik'),
        ]),
        getItem(<Link to="/admin/markalar">Markalar</Link>, 'markalar', <MediumOutlined />),
        getItem('Ürün', 'sub1', <DropboxOutlined />, [
            getItem(<Link to="/admin/urunler">Ürünler</Link>, 'urunler'),
            getItem(<Link to="/admin/urun-ekle">Ürün Ekle</Link>, 'urun-ekle'),
        ]),
        getItem('Kullanıcılar', 'sub2', <TeamOutlined />),
        getItem('Raporlar', 'aa', <FileOutlined />),
        getItem(<Link to="/">Siteye Dön</Link>, 'aaa', <ArrowLeftOutlined />)
    ];

    return (
        <div>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapse}  onCollapse={() => setCollapse(!collapse)}>
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
                            <Breadcrumb.Item>{navigator}</Breadcrumb.Item>
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
