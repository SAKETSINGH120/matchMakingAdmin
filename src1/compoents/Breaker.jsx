import React from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { useLocation, Link } from 'react-router-dom';

const App = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);

  
  const capitalize = (text) =>
    text.charAt(0).toUpperCase() + text.slice(1);

  const breadcrumbItems = [
    {
      title: (
        <Link to="/">
          <HomeOutlined />
        </Link>
      ),
    },
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      return {
        title: (
          <Link to={url} className="text-sm font-bold">
            {capitalize(pathSnippets[index])}
          </Link>
        ),
      };
    }),
  ];

  return <Breadcrumb items={breadcrumbItems} />;
};

export default App;
