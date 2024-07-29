// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
// eslint-disable-next-line no-unused-vars
// import { Link } from "react-router-dom";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { toast } from "react-hot-toast";

const StoriesDataTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "stories"));
        const list = querySnapshot.docs.map((doc, index) => ({
          id: doc.id,
          no: index + 1,
          username: doc.data().username || '',
          caption: doc.data().caption || '',
          images: doc.data().images || [],
        }));
        setData(list);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch stories data");
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "stories", id));
      setData(prevData => {
        const updatedData = prevData.filter((item) => item.id !== id);
        return updatedData.map((item, index) => ({ ...item, no: index + 1 }));
      });
      toast.success("Story Deleted Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Story not Deleted");
    }
  };

  const columns = [
    { field: 'no', headerName: 'No', width: 70 },
    { field: 'username', headerName: 'Username', width: 130 },
    { field: 'caption', headerName: 'Caption', width: 200 },
    { 
      field: 'images', 
      headerName: 'Images', 
      width: 300,
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
          {params.value.map((imageUrl, index) => (
            <img 
              key={index}
              src={imageUrl} 
              alt={`Image ${index + 1}`}
              style={{ width: 50, height: 50, objectFit: 'cover' }}
            />
          ))}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {/* <Link to={`/stories/${params.row.id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <Link to={`/stories/update/${params.row.id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">Update</div>
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
        All Story
        {/* <Link to="/stories/newstory" style={{ textDecoration: "none" }} className="link">
          Add New
        </Link> */}
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

export default StoriesDataTable;