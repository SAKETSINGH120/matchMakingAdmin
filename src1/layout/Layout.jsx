import { Outlet } from "react-router-dom";
import Siderbar from "../compoents/Siderbar";
import Navbar from "../compoents/Navbar";
import "/src/index.css"

// import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="flex h-screen">
      <Siderbar></Siderbar>
      <div className="flex flex-col flex-1 pl-1 ">
        <Navbar></Navbar>
        <main className="p-0 pt-4 overflow-auto flex-1 bg-gray-100 sidebar-scroll">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
