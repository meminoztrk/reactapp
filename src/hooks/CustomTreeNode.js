import React from 'react'
import { Tree } from 'antd';
import { Link } from 'react-router-dom';

function CustomTreeNode({ treeData }) {

    if (treeData === null || treeData === undefined) {
        return null;
    }

    const renderTitle = (item) => (
        <Link className='hover:text-orange-500' to={item.key}>{item.title}</Link>
    );

    return (
        <Tree
            showLine={false}
            showIcon={false}
            selectable={false}
            defaultExpandAll
            className='text-xs'
            treeData={treeData}
            titleRender={renderTitle}
        />
    );
}

export default CustomTreeNode;
