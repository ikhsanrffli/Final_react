import React, { useState, useEffect } from "react";
import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
// import ViewStreamOutlinedIcon from "@mui/icons-material/ViewStreamOutlined";
import PlaceIcon from "@mui/icons-material/Place";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
// import InsertChartIcon from "@mui/icons-material/InsertChart";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { Link, useLocation } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import { toast } from "react-hot-toast";
import { BeachAccessOutlined, HotelOutlined, NoFoodRounded, RestaurantMenuOutlined } from "@mui/icons-material";
const Sidebar = () => {
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    setProgress(100);

    const delay = setTimeout(() => {
      setProgress(0);
    }, 2000);

    return () => clearTimeout(delay);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");

    toast.success("Logged out successfully");

    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };
  // const handleLogout = () => {
  //   localStorage.removeItem("user");
  //   toast.success("Logged out Successfully")
  //   window.location.reload();
  // };

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Admin Dashboard</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          {/* <p className="title">MAIN</p>
          <li>
            <DashboardIcon className="icon" />
            <span>Dashboard</span>
          </li> */}
          <p className="title">DASHBOARD</p>
          <Link to="/users" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineOutlinedIcon className="icon" />
              <span>Users</span>
            </li>
          </Link>
          {/* <Link to="/products" style={{ textDecoration: "none" }}>
            <li>
              <InventoryOutlinedIcon className="icon" />
              <span>Products</span>
            </li>
          </Link> */}
          <Link to="/guide" style={{ textDecoration: "none" }}>
            <li>
              <MenuBookIcon className="icon" />
              <span>Share Story</span>
            </li>
          </Link>
          <Link to="/orders" style={{ textDecoration: "none" }}>
            <li>
              <RestaurantMenuOutlined className="icon" />
              <span>Kuliner</span>
            </li>
          </Link>
          <Link to="/marketnearme" style={{ textDecoration: "none" }}>
            <li>
              <HotelOutlined className="icon" />
              <span>Hotel Near me</span>
            </li>
          </Link>
          {/* <Link to="/pricelisting" style={{ textDecoration: "none" }}>
            <li>
              <ListAltIcon className="icon" />
              <span>Kuliner</span>
            </li>
          </Link> */}
          <Link to="/fertilizers" style={{ textDecoration: "none" }}>
            <li>
              <BeachAccessOutlined className="icon" />
              <span>Destination</span>
            </li>
          </Link>

          {/* <Link to="/transportcompany" style={{ textDecoration: "none" }}>
            <li>
              <LocalShippingIcon className="icon" />
              <span>Transport Company</span>
            </li>
          </Link> */}

          <LoadingBar
            color="#725ac5"
            progress={progress}
            onLoaderFinished={() => setProgress(0)}
          />
          <li onClick={handleLogout}>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <LogoutOutlinedIcon className="icon" />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
