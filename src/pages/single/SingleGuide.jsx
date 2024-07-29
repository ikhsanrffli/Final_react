import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

const SingleGuide = () => {
  const [guideDetails, setGuideDetails] = useState(null);
  const { guideId } = useParams();
  console.log(guideId)
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const guideDoc = doc(db, "guide", guideId);
        const guideSnapshot = await getDoc(guideDoc);
        if (guideSnapshot.exists()) {
          const guideData = guideSnapshot.data();
          setGuideDetails(guideData);
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching Product details:", error);
      }
    };

    fetchProductDetails();
  }, [guideId]);

  
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
          <div className="item">
              <img
                src={guideDetails ? guideDetails.img : ""}
                alt=""
                className="itemImg"
              />
            <h1 className="title">Guide Details</h1>
            {guideDetails ? (
              <div className="item">
                <div className="details">
                  <h1 className="itemTitle">{guideDetails.title}</h1>
                  <div className="detailItem">
                    <span className="itemKey">Category:</span>
                    <span className="itemValue">{guideDetails.category}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Description:</span>
                    <span className="itemValue">{guideDetails.content}</span>
                  </div>
                  
                </div>
                
                
              </div>
            ) : (
              <p>Loading Product details...</p>
            )}
          </div>
        </div>
        
        </div>
      </div>
      
    </div>
  );
};

export default SingleGuide;
