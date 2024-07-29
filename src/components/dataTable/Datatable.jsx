import React, { useEffect, useState } from "react";
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
// import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-hot-toast";

const Datatable = () => {
  const [data, setData] = useState([]);

  const userColumns = [
    { field: "no", headerName: "No", width: 70 },
    { field: "username", headerName: "Nama", width: 230 },
    { field: "email", headerName: "Email", width: 230 },
    { field: "phone", headerName: "Phone", width: 200 },
  ];

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const list = querySnapshot.docs.map((doc, index) => ({
        id: doc.id,
        no: index + 1,
        username: doc.data().username || '',
        email: doc.data().email || '',
        phone: doc.data().phone || '',
      }));
      setData(list);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      const updatedData = data
        .filter((item) => item.id !== id)
        .map((item, index) => ({ ...item, no: index + 1 }));
      setData(updatedData);
      toast.success("User Deleted Successfully");
    } catch (error) {
      toast.error("User not Deleted");
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
            {/* <Link to={`/users/${params.row.id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link> */}
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
        All Users
      </div>
      <DataGrid
        rows={data}
        columns={userColumns.concat(actionColumn)}
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

export default Datatable;