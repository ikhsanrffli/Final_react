import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

const SinglePriceListing = () => {
  const [priceDetails, setPriceDetails] = useState(null);
  const { pricelistingId } = useParams();
  console.log(pricelistingId)
  useEffect(() => {
    const fetchPriceDetails = async () => {
      try {
        const priceDoc = doc(db, "priceListing", pricelistingId);
        const priceSnapshot = await getDoc(priceDoc);
        if (priceSnapshot.exists()) {
          const priceData = priceSnapshot.data();
          setPriceDetails(priceData);
        } else {
          // Handle the case where the order doesn't exist
          console.error("Price not found");
        }
      } catch (error) {
        console.error("Error fetching Price details:", error);
      }
    };

    fetchPriceDetails();
  }, [pricelistingId]);

  //   const updateOrderStatus = async (orderId, newStatus) => {
  //     try {
  //       const orderDoc = doc(db, "Orders", orderId);
  //       await updateDoc(orderDoc, {
  //         "paymentIntent.status": newStatus,
  //       });
  //     } catch (error) {
  //       console.error("Error updating order status:", error);

  //     }
  //   };

  //   const markOrderAsComplete = async () => {
  //     try {
  //       // Update the order status in Firestore
  //       await updateOrderStatus(ordersId, "Completed");

  //       // Update the order status in the local state
  //       setOrderDetails((prevOrderDetails) => ({
  //         ...prevOrderDetails,
  //         paymentIntent: {
  //           ...prevOrderDetails.paymentIntent,
  //           status: "completed",
  //         },
  //       }));
  //     } catch (error) {
  //       console.error("Error marking the order as complete:", error);
  //     }
  //   };

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
          <div className="item">
              {/* <img
                src={guideDetails ? guideDetails.img : ""}
                alt=""
                className="itemImg"
              /> */}
            <h1 className="title">Price Listing Details</h1>
            {priceDetails ? (
              <div className="item">
                <div className="details">
                  <h1 className="itemTitle">{priceDetails.name}</h1>
                  <div className="detailItem">
                    <span className="itemKey">Category:</span>
                    <span className="itemValue">{priceDetails.category}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Day:</span>
                    <span className="itemValue">{priceDetails.day}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Season:</span>
                    <span className="itemValue">{priceDetails.season}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Minimum Price:</span>
                    <span className="itemValue">{priceDetails.minPrice}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Maximum Price:</span>
                    <span className="itemValue">{priceDetails.maxPrice}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Average Price:</span>
                    <span className="itemValue">{priceDetails.avgPrice}</span>
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

export default SinglePriceListing;
