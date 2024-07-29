import React, { useEffect, useState } from "react";
import "./new.scss";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast"


const NewFertilizers = ({ fertilizers, title }) => {
  const [file, setFile] = useState("");
  const [data, setData] = useState({
    destinationName: "",
    // productCategory: "",
    location: "",
    // productCompany:"",
    // productPrice: "",
    rating: "",
    // productAvailability: "",
  });
  const [percentage, setPercentage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [dropdownError, setDropdownError] = useState("");
  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
    setErrors({ ...errors, [id]: "" });
  };
  const handleAvailabilityChange = (e) => {
    const value = e.target.value;
    setData({ ...data, productAvailability: value });
    // setErrors({ ...data, productAvailability: "" });
    setDropdownError("");
  };
  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setPercentage(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
            toast.success("Image Uploaded Successfully");
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    // Clear the error when the file is selected
    setErrors({ ...errors, file: "" });
  };
  const handleAdd = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!file) {
      newErrors.file = "Image is required";
    }
    if (!data.destinationName) {
      newErrors.destinationName = "Name is required";
    }
    if (!data.locationD) {
      newErrors.location = "Location is required";
    }
    // if (!data.productCompany) {
    //   newErrors.productCompany = "Description is required";
    // }

    // if (!data.productCategory) {
    //   newErrors.productCategory = "Category is required";
    // }
    // if (!data.productPrice) {
    //   newErrors.productPrice = "Price is required";
    // }
    if (!data.rating) {
      newErrors.rating = "Rating is required";
    }
    // if (!data.productAvailability) {
    //   newErrors.productAvailability = "Availability is required";
    // }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const res = await addDoc(collection(db, "fertilizers"), {
        ...data,
        timeStamp: serverTimestamp(),
      });
      toast.success("Destination Added Successfully")
      navigate(-1);
    } catch (error) {
      toast.error("Destination not Added")
    }
  };
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>

        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form onSubmit={handleAdd}>
              <div className="formInput">
                <label htmlFor="file">
                  Image:
                  <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                {errors.file && <span className="error">{errors.file}</span>}
              </div>
              {fertilizers.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleChange}
                  />
                  {errors[input.id] && <span className="error">{errors[input.id]}</span>}
                </div>
              ))}
              {/* <div className="formInput">
                <label>Product Price</label>
                <input
                  type="number"
                  id="productPrice"
                  placeholder="Enter Product Price"
                  onChange={handleChange}
                  min="0"
                />
                {errors.productPrice && <span className="error">{errors.productPrice}</span>}
              </div> */}
              <div className="formInput">
                <label>Rating</label>
                <input
                  type="number"
                  id="rating"
                  placeholder="Enter Rating"
                  onChange={handleChange}
                  min="0"
                />
                {errors.rating && <span className="error">{errors.rating}</span>}
              </div>
              {/* <div className="formInput">
                <label>Product Availability</label>
                <select
                  id="productAvailability"
                  onChange={handleAvailabilityChange}
                >
                  <option value="">Select availability</option>
                  <option value="instock">In Stock</option>
                  <option value="outofstock">Out of Stock</option>
                </select>
                {dropdownError && <span className="error">{dropdownError}</span>}
              </div> */}
              
              <button
                disabled={percentage !== null && percentage < 100}
                type="submit"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFertilizers;
