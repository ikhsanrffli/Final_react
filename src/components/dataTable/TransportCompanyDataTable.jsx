import React, { useState, useEffect } from "react";
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { transportColumn } from "../../datatablesource";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {toast} from "react-hot-toast"

const TransportCompanyDataTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "TransportCompany"));
        const list = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(list);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "TransportCompany", id));
      setData(data.filter((item) => item.id !== id));
      toast.success("Product Deleted Successfully")
    } catch (error) {
      toast.error("Product not Deleted")
    }
  };
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/transportcompany/${params.row.id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];
  

  return (
    <div className="dataTable">
      <div className="datatableTitle">
        All Transport Companies
      </div>

      <DataGrid
        rows={data}
        columns={transportColumn.concat(actionColumn)}
        initialState={{
               pagination: {
                       paginationModel: { page: 0, pageSize: 5 },
                     },
                   }}
                   pageSizeOptions={[5, 10]}
      />
    </div>
  );
};

export default TransportCompanyDataTable;


