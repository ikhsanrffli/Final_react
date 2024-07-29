import React from 'react'
import "./list.scss"
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from "../../components/navbar/Navbar"
import FertilizersDataTable from '../../components/dataTable/FertilizersDataTable'
const FertilizersList = () => {
  return (
    <div className='list'>
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <FertilizersDataTable />
      </div>
    </div>
  )
}

export default FertilizersList
