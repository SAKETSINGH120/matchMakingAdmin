import React from "react";
import { Flex, Spin } from "antd";
import "../App.css"; // make sure to import the CSS file

const contentStyle = {
  padding: 50,
};

const content = <div className="loader-content" style={contentStyle} />;

const App = () => (
  <div className="theme-page flex min-h-screen items-center justify-center">
    <Flex gap="middle" vertical>
      <Flex>
        <Spin size="large">{content}</Spin>
      </Flex>
    </Flex>
  </div>
);

export default App;
