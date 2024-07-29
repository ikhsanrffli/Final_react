import React from 'react'
import "./list.scss"
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from "../../components/navbar/Navbar"
import GuideDataTable from '../../components/dataTable/GuideDataTable'
const GuideList = () => {
  return (
    <div className='list'>
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <GuideDataTable />
      </div>
    </div>
  )
}

export default GuideList
