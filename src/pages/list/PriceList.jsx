import React from 'react'
import "./list.scss"
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from "../../components/navbar/Navbar"
import FertilizersDataTable from '../../components/dataTable/FertilizersDataTable'
import PriceDataTable from '../../components/dataTable/PriceDataTable'
const PriceList = () => {
  return (
    <div className='list'>
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <PriceDataTable />
      </div>
    </div>
  )
}

export default PriceList

