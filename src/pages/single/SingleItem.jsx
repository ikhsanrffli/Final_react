import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ProductDataTable from "../../components/dataTable/ProductDataTable"

const SingleItem = () => {
  const [productDetails, setProductDetails] = useState(null);
  const { productId } = useParams();
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productDoc = doc(db, "FarmerProducts", productId);
        const productSnapshot = await getDoc(productDoc);
        if (productSnapshot.exists()) {
          const productData = productSnapshot.data();
          setProductDetails(productData);
        } else {
          // Handle the case where the order doesn't exist
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching Product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

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
                src={productDetails ? productDetails.productImages : ""}
                alt=""
                className="itemImg"
              />
            <h1 className="title">Product Details</h1>
            {productDetails ? (
              <div className="item">
                <div className="details">
                  <h1 className="itemTitle">{productDetails.productName}</h1>
                  <div className="detailItem">
                    <span className="itemKey">User ID:</span>
                    <span className="itemValue">{productDetails.userId}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Price:</span>
                    <span className="itemValue">{productDetails.productPrice}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Quantity:</span>
                    <span className="itemValue">{productDetails.productQuantity}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Address:</span>
                    <span className="itemValue">{productDetails.productAddress}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Description:</span>
                    <span className="itemValue">{productDetails.productDescription}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Category:</span>
                    <span className="itemValue">{productDetails.productCategory}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Availability:</span>
                    <span className="itemValue">{productDetails.productAvailability}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Contact:</span>
                    <span className="itemValue">{productDetails.contactDetail}</span>
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

export default SingleItem;
