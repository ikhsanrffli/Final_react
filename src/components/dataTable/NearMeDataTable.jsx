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

const NearMeDataTable = () => {
  const [data, setData] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "hotels"));
        const list = querySnapshot.docs.map((doc, index) => ({
          id: doc.id,
          no: index + 1,
          ...doc.data()
        }));
        setData(list);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch hotels");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "hotels", id));
      setData(data.filter((item) => item.id !== id));
      toast.success("Hotel Deleted Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Hotel not Deleted");
    }
  };



  const fetchRooms = async (hotelId) => {
    setLoading(true);
    try {
      const roomsSnapshot = await getDocs(collection(db, "hotels", hotelId, "rooms"));
      const roomsList = roomsSnapshot.docs.map((doc) => {
        const data = doc.data();
        console.log("Room data:", data); // Debug log
        return {
          id: doc.id,
          ...data,
          imageUrl: data.imageUrl || null // Ensure imageUrl always exists
        };
      });
      setRooms(roomsList);
      setSelectedHotel(hotelId);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch rooms");
      setLoading(false);
    }
  };

  const handleRoomDelete = async (hotelId, roomId) => {
    try {
      await deleteDoc(doc(db, "hotels", hotelId, "rooms", roomId));
      setRooms(rooms.filter((room) => room.id !== roomId));
      toast.success("Room Deleted Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete room");
    }
  };

  const handleRoomUpdate = (hotelId, roomId) => {
    toast.info(`Updating room ${roomId} for hotel ${hotelId}`);
    // Implement room update logic here
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/hotels/update/${params.row.id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">Update</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
            <div
              className="viewButton"
              onClick={() => fetchRooms(params.row.id)}
            >
              Rooms
            </div>
          </div>
        );
      },
    },
  ];
  

  const columns = [
    { field: 'no', headerName: 'No', width: 70 },
    { field: 'name', headerName: 'Nama', width: 200 },
    { field: 'contact', headerName: 'Contact', width: 150 },
    { field: 'address', headerName: 'Address', width: 200 },
    { field: 'facilities', headerName: 'Facilities', width: 200 },
    { 
      field: 'imageUrl', 
      headerName: 'Image', 
      width: 100,
      renderCell: (params) => (
        <img 
          src={params.value} 
          alt={params.row.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ),
    },
    { field: 'price', headerName: 'Price', width: 130 },
    ...actionColumn
  ];

  const roomActionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="viewButton"
              onClick={() => handleRoomUpdate(selectedHotel, params.row.id)}
            >
              Update
            </div>
            <div
              className="deleteButton"
              onClick={() => handleRoomDelete(selectedHotel, params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  const roomColumns = [
    { field: 'available', headerName: 'Available', width: 100, type: 'boolean' },
    { field: 'facilities', headerName: 'Facilities', width: 200 },
    { 
      field: 'imageUrl', 
      headerName: 'Image', 
      width: 100,
      renderCell: (params) => {
        console.log("Room image URL:", params.value); // Debug log
        return params.value ? (
          <img 
            src={params.value} 
            alt="Room"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span>No image</span>
        );
      },
    },
    { field: 'pricePerNight', headerName: 'Price Per Night', width: 150 },
    { field: 'type', headerName: 'Type', width: 150 },
    ...roomActionColumn
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dataTable">
      <div className="datatableTitle">
        Hotels Near Me
        <Link to="/hotels/new" style={{ textDecoration: "none" }} className="link">
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

      {selectedHotel && (
        <div className="roomsTable">
          <h2>Rooms for {data.find(hotel => hotel.id === selectedHotel)?.name}</h2>
          <DataGrid
            rows={rooms}
            columns={roomColumns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        </div>
      )}
    </div>
  );
};

export default NearMeDataTable;