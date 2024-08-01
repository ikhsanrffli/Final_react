import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../../firebase";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { toast } from "react-hot-toast";
import "./new.scss";

const UpdateHotel = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const [percentage, setPercentage] = useState(null);
  const { hotelId } = useParams();
  const [hotelData, setHotelData] = useState({
    name: "",
    contact: "",
    address: "",
    facilities: "",
    price: "",
    imageUrl: "",
    rating: 0,
    reviews: [],
  });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHotelData = useCallback(async () => {
    try {
      setLoading(true);
      const hotelDoc = await getDoc(doc(db, "hotels", hotelId));
      if (hotelDoc.exists()) {
        setHotelData(hotelDoc.data());
      } else {
        throw new Error("Hotel not found");
      }
    } catch (error) {
      console.error("Error fetching hotel data:", error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [hotelId]);

  const fetchRooms = useCallback(async () => {
    try {
      const roomsSnapshot = await getDocs(collection(db, "hotels", hotelId, "rooms"));
      const roomsList = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRooms(roomsList);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to fetch rooms");
    }
  }, [hotelId]);

  useEffect(() => {
    fetchHotelData();
    fetchRooms();
  }, [fetchHotelData, fetchRooms]);

// ... continued from Part 1

useEffect(() => {
    const uploadFile = () => {
      if (!file) return;

      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, `hotelImages/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setPercentage(progress);
        },
        (error) => {
          console.error("Error during upload:", error);
          toast.error("Upload failed: " + error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, imageUrl: downloadURL }));
            toast.success("Image Uploaded Successfully");
          });
        }
      );
    };

    uploadFile();
  }, [file]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHotelData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updateData = { ...hotelData };
      if (data.imageUrl) {
        // Delete old image if exists
        if (hotelData.imageUrl) {
          const oldImageRef = ref(storage, hotelData.imageUrl);
          await deleteObject(oldImageRef);
        }
        updateData.imageUrl = data.imageUrl;
      }
      await updateDoc(doc(db, "hotels", hotelId), updateData);
      toast.success("Hotel Updated Successfully");
      navigate("/hotels");
    } catch (error) {
      console.error("Error updating hotel:", error);
      toast.error("Failed to update hotel: " + error.message);
    } finally {
      setLoading(false);
    }
  };

// ... continued from Part 2

const handleRoomUpdate = async (roomId, updatedData) => {
    try {
      await updateDoc(doc(db, "hotels", hotelId, "rooms", roomId), updatedData);
      toast.success("Room Updated Successfully");
      fetchRooms(); // Refresh rooms data
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error("Failed to update room: " + error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Update Hotel: {hotelData.name}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                data.imageUrl ||
                hotelData.imageUrl ||
                "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form onSubmit={handleUpdate}>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>
              {["name", "contact", "address", "facilities", "price", "rating"].map((field) => (
                <div className="formInput" key={field}>
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type={field === "price" || field === "rating" ? "number" : "text"}
                    name={field}
                    value={hotelData[field]}
                    onChange={handleInputChange}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={loading || (percentage !== null && percentage < 100)}
              >
                {loading ? "Updating..." : "Update Hotel"}
              </button>
            </form>
          </div>
        </div>
        <div className="roomsSection">
          <h2>Hotel Rooms</h2>
          {rooms.map((room) => (
            <div key={room.id} className="roomItem">
              <h3>{room.type}</h3>
              <p>Price: ${room.pricePerNight}</p>
              <p>Available: {room.available ? "Yes" : "No"}</p>
              <button onClick={() => handleRoomUpdate(room.id, { ...room, available: !room.available })}>
                Toggle Availability
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpdateHotel;