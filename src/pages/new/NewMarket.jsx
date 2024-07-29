import React, { useEffect, useState } from "react";
import "./new.scss";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const NewMarket = ({ market, title }) => {
  const [file, setFile] = useState("");
  const [data, setData] = useState({
    name: "",
    address: "",
    facilities: "",
    latitude: "",
    longitude: "",
    price: "",
    contactInfo: "",
  });
  const [percentage, setPercentage] = useState(null);
  const [daysOfOperation, setDaysOfOperation] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [availableProducts, setAvailableProducts] = useState({
    fruits: false,
    vegetables: false,
    grains : false
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
    setErrors({ ...errors, [id]: "" });
  };

  // const handleCheckboxChange = (e) => {
  //   const checkboxId = e.target.id;
  //   const isChecked = e.target.checked;
  //   setDaysOfOperation((prevDays) => ({
  //     ...prevDays,
  //     [checkboxId]: isChecked,
  //   }));
  //   setErrors({ ...errors, [checkboxId]: "" });
  // };
  const handleCheckboxChange = (e) => {
    const checkboxId = e.target.id;
    const isChecked = e.target.checked;
    setDaysOfOperation((prevDays) => ({
      ...prevDays,
      [checkboxId]: isChecked,
    }));
    if (Object.values(daysOfOperation).some((value) => value)) {
      setErrors({ ...errors, daysOfOperation: "" });
    } else {
      setErrors({
        ...errors,
        daysOfOperation: "Please select at least one day of operation",
      });
    }
  };

  // const handleAvailableProductsChange = (e) => {
  //   const product = e.target.id;
  //   const isChecked = e.target.checked;
  //   setAvailableProducts((prevProducts) => ({
  //     ...prevProducts,
  //     [product]: isChecked,
  //   }));
  //   setErrors({ ...errors, [product]: "" });
  // };

  const handleAvailableProductsChange = (e) => {
    const product = e.target.id;
    const isChecked = e.target.checked;
    setAvailableProducts((prevProducts) => ({
      ...prevProducts,
      [product]: isChecked,
    }));

    // Clear the error for "Available Products" if at least one checkbox is checked
    if (availableProducts.fruits || availableProducts.vegetables || availableProducts.grains) {
      setErrors({ ...errors, availableProducts: "" });
    } else {
      setErrors({
        ...errors,
        availableProducts: "Please select at least one available product",
      });
    }
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
    // if (!file) {
    //   newErrors.file = "Image is required";
    // }
    if (!data.name) {
      newErrors.name = "Hotel Name is required";
    }
    if (!data.address) {
      newErrors.address = "Address is required";
    }
    if (!data.facilities) {
      newErrors.facilities = "Facilities is required";
    }
    // if (!data.latitude) {
    //   newErrors.latitude = "Latitude is required";
    // }
    // if (!data.longitude) {
    //   newErrors.longitude = "Longitude is required";
    // }
    if (!data.price) {
      newErrors.price = "Price Hours is required";
    }
    if (!data.contactInfo) {
      newErrors.contactInfo = "Contact is required";
    }

    // if (!Object.values(daysOfOperation).some((value) => value)) {
    //   newErrors.daysOfOperation = "Please select at least one day of operation";
    // }
    // if (!Object.values(availableProducts).some((value) => value)) {
    //   newErrors.availableProducts = "Please select at least one available product";
    // }
    

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const newData = { ...data, daysOfOperation, availableProducts };
    try {
      const res = await addDoc(collection(db, "marketNearMe"), {
        ...newData,
        timeStamp: serverTimestamp(),
      });
      toast.success("New Hotel Added Successfully");
      navigate(-1);
    } catch (error) {
      toast.error("New Hotel not Added");
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
          {/* <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div> */}
          <div className="right">
            <form onSubmit={handleAdd}>
              {/* <div className="formInput">
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
              </div> */}
              {market.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleChange}
                  />
                  {errors[input.id] && (
                    <span className="error">{errors[input.id]}</span>
                  )}
                </div>
              ))}

              {/* <div className="formInput">
                <label>Longitude</label>
                <input
                  type="number"
                  step="any"
                  id="longitude"
                  placeholder="Longitude"
                  onChange={handleChange}
                />
                {errors.longitude && (
                  <span className="error">{errors.longitude}</span>
                )}
              </div> */}
              {/* <div className="formInput">
                <label>Latitude</label>
                <input
                  type="number"
                  step="any"
                  id="latitude"
                  placeholder="Latitude"
                  onChange={handleChange}
                />
                {errors.latitude && (
                  <span className="error">{errors.latitude}</span>
                )}
              </div> */}
              {/* <div className="formInput">
                <label>Days of Operation:</label>
                <div className="checkboxes">
                  {Object.keys(daysOfOperation).map((day) => (
                    <label key={day} htmlFor={day}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}:
                      <input
                        type="checkbox"
                        id={day}
                        checked={daysOfOperation[day]}
                        onChange={handleCheckboxChange}
                      />
                    </label>
                  ))}
                  {errors.daysOfOperation && (
                    <span className="error">{errors.daysOfOperation}</span>
                  )}
                </div>
              </div> */}
              {/* <div className="formInput">
                <label>Available Products:</label>
                <div className="checkboxes">
                  <label htmlFor="fruits">
                    Fruits:
                    <input
                      type="checkbox"
                      id="fruits"
                      checked={availableProducts.fruits}
                      onChange={handleAvailableProductsChange}
                    />
                  </label>
                  <label htmlFor="vegetables">
                    Vegetables:
                    <input
                      type="checkbox"
                      id="vegetables"
                      checked={availableProducts.vegetables}
                      onChange={handleAvailableProductsChange}
                    />
                  </label>
                  <label htmlFor="grains">
                    Grains:
                    <input
                      type="checkbox"
                      id="grains"
                      checked={availableProducts.grains}
                      onChange={handleAvailableProductsChange}
                    />
                  </label>
                  {errors.availableProducts && (
                    <span className="error">{errors.availableProducts}</span>
                  )}
                </div>
              </div> */}
              <button
                disabled={percentage !== null && percentage < 100}
                type="submit" id="submit"
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

export default NewMarket;

// import React, { useEffect, useState } from "react";
// import "./new.scss";
// import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
// import Sidebar from "../../components/sidebar/Sidebar";
// import Navbar from "../../components/navbar/Navbar";
// import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// import { db, storage } from "../../firebase";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { useNavigate } from "react-router-dom";

// const NewMarket = ({ market, title }) => {
//   const [file, setFile] = useState("");
//   const [data, setData] = useState({});
//   const [percentage, setPercentage] = useState(null);
//   const navigate = useNavigate();
//   const handleChange = (e) => {
//     const id = e.target.id;
//     const value = e.target.value;
//     setData({ ...data, [id]: value });
//   };
//   useEffect(() => {
//     const uploadFile = () => {
//       const name = new Date().getTime() + file.name;
//       const storageRef = ref(storage, file.name);
//       const uploadTask = uploadBytesResumable(storageRef, file);
//       uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//           const progress =
//             (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           console.log("Upload is " + progress + "% done");
//           setPercentage(progress);
//           switch (snapshot.state) {
//             case "paused":
//               console.log("Upload is paused");
//               break;
//             case "running":
//               console.log("Upload is running");
//               break;
//           }
//         },
//         (error) => {
//           console.log(error);
//         },
//         () => {
//           getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//             setData((prev) => ({ ...prev, img: downloadURL }));
//           });
//         }
//       );
//     };
//     file && uploadFile();
//   }, [file]);
//   const handleAdd = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await addDoc(collection(db, "guide"), {
//         ...data,
//         timeStamp: serverTimestamp(),
//       });
//       navigate(-1);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   return (
//     <div className="new">
//       <Sidebar />
//       <div className="newContainer">
//         <Navbar />
//         <div className="top">
//           <h1>{title}</h1>
//         </div>

//         <div className="bottom">
//           <div className="left">
//             <img
//               src={
//                 file
//                   ? URL.createObjectURL(file)
//                   : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
//               }
//               alt=""
//             />
//           </div>
//           <div className="right">
//             <form onSubmit={handleAdd}>
//               <div className="formInput">
//                 <label htmlFor="file">
//                   Image:
//                   <DriveFolderUploadOutlinedIcon className="icon" />
//                 </label>
//                 <input
//                   type="file"
//                   id="file"
//                   onChange={(e) => setFile(e.target.files[0])}
//                   style={{ display: "none" }}
//                 />
//               </div>
//               {market.map((input) => (
//                 <div className="formInput" key={input.id}>
//                   <label>{input.label}</label>
//                   <input
//                     id={input.id}
//                     type={input.type}
//                     placeholder={input.placeholder}
//                     onChange={handleChange}
//                   />

//                 </div>

//               ))}
//               <button
//                 disabled={percentage !== null && percentage < 100}
//                 type="submit"
//               >
//                 Send
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewMarket;
