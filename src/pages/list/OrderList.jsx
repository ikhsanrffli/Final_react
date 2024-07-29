import React from 'react'
import "./list.scss"
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from "../../components/navbar/Navbar"
import OrderDataTable from '../../components/dataTable/OrderDataTable'


const OrderList = () => {
  return (
    <div className='list'>
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <OrderDataTable />
      </div>
    </div>
  )
}

export default OrderList
