import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart"
import "./single.scss";
import List from "../../components/table/Table";

const Single = () => {
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title">Information</h1>
            <div className="item">
              <img
                src="https://images.pexels.com/photos/15063254/pexels-photo-15063254/free-photo-of-close-up-of-fruits-on-a-bowl.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                alt=""
                className="itemImg"
              />

              <div className="details">
                <h1 className="itemTitle">Shahzaib</h1>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">shahzaibjameel5@gmail.com</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">12345678951</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Address:</span>
                  <span className="itemValue">asdfghkkljkhhjhj</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Country:</span>
                  <span className="itemValue">Pakistan</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <Chart aspect={3 / 1} title ="User Spending last 6 Months" />
          </div>
        </div>
        <div className="bottom">
        <h1 className="title">last Transcation</h1>
          <List />
        </div>
      </div>
    </div>
  );
};

export default Single;
