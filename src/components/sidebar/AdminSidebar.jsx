import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.scss";
import { ROLE_ID } from "../../constant";
const { useNavigate } = require("react-router-dom");

var Name = "";

const sidebarNavItems = [
  {
    display: "Dashboard",
    icon: <i className="bx bx-home"></i>,
    to: "/admin",
    section: "admin",
  },
  {
    display: "Trip",
    icon: <i className="bx bx-trip"></i>,
    to: "/admin/trip",
    section: "trip",
  },
  {
    display: "Station",
    icon: <i className="bx bx-station"></i>,
    to: "/admin/station",
    section: "station",
  },
  {
    display: "Bus",
    icon: <i className="bx bx-bus"></i>,
    to: "/admin/bus",
    section: "bus",
  },
  {
    display: "Driver",
    icon: <i className="bx bx-group"></i>,
    to: "/admin/driver",
    section: "driver",
  },
  {
    display: "Account",
    icon: <i className="bx bx-user"></i>,
    to: "/admin/account",
    section: "account",
  },
  {
    display: "My Profile",
    icon: <i className="bx bx-detail"></i>,
    to: "/admin/my-profile",
    section: "my-profile",
  },
  {
    display: "Statistic",
    icon: <i className="bx bx-line-chart"></i>,
    to: "/admin/statistic",
    section: "statistic",
  },
  {
    display: "Logout",
    icon: <i className="bx bx-log-out"></i>,
    to: "/logout",
  },
];

const AdminSidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepHeight, setStepHeight] = useState(0);
  const sidebarRef = useRef();
  const indicatorRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");
  const roleID = Number(localStorage.getItem("RoleID"));

  useEffect(() => {
    if (
      (!accessToken &&
        (roleID !== ROLE_ID.Admin || roleID !== ROLE_ID.SuperAdmin)) ||
      (accessToken && roleID === ROLE_ID.User)
    ) {
      navigate("/");
    } else {
      setTimeout(() => {
        const sidebarItem = sidebarRef.current.querySelector(
          ".sidebar__menu__item"
        );
        indicatorRef.current.style.height = `${sidebarItem.clientHeight}px`;
        setStepHeight(sidebarItem.clientHeight);
        Name = localStorage.getItem("Name").split(" ");
        Name = Name[Name.length - 1];
      }, 50);
    }
  }, []);

  // change active index
  useEffect(() => {
    const Path = window.location.pathname.split("/");
    const curPath = Path[Path.length - 1];
    const curPath3 = Path[Path.length - 3];
    const activeItem = sidebarNavItems.findIndex(
      (item) => item.section === curPath || item.section === curPath3
    );
    setActiveIndex(curPath.length === 0 ? 0 : activeItem);
  }, [location]);

  const handleGoHome = () => {
    navigate("/admin");
  };

  return (
    <div className="sidebar">
      <div onClick={handleGoHome}>
        <img
          style={{ marginTop: "1%", marginLeft: "20%", cursor: "pointer" }}
          src="https://buslinemanagement.s3.ap-southeast-1.amazonaws.com/travelbus.jpg"
          alt=""
          width={170}
        />
      </div>
      <div className="sidebar_getHi">Hi {Name}!</div>
      <div className="sidebar_getRole">
        Role :{" "}
        {roleID === ROLE_ID.User
          ? "User"
          : roleID === ROLE_ID.SuperAdmin
          ? "Super Admin"
          : "Admin"}
      </div>
      <hr />
      <div ref={sidebarRef} className="sidebar__menu">
        <div
          ref={indicatorRef}
          className="sidebar__menu__indicator"
          style={{
            transform: `translateX(-50%) translateY(${
              activeIndex * stepHeight
            }px)`,
          }}
        ></div>
        {sidebarNavItems.map((item, index) => (
          <Link to={item.to} key={index}>
            <div
              className={`sidebar__menu__item ${
                activeIndex === index ? "active" : ""
              }`}
            >
              <div className="sidebar__menu__item__icon">{item.icon}</div>
              <div className="sidebar__menu__item__text">{item.display}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
