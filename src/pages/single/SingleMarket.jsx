import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

const SingleMarket = () => {
  const [marketDetails, setMarketDetails] = useState(null);
  const { nearmeId } = useParams();
  console.log(nearmeId);
  useEffect(() => {
    const fetchMarketDetails = async () => {
      try {
        const marketDoc = doc(db, "marketNearMe", nearmeId);
        const marketSnapshot = await getDoc(marketDoc);
        if (marketSnapshot.exists()) {
          const marketData = marketSnapshot.data();
          setMarketDetails(marketData);
        } else {
          // Handle the case where the order doesn't exist
          console.error("Market not found");
        }
      } catch (error) {
        console.error("Error fetching market details:", error);
      }
    };

    fetchMarketDetails();
  }, [nearmeId]);

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
                src={marketDetails ? marketDetails.img : ""}
                alt=""
                className="itemImg"
              /> */}
              <h1 className="title">Hotel Details</h1>
              {marketDetails ? (
                <div className="item">
                  <div className="details">
                    <h1 className="itemTitle">{marketDetails.name}</h1>
                    <div className="detailItem">
                      <span className="itemKey">Address:</span>
                      <span className="itemValue">{marketDetails.address}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Facilities:</span>
                      <span className="itemValue">{marketDetails.facilities}</span>
                    </div>

                    <div className="detailItem">
                      <span className="itemKey">Price:</span>
                      <span className="itemValue">
                        {marketDetails.price}
                      </span>
                    </div>

                    <div className="detailItem">
                      <span className="itemKey">Contact Info:</span>
                      <span className="itemValue">
                        {marketDetails.contactInfo}
                      </span>
                    </div>

                    {/* <div className="detailItem">
                      <span className="itemKey">Latitude:</span>
                      <span className="itemValue">
                        {marketDetails.latitude}
                      </span>
                    </div> */}

                    {/* <div className="detailItem">
                      <span className="itemKey">Longitude:</span>
                      <span className="itemValue">
                        {marketDetails.longitude}
                      </span>
                    </div> */}

                    {/* <div className="detailItem">
                      <span className="itemKey">Available Products:</span>
                      <div className="itemValue">
                        {marketDetails.availableProducts &&
                          Object.entries(marketDetails.availableProducts).map(
                            ([product]) => (
                              <div key={product}>
                                <span>{product}</span> 
                              </div>
                            )
                          )}
                      </div>
                    </div> */}

                    {/* <div className="detailItem">
                      <span className="itemKey">Days of Operation:</span>
                      <div className="itemValue">
                        {marketDetails.daysOfOperation &&
                          Object.entries(marketDetails.daysOfOperation).map(
                            ([day, isOpen]) => (
                              <div key={day}>
                                <span>{day}:</span>{" "}
                                <span>{isOpen ? "Open" : "Closed"}</span>
                              </div>
                            )
                          )}
                      </div>
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

export default SingleMarket;
