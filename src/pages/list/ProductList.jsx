import React from 'react'
import "./list.scss"
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from "../../components/navbar/Navbar"
import ProductDataTable from '../../components/dataTable/ProductDataTable'
// import Datatable from '../../components/dataTable/Datatable'

const ProductList = () => {
  return (
    <div className='list'>
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <ProductDataTable />
      </div>
    </div>
  )
}

export default ProductList
