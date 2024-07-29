import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import Sidebar from "../../components/sidebar/Sidebar";
import "../new/new.scss";
import Navbar from "../../components/navbar/Navbar";
import NearMeDataTable from "../../components/dataTable/NearMeDataTable";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UpdateMarket = () => {
  const [file, setFile] = useState("");
  const [data, setData] = useState({});
  const [percentage, setPercentage] = useState(null);
  const { nearmeId } = useParams();
  const [marketData, setMarketData] = useState({
    name: "",
    address: "",
    facilities: "",
    // latitude: "",
    // longitude: "",
    price: "",
    contactInfo: "",
    img: "",
    daysOfOperation: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    availableProducts: {
      fruits: false,
      vegetables: false,
      grains:false
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    const uploadFile = () => {
      if (file) {
        const name = new Date().getTime() + file.name;
        const storageRef = ref(storage, name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            setPercentage(progress);
          },
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setData({ img: downloadURL });
              toast.success("Image Uploaded Successfully");
            });
          }
        );
      }
    };

    uploadFile();
  }, [file]);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const guideDoc = await getDoc(doc(db, "marketNearMe", nearmeId));
        if (guideDoc.exists()) {
          const data = guideDoc.data();
          setMarketData(data);
        } else {
          console.log("Market not found.");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchMarketData();
  }, [nearmeId]);

  const handleUpdate = async () => {
    try {
      if (data.img) {
        marketData.img = data.img;
      }
      await updateDoc(doc(db, "marketNearMe", nearmeId), marketData);
      toast.success("Market Data Updated Successfully");
      navigate(-1);
    } catch (error) {
      toast.error("Market data not Updated");
    }
  };

  // Checkbox change handlers
  const handleDaysOfOperationChange = (day) => {
    setMarketData({
      ...marketData,
      daysOfOperation: {
        ...marketData.daysOfOperation,
        [day]: !marketData.daysOfOperation[day],
      },
    });
  };

  const handleAvailableProductsChange = (product) => {
    setMarketData({
      ...marketData,
      availableProducts: {
        ...marketData.availableProducts,
        [product]: !marketData.availableProducts[product],
      },
    });
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Update Hotel</h1>
        </div>
        <div className="bottom">
          {/* <div className="left">
            <img
              src={
                data.img ||
                marketData.img ||
                "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div> */}
          <div className="right">
            <form>
              {/* <div className="formInput">
                <label htmlFor="file">
                  Image:
                  <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div> */}
              <div className="formInput">
                <label>Name</label>
                <input
                  type="text"
                  value={marketData.name}
                  onChange={(e) =>
                    setMarketData({ ...marketData, name: e.target.value })
                  }
                  placeholder="Name"
                />
              </div>
              <div className="formInput">
                <label>Address</label>
                <input
                  type="text"
                  value={marketData.address}
                  onChange={(e) =>
                    setMarketData({ ...marketData, address: e.target.value })
                  }
                  placeholder="Address"
                />
              </div>
              <div className="formInput">
                <label>Facilities</label>
                <input
                  type="text"
                  value={marketData.facilities}
                  onChange={(e) =>
                    setMarketData({ ...marketData, facilities: e.target.value })
                  }
                  placeholder="Facilities"
                />
              </div>

              <div className="formInput">
                <label>Price</label>
                <input
                  type="text"
                  value={marketData.price}
                  onChange={(e) =>
                    setMarketData({
                      ...marketData,
                      price: e.target.value,
                    })
                  }
                  placeholder="Price"
                />
              </div>
              <div className="formInput">
                <label>Contact Info</label>
                <input
                  type="text"
                  value={marketData.contactInfo}
                  onChange={(e) =>
                    setMarketData({
                      ...marketData,
                      contactInfo: e.target.value,
                    })
                  }
                  placeholder="Enter Contact"
                />
              </div>
              {/* <div className="formInput">
                <label>Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={marketData.latitude}
                  onChange={(e) =>
                    setMarketData({ ...marketData, latitude: e.target.value })
                  }
                  placeholder="Latitude"
                />
              </div> */}
              {/* <div className="formInput">
                <label>Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={marketData.longitude}
                  onChange={(e) =>
                    setMarketData({ ...marketData, longitude: e.target.value })
                  }
                  placeholder="Longitude"
                />
              </div> */}
              {/* <div className="formInput">
                <label>Days of Operation:</label>
                <div className="checkboxes">
                  {Object.keys(marketData.daysOfOperation).map((day) => (
                    <label key={day} htmlFor={day}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}:
                      <input
                        type="checkbox"
                        id={day}
                        checked={marketData.daysOfOperation[day]}
                        onChange={() => handleDaysOfOperationChange(day)}
                      />
                    </label>
                  ))}
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
                      checked={marketData.availableProducts.fruits}
                      onChange={() => handleAvailableProductsChange("fruits")}
                    />
                  </label>
                  <label htmlFor="vegetables">
                    Vegetables:
                    <input
                      type="checkbox"
                      id="vegetables"
                      checked={marketData.availableProducts.vegetables}
                      onChange={() =>
                        handleAvailableProductsChange("vegetables")
                      }
                    />
                  </label>
                  <label htmlFor="grains">
                    Grains:
                    <input
                      type="checkbox"
                      id="grains"
                      checked={marketData.availableProducts.grains}
                      onChange={() => handleAvailableProductsChange("grains")}
                    />
                  </label>
                </div>
              </div> */}
              <button
                disabled={percentage !== null && percentage < 100}
                type="button"
                onClick={handleUpdate}
              >
                Update Market
              </button>
            </form>
          </div>
        </div>
        <NearMeDataTable />
      </div>
    </div>
  );
};

export default UpdateMarket;
