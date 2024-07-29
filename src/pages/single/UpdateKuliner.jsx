import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import Sidebar from "../../components/sidebar/Sidebar";
import "../new/new.scss";
import Navbar from "../../components/navbar/Navbar";
import { toast } from "react-hot-toast";

const UpdateKuliner = () => {
  const [file, setFile] = useState("");
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const [percentage, setPercentage] = useState(null);
  const { kulinerId } = useParams(); // Get the kuliner ID from the URL
  const [kulinerData, setKulinerData] = useState({
    name: "",
    price: "",
    deskripsi: "",
    rating: "",
    imageUrl: "",
  });

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
              setData({ imageUrl: downloadURL }); 
              toast.success("Image Uploaded Successfully")
            });
          }
        );
      }
    };

    uploadFile();
  }, [file]);

  useEffect(() => {
    const fetchKulinerData = async () => {
      try {
        const kulinerDoc = await getDoc(doc(db, "kuliner", kulinerId));
        if (kulinerDoc.exists()) {
          const data = kulinerDoc.data();
          setKulinerData(data); 
        } else {
          toast.error("Kuliner not Found")
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchKulinerData(); 
  }, [kulinerId]);
  
  const handleUpdate = async () => {
    try {
      if (data.imageUrl) {
        kulinerData.imageUrl = data.imageUrl;
      }
      await updateDoc(doc(db, "kuliner", kulinerId), kulinerData);
      toast.success("Kuliner Updated Successfully" , {
        duration : 2000
      })
      navigate(-1);
      console.log("Kuliner updated successfully!");
    } catch (error) {
      toast.error("Error in Updating Kuliner")
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Update Kuliner</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                data.imageUrl ||
                kulinerData.imageUrl ||
                "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
            <div className="formInput">
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
              </div>
              <div className="formInput">
                <label>Name</label>
                <input
                  type="text"
                  value={kulinerData.name}
                  onChange={(e) =>
                    setKulinerData({ ...kulinerData, name: e.target.value })
                  }
                  placeholder="Name"
                />
              </div>
              <div className="formInput">
                <label>Price</label>
                <input
                  type="number"
                  value={kulinerData.price}
                  onChange={(e) =>
                    setKulinerData({ ...kulinerData, price: e.target.value })
                  }
                  placeholder="Price"
                />
              </div>
              <div className="formInput">
                <label>Description</label>
                <textarea
                  value={kulinerData.deskripsi}
                  onChange={(e) =>
                    setKulinerData({ ...kulinerData, deskripsi: e.target.value })
                  }
                  placeholder="Description"
                />
              </div>
              <div className="formInput">
                <label>Rating</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={kulinerData.rating}
                  onChange={(e) =>
                    setKulinerData({ ...kulinerData, rating: e.target.value })
                  }
                  placeholder="Rating"
                />
              </div>
              <button
                disabled={percentage !== null && percentage < 100}
                type="button"
                onClick={handleUpdate}
              >
                Update Kuliner
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateKuliner;