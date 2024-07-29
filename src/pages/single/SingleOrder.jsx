import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { toast } from "react-hot-toast";

const SingleOrder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    deskripsi: "",
    rating: "",
    imageUrl: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "kuliner"), formData);
      toast.success("Kuliner Added Successfully");
      navigate("/"); // Redirect to the main page or wherever your list is
    } catch (error) {
      console.error("Error adding kuliner:", error);
      toast.error("Failed to add kuliner");
    }
  };

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <h1 className="title">Add New Kuliner</h1>
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="formInput">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="formInput">
                <label>Description</label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="formInput">
                <label>Rating</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="0.1"
                  required
                />
              </div>
              <div className="formInput">
                <label>Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="submitButton">Add Kuliner</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleOrder;