import React, { useState } from "react";
import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const NewHotel = () => {
  // State untuk gambar utama hotel
  const [mainFile, setMainFile] = useState(null);
  const [mainPreviewURL, setMainPreviewURL] = useState(null);

  // State untuk gambar tambahan hotel
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [additionalPreviewURLs, setAdditionalPreviewURLs] = useState([]);

  // State untuk data hotel
  const [hotelData, setHotelData] = useState({
    name: "",
    contact: "",
    address: "",
    facilities: [],
    price: "",
  });

  // State untuk kamar-kamar hotel
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState({
    type: "",
    pricePerNight: "",
    available: true,
    facilities: [],
    image: null,
  });

  // State untuk error dan UI
  const [errors, setErrors] = useState({});
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [currentFacility, setCurrentFacility] = useState("");
  const [currentRoomFacility, setCurrentRoomFacility] = useState("");

  const navigate = useNavigate();

// Handler untuk perubahan data hotel
const handleHotelChange = (e) => {
  const { id, value } = e.target;
  if (id === "price") {
    const numValue = value.replace(/^0+/, '').replace(/[^0-9.]/g, '');
    setHotelData({ ...hotelData, [id]: numValue });
  } else {
    setHotelData({ ...hotelData, [id]: value });
  }
  setErrors({ ...errors, [id]: "" });
};

// Handler untuk perubahan gambar utama hotel
const handleMainFileChange = (e) => {
  const selectedFile = e.target.files[0];
  setMainFile(selectedFile);
  setErrors({ ...errors, mainFile: "" });
  
  if (selectedFile) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setMainPreviewURL(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  } else {
    setMainPreviewURL(null);
  }
};

// Handler untuk perubahan gambar tambahan hotel
const handleAdditionalFilesChange = (e) => {
  const selectedFiles = Array.from(e.target.files);
  setAdditionalFiles(selectedFiles);
  setErrors({ ...errors, additionalFiles: "" });
  
  const previewURLs = selectedFiles.map(file => URL.createObjectURL(file));
  setAdditionalPreviewURLs(previewURLs);
};

// Handler untuk menambah fasilitas hotel
const handleAddFacility = () => {
  if (currentFacility.trim()) {
    setHotelData((prev) => ({
      ...prev,
      facilities: [...prev.facilities, currentFacility.trim()],
    }));
    setCurrentFacility("");
  }
};

// Handler untuk menghapus fasilitas hotel
const handleRemoveFacility = (index) => {
  setHotelData((prev) => ({
    ...prev,
    facilities: prev.facilities.filter((_, i) => i !== index),
  }));
};

// Handler untuk perubahan data kamar
const handleRoomChange = (e) => {
  const { id, value, type, checked } = e.target;
  if (id === "pricePerNight") {
    const numValue = value.replace(/[^0-9.]/g, '');
    setCurrentRoom({ ...currentRoom, [id]: numValue });
  } else {
    setCurrentRoom({
      ...currentRoom,
      [id]: type === 'checkbox' ? checked : value.trim()
    });
  }
  setErrors({ ...errors, [id]: "" });
};

// Handler untuk perubahan gambar kamar
const handleRoomImageChange = (e) => {
  const file = e.target.files[0];
  setCurrentRoom(prevRoom => ({
    ...prevRoom,
    image: file
  }));
  setErrors({ ...errors, roomImage: "" });
};

// Handler untuk menambah fasilitas kamar
const handleAddRoomFacility = () => {
  if (currentRoomFacility.trim()) {
    setCurrentRoom(prevRoom => ({
      ...prevRoom,
      facilities: [...prevRoom.facilities, currentRoomFacility.trim()]
    }));
    setCurrentRoomFacility("");
  }
};

// Handler untuk menghapus fasilitas kamar
const handleRemoveRoomFacility = (index) => {
  setCurrentRoom(prevRoom => ({
    ...prevRoom,
    facilities: prevRoom.facilities.filter((_, i) => i !== index)
  }));
};

// Handler untuk menambah kamar
const handleAddRoom = async () => {
  const newErrors = {};
  if (!currentRoom.type.trim()) newErrors.roomType = "Room type is required";
  if (!currentRoom.pricePerNight || isNaN(parseFloat(currentRoom.pricePerNight))) {
    newErrors.roomPrice = "Valid price per night is required";
  }
  if (!currentRoom.image) newErrors.roomImage = "Room image is required";

  if (Object.keys(newErrors).length > 0) {
    setErrors(prev => ({ ...prev, ...newErrors }));
    return;
  }

  try {
    let imageUrl = "";
    if (currentRoom.image) {
      const storageRef = ref(storage, `rooms/${Date.now()}_${currentRoom.image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, currentRoom.image);
      await uploadTask;
      imageUrl = await getDownloadURL(storageRef);
    }

    setRooms([...rooms, { 
      ...currentRoom, 
      pricePerNight: parseFloat(currentRoom.pricePerNight),
      image: imageUrl
    }]);
    setCurrentRoom({
      type: "",
      pricePerNight: "",
      available: true,
      facilities: [],
      image: null,
    });
    setIsAddingRoom(false);
    setErrors({});
  } catch (error) {
    console.error("Error adding room: ", error);
    toast.error("Failed to add room. Please try again.");
  }
};
// Fungsi untuk menambah kamar ke Firestore
const addRoom = async (roomData, hotelId) => {
  if (!roomData.type || roomData.type.trim() === "") {
    throw new Error("Room type is required");
  }
  if (!roomData.pricePerNight || isNaN(parseFloat(roomData.pricePerNight))) {
    throw new Error("Valid price per night is required");
  }

  const roomToAdd = {
    type: roomData.type.trim(),
    pricePerNight: parseFloat(roomData.pricePerNight),
    available: roomData.available ?? true,
    facilities: Array.isArray(roomData.facilities) ? roomData.facilities : [],
    image: roomData.image,
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, "hotels", hotelId, "rooms"), roomToAdd);
};

// Handler untuk submit form
const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = {};

  if (!mainFile) newErrors.mainFile = "Main hotel image is required";
  if (!hotelData.name) newErrors.name = "Name is required";
  if (!hotelData.contact) newErrors.contact = "Contact is required";
  if (!hotelData.address) newErrors.address = "Address is required";
  if (!hotelData.price) newErrors.price = "Price is required";

  if (rooms.length === 0) {
    newErrors.rooms = "At least one room is required";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    let mainFileUrl = "";
    let additionalFileUrls = [];

    if (mainFile) {
      const storageRef = ref(storage, `hotels/${Date.now()}_${mainFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, mainFile);
      await uploadTask;
      mainFileUrl = await getDownloadURL(storageRef);
    }

    if (additionalFiles.length > 0) {
      for (const file of additionalFiles) {
        const storageRef = ref(storage, `hotels/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        await uploadTask;
        const url = await getDownloadURL(storageRef);
        additionalFileUrls.push(url);
      }
    }

    const hotelDocRef = await addDoc(collection(db, "hotels"), {
      ...hotelData,
      price: parseFloat(hotelData.price),
      imageUrl: mainFileUrl,
      imageUrls: additionalFileUrls,
      createdAt: serverTimestamp(),
    });

    for (const room of rooms) {
      try {
        await addRoom(room, hotelDocRef.id);
      } catch (roomError) {
        console.error(`Error adding room: ${roomError.message}`);
        toast.error(`Failed to add room: ${room.type}. ${roomError.message}`);
      }
    }

    toast.success("Hotel and rooms added successfully!");
    navigate("/marketnearme");
  } catch (error) {
    toast.error("Failed to add hotel. Please try again.");
    console.error("Error adding hotel: ", error);
  }
};

// Render komponen
return (
  <div className="new">
    <Sidebar />
    <div className="newContainer">
      <Navbar />
      <div className="top">
        <h1>Add New Hotel</h1>
      </div>
      <div className="bottom">
        <div className="left">
          <img
            src={
              mainPreviewURL
                ? mainPreviewURL
                : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
            }
            alt=""
          />
        </div>
        <div className="right">
          <form onSubmit={handleSubmit}>
            {/* Input untuk gambar utama hotel */}
            <div className="formInput">
              <label htmlFor="mainFile">
                Main Hotel Image: <span style={{color: "red"}}>*</span>
              </label>
              <input
                type="file"
                id="mainFile"
                onChange={handleMainFileChange}
                style={{ border: errors.mainFile ? "1px solid red" : "" }}
              />
              {errors.mainFile && <span className="error">{errors.mainFile}</span>}
            </div>

            {/* Input untuk gambar tambahan hotel */}
            <div className="formInput">
              <label htmlFor="additionalFiles">
                Additional Hotel Images:
              </label>
              <input
                type="file"
                id="additionalFiles"
                multiple
                onChange={handleAdditionalFilesChange}
              />
            </div>

            {/* Input untuk nama hotel */}
            <div className="formInput">
              <label>Name <span style={{color: "red"}}>*</span></label>
              <input
                type="text"
                id="name"
                value={hotelData.name}
                onChange={handleHotelChange}
                style={{ border: errors.name ? "1px solid red" : "" }}
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            {/* Input untuk kontak hotel */}
            <div className="formInput">
              <label>Contact <span style={{color: "red"}}>*</span></label>
              <input
                type="text"
                id="contact"
                value={hotelData.contact}
                onChange={handleHotelChange}
                style={{ border: errors.contact ? "1px solid red" : "" }}
              />
              {errors.contact && <span className="error">{errors.contact}</span>}
            </div>

            {/* Input untuk alamat hotel */}
            <div className="formInput">
              <label>Address <span style={{color: "red"}}>*</span></label>
              <input
                type="text"
                id="address"
                value={hotelData.address}
                onChange={handleHotelChange}
                style={{ border: errors.address ? "1px solid red" : "" }}
              />
              {errors.address && <span className="error">{errors.address}</span>}
            </div>

            {/* Input untuk harga hotel */}
            <div className="formInput">
              <label>Price <span style={{color: "red"}}>*</span></label>
              <input
                type="text"
                id="price"
                value={hotelData.price}
                onChange={handleHotelChange}
                style={{ border: errors.price ? "1px solid red" : "" }}
              />
              {errors.price && <span className="error">{errors.price}</span>}
            </div>

            {/* Input untuk fasilitas hotel */}
            <div className="formInput">
              <label>Hotel Facilities</label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  value={currentFacility}
                  onChange={(e) => setCurrentFacility(e.target.value)}
                />
                <button type="button" onClick={handleAddFacility}>Add</button>
              </div>
              <ul>
                {hotelData.facilities.map((facility, index) => (
                  <li key={index}>
                    {facility}
                    <button type="button" onClick={() => handleRemoveFacility(index)}>Remove</button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Input untuk kamar-kamar hotel */}
            <div className="formInput">
              <label>Rooms</label>
              {rooms.map((room, index) => (
                <div key={index}>
                  <p>Type: {room.type}, Price: {room.pricePerNight}</p>
                </div>
              ))}
              {isAddingRoom ? (
                  <div>
                    <input
                      type="text"
                      placeholder="Room Type"
                      value={currentRoom.type}
                      onChange={(e) => handleRoomChange({ target: { id: "type", value: e.target.value } })}
                      style={{ border: errors.roomType ? "1px solid red" : "" }}
                    />
                    {errors.roomType && <span className="error">{errors.roomType}</span>}
                    <input
                      type="text"
                      placeholder="Price per Night"
                      value={currentRoom.pricePerNight}
                      onChange={(e) => handleRoomChange({ target: { id: "pricePerNight", value: e.target.value } })}
                      style={{ border: errors.roomPrice ? "1px solid red" : "" }}
                    />
                    {errors.roomPrice && <span className="error">{errors.roomPrice}</span>}
                    <div>
                      <input
                        type="file"
                        onChange={handleRoomImageChange}
                        style={{ border: errors.roomImage ? "1px solid red" : "" }}
                      />
                      {errors.roomImage && <span className="error">{errors.roomImage}</span>}
                    </div>
                    <div>
                      <input
                        type="text"
                        value={currentRoomFacility}
                        onChange={(e) => setCurrentRoomFacility(e.target.value)}
                        placeholder="Room Facility"
                      />
                      <button type="button" onClick={handleAddRoomFacility}>Add Facility</button>
                    </div>
                    <ul>
                      {currentRoom.facilities.map((facility, index) => (
                        <li key={index}>
                          {facility}
                          <button type="button" onClick={() => handleRemoveRoomFacility(index)}>Remove</button>
                        </li>
                      ))}
                    </ul>
                    <button type="button" onClick={handleAddRoom}>Add Room</button>
                    <button type="button" onClick={() => setIsAddingRoom(false)}>Cancel</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setIsAddingRoom(true)}>Add New Room</button>
                )}
                {errors.rooms && <span className="error">{errors.rooms}</span>}
              </div>

              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHotel;