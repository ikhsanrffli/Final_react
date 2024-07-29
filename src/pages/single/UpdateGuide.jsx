import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import Sidebar from "../../components/sidebar/Sidebar";
import "../new/new.scss";
import Navbar from "../../components/navbar/Navbar";
import GuideDataTable from "../../components/dataTable/GuideDataTable";
import { useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast"

const UpdateGuide = () => {
  const [file, setFile] = useState("");
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const [percentage, setPercentage] = useState(null);
  const { guideId } = useParams(); // Get the guide ID from the URL
  const [guideData, setGuideData] = useState({
    title: "",
    content: "",
    category: "",
    img: "",
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
              setData({ img: downloadURL }); 
              toast.success("Image Uplaoded Successfully")
            });
          }
        );
      }
    };

    uploadFile();
  }, [file]);

  useEffect(() => {
    const fetchGuideData = async () => {
      try {
        const guideDoc = await getDoc(doc(db, "guide", guideId));
        if (guideDoc.exists()) {
          const data = guideDoc.data();
          setGuideData(data); 
        } else {
          toast.error("Guide not Found")
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchGuideData(); 
  }, [guideId]);
  

  const handleUpdate = async () => {
    try {
      if (data.img) {
        guideData.img = data.img;
      }
      await updateDoc(doc(db, "guide", guideId), guideData);
      toast.success("Cultivation Guide Updated Successfully" , {
        duration : 2000
      })
      navigate(-1);
      console.log("Guide updated successfully!");
    } catch (error) {
      toast.error("Error in Updating Guide")
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Update Guide</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                data.img ||
                guideData.img ||
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
                <label>Title</label>
                <input
                  type="text"
                  value={guideData.title}
                  onChange={(e) =>
                    setGuideData({ ...guideData, title: e.target.value })
                  }
                  placeholder="Title"
                />
              </div>
              <div className="formInput">
                <label>Content</label>
                <textarea
                  value={guideData.content}
                  onChange={(e) =>
                    setGuideData({ ...guideData, content: e.target.value })
                  }
                  placeholder="Content"
                />
              </div>
              <div className="formInput">
                <label>Category</label>
                <input
                  type="text"
                  value={guideData.category}
                  onChange={(e) =>
                    setGuideData({ ...guideData, category: e.target.value })
                  }
                  placeholder="Category"
                />
              </div>
              <button
                disabled={percentage !== null && percentage < 100}
                type="button"
                onClick={handleUpdate}
              >
                Update Guide
              </button>
            </form>
          </div>
        </div>
        <GuideDataTable />
      </div>
    </div>
  );
};

export default UpdateGuide;

