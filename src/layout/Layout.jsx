import { Outlet } from "react-router-dom";
import Siderbar from "../compoents/Siderbar";
import Navbar from "../compoents/Navbar";
import "/src/index.css"

// import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="theme-page flex h-screen">
      <Siderbar></Siderbar>
      <div className="flex flex-1 flex-col pl-1">
        <Navbar></Navbar>
        <main className="sidebar-scroll flex-1 overflow-auto bg-theme-light-bg p-0 pt-4 text-theme-light-textPrimary transition-colors duration-200 dark:bg-theme-dark-bg dark:text-theme-dark-textPrimary">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
