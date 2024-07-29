import React, { useState } from "react";
import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const NewKuliner = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState({
    name: "",
    price: 0,
    deskripsi: "",
    rating: 0,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ 
      ...data, 
      [id]: id === 'price' || id === 'rating' ? parseFloat(value) || 0 : value 
    });
    setErrors({ ...errors, [id]: "" });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setErrors({ ...errors, file: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!file) newErrors.file = "Image is required";
    if (!data.name) newErrors.name = "Name is required";
    if (data.price <= 0) newErrors.price = "Price must be greater than 0";
    if (!data.deskripsi) newErrors.deskripsi = "Description is required";
    if (data.rating < 0 || data.rating > 5) newErrors.rating = "Rating must be between 0 and 5";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const storageRef = ref(storage, 'kuliner/' + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          // Handle progress
        }, 
        (error) => {
          console.error("Upload failed:", error);
          toast.error("Image upload failed");
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await addDoc(collection(db, "kuliner"), {
              ...data,
              price: data.price,  // Ensure it's stored as a number
              rating: data.rating,  // Ensure it's stored as a number
              imageUrl: downloadURL,
              createdAt: serverTimestamp(),
            });
            toast.success("Kuliner Added Successfully");
            navigate(-1);
          });
        }
      );
    } catch (error) {
      console.error("Error adding kuliner:", error);
      toast.error("Failed to add kuliner");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Kuliner</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={file ? URL.createObjectURL(file) : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
              alt=""
            />
          </div>
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label htmlFor="file">Image: </label>
                <input type="file" id="file" onChange={handleFileChange} />
                {errors.file && <span className="error">{errors.file}</span>}
              </div>
              <div className="formInput">
                <label>Name</label>
                <input type="text" id="name" placeholder="Kuliner name" onChange={handleChange} />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>
              <div className="formInput">
                <label>Price</label>
                <input type="number" id="price" placeholder="Price" onChange={handleChange} step="0.01" min="0" />
                {errors.price && <span className="error">{errors.price}</span>}
              </div>
              <div className="formInput">
                <label>Description</label>
                <textarea id="deskripsi" placeholder="Description" onChange={handleChange}></textarea>
                {errors.deskripsi && <span className="error">{errors.deskripsi}</span>}
              </div>
              <div className="formInput">
                <label>Rating</label>
                <input type="number" id="rating" placeholder="Rating" step="0.1" min="0" max="5" onChange={handleChange} />
                {errors.rating && <span className="error">{errors.rating}</span>}
              </div>
              <button type="submit">Add Kuliner</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewKuliner;