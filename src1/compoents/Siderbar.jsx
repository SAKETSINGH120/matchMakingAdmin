import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { Outlet } from "react-router-dom";
import { BsPersonLinesFill } from "react-icons/bs";
import { FiPackage } from "react-icons/fi";
import { FaUserTie, FaStar } from "react-icons/fa";
import { GiFlyingFlag } from "react-icons/gi";

const UserRole = ({ className }) => {
  const { auth } = useAuth();
  const roleName = auth?.user?.role || "User";

  return (
    <span className={className}>
      {roleName
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")}
    </span>
  );
};

const Sidebar = () => {
  const { auth, hasPermission } = useAuth();
  const location = useLocation();

  const [open, setOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const menuSections = [
    {
      section: "Main",
      items: [
        {
          name: "Dashboard",
          link: "/home",
          icon: MdOutlineDashboard,
          sectionName: null, // always visible
        },
        {
          name: "Role",
          link: "/home/role",
          icon: GiFlyingFlag,
          sectionName: "role",
        },
        {
          name: "User",
          link: "/home/user",
          icon: FaUserTie,
          sectionName: "users",
        },
        {
          name: "Match",
          link: "/home/match",
          icon: BsPersonLinesFill,
          sectionName: "match",
        },
        {
          name: "Meeting",
          link: "/home/meeting",
          icon: BsPersonLinesFill,
          sectionName: "meeting",
        },
        {
          name: "Feedback",
          link: "/home/feedback",
          icon: FiPackage,
          sectionName: "feedback",
        },
        {
          name: "Subscriptions",
          link: "/home/subscriptions",
          icon: FaStar,
          sectionName: null, // ← Change from "subscriptions" to null
        },
      ],
    },
    {
      section: "CMS",
      items: [
        {
          name: "PrivacyPolicy",
          link: "/home/policy",
          icon: MdOutlineDashboard,
          sectionName: "privacypolicy",
        },
        {
          name: "Term&Condtion",
          link: "/home/term&condition",
          icon: MdOutlineDashboard,
          sectionName: "term&condition",
        },
        {
          name: "AboutUs",
          link: "/home/aboutus",
          icon: MdOutlineDashboard,
          sectionName: "aboutus",
        },
      ],
    },
  ];

  const visibleSections = menuSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        // No sectionName → always show (Dashboard)
        if (!item.sectionName) return true;

        // Only "read" permission is considered meaningful now
        // return hasPermission(item.sectionName, "read");
        return true;
      }),
    }))
    .filter((section) => section.items.length > 0);

  useEffect(() => {
    const currentPath = location.pathname;

    visibleSections.forEach((section, secIdx) => {
      section.items.forEach((item, itemIdx) => {
        if (currentPath === item.link || currentPath === `${item.link}/`) {
          setActiveMenu(`${secIdx}-${itemIdx}`);
        }
      });
    });
  }, [location.pathname, visibleSections]);

  return (
    <div>
      <section className="flex">
        <div className="relative">
          <div
            className={`bg-gradient-to-b from-[#e9eee7] via-[#e3ebe0] to-[#d6dfd3] border-r border-[#e9eee7] h-screen shadow-xl ${
              open ? "w-64" : "w-16"
            } duration-500 text-gray-700 flex flex-col overflow-hidden`}
          >
            <div className="absolute z-30 top-4 right-4">
              <HiMenuAlt3
                size={26}
                className="hover:bg-orange-50 size-8 text-[#7f8c7a] rounded-full p-1 cursor-pointer border border-[#e9eee7] bg-white shadow"
                onClick={() => setOpen(!open)}
              />
            </div>
            <div className="flex flex-col items-center justify-center py-6 border-b border-orange-100">
              <img
                src="/images/MatchLogo.png"
                alt="Logo"
                className={`object-contain transition-all duration-500 rounded-full bg-white p-2 ${
                  open ? "w-16 h-16" : "w-10 h-10 mt-12"
                }`}
              />
              <h1
                className={`mt-3 font-semibold text-base text-gray-800 transition-all duration-700 ${
                  open ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
                }`}
              >
                Admin Panel
              </h1>
              <UserRole
                className={`text-xs text-gray-500 transition-all duration-700 ${
                  open ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
                }`}
              />
            </div>
            <div className="flex-1 overflow-y-auto px-1 mt-4">
              {visibleSections.map((section, secIdx) => (
                <div key={section.section} className="mb-4">
                  {open && (
                    <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-black">
                      {section.section}
                    </div>
                  )}

                  {section.items.map((menu, idx) => {
                    const isActive = activeMenu === `${secIdx}-${idx}`;

                    return (
                      <Link
                        key={menu.name}
                        to={menu.link}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-[#5f6f5c] text-white shadow-md"
                            : "text-gray-700 hover:bg-[#5f6f5c]/70 hover:text-white/90"
                        }`}
                        onClick={() => setActiveMenu(`${secIdx}-${idx}`)}
                      >
                        <div className="min-w-[24px]">
                          {React.createElement(menu.icon, { size: 20 })}
                        </div>
                        <span
                          className={`whitespace-pre duration-500 ${
                            !open
                              ? "opacity-0 translate-x-10 overflow-hidden"
                              : ""
                          }`}
                        >
                          {menu.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        <section className="w-full">{/* <Outlet /> */}</section>
      </section>
    </div>
  );
};

export default Sidebar;
