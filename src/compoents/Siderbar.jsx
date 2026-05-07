import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { Outlet } from "react-router-dom";
import { BsPersonLinesFill } from "react-icons/bs";
import { FiPackage, FiMail } from "react-icons/fi";
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
          name: "Users",
          link: "/home/user",
          icon: FaUserTie,
          sectionName: "users",
        },
        {
          name: "Matches",
          link: "/home/match",
          icon: BsPersonLinesFill,
          sectionName: "match",
        },
        {
          name: "Meetings",
          link: "/home/meeting",
          icon: BsPersonLinesFill,
          sectionName: "meeting",
        },
        {
          name: "Subscriptions",
          link: "/home/subscriptions",
          icon: FaStar,
          sectionName: "subscriptions", // ← Change from "subscriptions" to null
        },
        {
          name: "Notification",
          link: "/home/notification",
          icon: MdOutlineDashboard,
          sectionName: "notification",
        },
        {
          name: "Feedback",
          link: "/home/feedback",
          icon: FiPackage,
          sectionName: "feedback",
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
          name: "Terms & Conditions",
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
        {
          name: "Email Template",
          link: "/home/email-template",
          icon: FiMail,
          sectionName: "email-template",
        },
      ],
    },
  ];

  // const visibleSections = menuSections
  //   .map((section) => ({
  //     ...section,
  //     items: section.items.filter((item) => {
  //       // No sectionName → always show (Dashboard)
  //       if (!item.sectionName) return true;

  //       // Only "read" permission is considered meaningful now
  //       // return hasPermission(item.sectionName, "read");
  //       return true;
  //     }),
  //   }))
  //   .filter((section) => section.items.length > 0);
  const visibleSections = menuSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        // Dashboard jaisa item jiska sectionName nahi hai → always show
        if (!item.sectionName) return true;

        // permission check
        return hasPermission(item.sectionName, "read");
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
            className={`h-screen overflow-hidden border-r border-theme-light-border bg-gradient-to-b from-theme-light-sidebarStart via-theme-light-sidebarMiddle to-theme-light-sidebarEnd text-gray-700 shadow-xl transition-[width,background-color,border-color,color] duration-500 dark:border-theme-dark-border dark:from-theme-dark-sidebar dark:via-theme-dark-sidebar dark:to-theme-dark-sidebar dark:text-theme-dark-textPrimary ${
              open ? "w-64" : "w-16"
            } flex flex-col`}
          >
            <div className="absolute z-30 top-4 right-4">
              <HiMenuAlt3
                size={26}
                className="size-8 cursor-pointer rounded-full border border-theme-light-border bg-theme-light-surface p-1 text-theme-light-textSecondary shadow transition-colors duration-200 hover:bg-theme-light-surfaceAlt dark:border-theme-dark-border dark:bg-theme-dark-surface dark:text-theme-dark-textSecondary dark:hover:bg-theme-dark-inputBg"
                onClick={() => setOpen(!open)}
              />
            </div>
            <div className="flex flex-col items-center justify-center border-b border-theme-light-border py-6 transition-colors duration-200 dark:border-theme-dark-border">
              <img
                src="/images/MatchLogo.png"
                alt="Logo"
                className={`rounded-full bg-theme-light-surface p-2 object-contain transition-all duration-500 dark:bg-theme-dark-surface ${
                  open ? "w-16 h-16" : "w-10 h-10 mt-12"
                }`}
              />
              <h1
                className={`mt-3 text-base font-semibold text-theme-light-heading transition-all duration-700 dark:text-theme-dark-textPrimary ${
                  open ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
                }`}
              >
                Admin Panel
              </h1>
              <UserRole
                className={`text-xs text-theme-light-textSecondary transition-all duration-700 dark:text-theme-dark-textSecondary ${
                  open ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
                }`}
              />
            </div>
            <div className="flex-1 overflow-y-auto px-1 mt-4">
              {visibleSections.map((section, secIdx) => (
                <div key={section.section} className="mb-4">
                  {open && (
                    <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-theme-light-heading dark:text-theme-dark-textSecondary">
                      {section.section}
                    </div>
                  )}

                  {section.items.map((menu, idx) => {
                    const isActive = activeMenu === `${secIdx}-${idx}`;

                    return (
                      <Link
                        key={menu.name}
                        to={menu.link}
                        className={`mb-1 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                          isActive
                            ? "bg-theme-light-primaryButton text-white shadow-md dark:bg-theme-dark-primaryButton"
                            : "text-theme-light-textPrimary hover:bg-theme-light-primaryButton/80 hover:text-white dark:text-theme-dark-textPrimary dark:hover:bg-theme-dark-primaryButton/80"
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
