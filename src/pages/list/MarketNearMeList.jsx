import React from 'react'
import "./list.scss"
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from "../../components/navbar/Navbar"
import NearMeDataTable from '../../components/dataTable/NearMeDataTable'
const MarketNearMeList = () => {
  return (
    <div className='list'>
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <NearMeDataTable />
      </div>
    </div>
  )
}

export default MarketNearMeList
