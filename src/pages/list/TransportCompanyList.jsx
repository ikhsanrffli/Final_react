import React from "react";
import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import TransportCompanyDataTable from "../../components/dataTable/TransportCompanyDataTable";
// import Datatable from '../../components/dataTable/Datatable'

const TransportCompanyList = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <TransportCompanyDataTable />
      </div>
    </div>
  );
};

export default TransportCompanyList;
