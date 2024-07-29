import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

const SingleUser = () => {
  const [userDetails, setUserDetails] = useState(null);
  const { userId } = useParams();
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const userDoc = doc(db, "UserCollection", userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUserDetails(userData);
        } else {
          // Handle the case where the order doesn't exist
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error fetching User details:", error);
      }
    };

    fetchOrderDetails();
  }, [userId]);

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="item">
              <img
                src={userDetails ? userDetails.profileImage : ""}
                alt=""
                className="itemImg"
              />
              <h1 className="title">User Details</h1>
              {userDetails ? (
                <div className="item">
                  <div className="details">
                    <h1 className="itemTitle">{userDetails.fullName}</h1>
                    <div className="detailItem">
                      <span className="itemKey">Email:</span>
                      <span className="itemValue">{userDetails.email}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">User Name:</span>
                      <span className="itemValue">{userDetails.userName}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">CNIC:</span>
                      <span className="itemValue">{userDetails.cnic}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Phone:</span>
                      <span className="itemValue">{userDetails.phone}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Role:</span>
                      <span className="itemValue">{userDetails.role}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p>Loading order details...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleUser;
