import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

const SingleFertilizer = () => {
  const [fertilizerDetails, setFertilizerDetails] = useState(null);
  const { fertilizersId } = useParams();
  console.log(fertilizersId);
  useEffect(() => {
    const fetchFertilizerDetails = async () => {
      try {
        const fertilizerDoc = doc(db, "fertilizers", fertilizersId);
        const fertilizerSnapshot = await getDoc(fertilizerDoc);
        if (fertilizerSnapshot.exists()) {
          const fertilizerData = fertilizerSnapshot.data();
          setFertilizerDetails(fertilizerData);
        } else {
          // Handle the case where the order doesn't exist
          console.error("Destination not found");
        }
      } catch (error) {
        console.error("Error fetching Destination details:", error);
      }
    };

    fetchFertilizerDetails();
  }, [fertilizersId]);

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
              <img
                src={fertilizerDetails ? fertilizerDetails.img : ""}
                alt=""
                className="itemImg"
              />
              <h1 className="title">Destination Details</h1>
              {fertilizerDetails ? (
                <div className="item">
                  <div className="details">
                    <h1 className="itemTitle">
                      {fertilizerDetails.destinationName}
                    </h1>

                    {/* <div className="detailItem">
                      <span className="itemKey">Category:</span>
                      <span className="itemValue">
                        {fertilizerDetails.productCategory}
                      </span>
                    </div> */}

                    {/* <div className="detailItem">
                      <span className="itemKey">Company:</span>
                      <span className="itemValue">
                        {fertilizerDetails.productCompany}
                      </span>
                    </div> */}

                    <div className="detailItem">
                      <span className="itemKey">Location:</span>
                      <span className="itemValue">
                        {fertilizerDetails.location}
                      </span>
                    </div>

                    {/* <div className="detailItem">
                      <span className="itemKey">Price:</span>
                      <span className="itemValue">
                        {fertilizerDetails.productPrice}
                      </span>
                    </div> */}

                    <div className="detailItem">
                      <span className="itemKey">Rating:</span>
                      <span className="itemValue">
                        {fertilizerDetails.rating}
                      </span>
                    </div>

                    {/* <div className="detailItem">
                      <span className="itemKey">Availability:</span>
                      <span className="itemValue">
                        {fertilizerDetails.productAvailability}
                      </span>
                    </div> */}
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

export default SingleFertilizer;
