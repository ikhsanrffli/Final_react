import React, { useState, useEffect } from "react";
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { toast } from "react-hot-toast";

const OrderDataTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "kuliner"));
        const list = querySnapshot.docs.map((doc, index) => ({
          id: doc.id,
          no: index + 1,
          ...doc.data()
        }));
        setData(list);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "kuliner", id));
      setData(data.filter((item) => item.id !== id));
      toast.success("Kuliner Deleted Successfully");
    } catch (error) {
      toast.error("Kuliner not Deleted");
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
            {/* <Link to={`/kuliner/${params.row.id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link> */}
            <Link to={`/kuliner/update/${params.row.id}`} style={{ textDecoration: "none" }}>
            <div className="viewButton">Update</div>
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

  const columns = [
    { field: 'no', headerName: 'No', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'price', headerName: 'Price', width: 130 },
    { field: 'deskripsi', headerName: 'Deskripsi', width: 300 },
    { field: 'rating', headerName: 'Rating', width: 130 },
    { 
      field: 'imageUrl', 
      headerName: 'Image', 
      width: 150,
      renderCell: (params) => (
        <img 
          src={params.value} 
          alt={params.row.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ),
    },
    ...actionColumn
  ];

  return (
    <div className="dataTable">
      <div className="datatableTitle">
        Kuliner
        <Link to="/kuliner/new" style={{ textDecoration: "none" }} className="link">
  Add New
</Link>
      </div>

      <DataGrid
        rows={data}
        columns={columns}
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

export default OrderDataTable;