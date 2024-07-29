import React from "react";
import "./home.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
// import Widget from "../../widgets/Widget";
// import Featured from "../../components/featured/Featured";
// import Chart from "../../components/chart/Chart";
// import Table from "../../components/table/Table";
import Datatable from "../../components/dataTable/Datatable";
const Home = () => {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        {/* <div className="widgets">
          <Widget type="user" />
          <Widget type="order" />
          <Widget type="earning" />
          <Widget type="balance" />
        </div> */}
        <Datatable />
        <div className="charts">
          {/* <Featured /> */}
          {/* <Chart title="Last 6 Months Revenue" aspect={2/1} /> */}
          {/* <Chart title="Last 6 Months Revenue" aspect={2/1} /> */}
        </div>
        <div className="listContainer">
          {/* <div className="listTitle">Latest Transcation</div> */}
          {/* <Table /> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
