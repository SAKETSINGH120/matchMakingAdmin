import React from "react";
import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import { useLocation, Link } from "react-router-dom";

const App = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  const breadcrumbItems = [
    {
      title: (
        <Link
          to="/"
          className="text-theme-light-textSecondary transition-colors duration-200 hover:text-theme-light-textPrimary dark:text-theme-dark-textSecondary dark:hover:text-theme-dark-textPrimary"
        >
          <HomeOutlined />
        </Link>
      ),
    },
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      return {
        title: (
          <Link
            to={url}
            className="text-sm font-bold text-theme-light-textSecondary transition-colors duration-200 hover:text-theme-light-textPrimary dark:text-theme-dark-textSecondary dark:hover:text-theme-dark-textPrimary"
          >
            {capitalize(pathSnippets[index])}
          </Link>
        ),
      };
    }),
  ];

  return (
    <div className="text-theme-light-textSecondary transition-colors duration-200 dark:text-theme-dark-textSecondary">
      <Breadcrumb className="theme-breadcrumb" items={breadcrumbItems} />
    </div>
  );
};

export default App;
