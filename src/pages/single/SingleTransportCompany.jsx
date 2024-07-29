import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

const SingleTransportCompany = () => {
  const [transportDetails, setTransportDetails] = useState(null);
  const { transportcompanyId } = useParams();
  useEffect(() => {
    const fetchTrasnportDetails = async () => {
      try {
        const transportDoc = doc(db, "TransportCompany", transportcompanyId);
        const transportSnapshot = await getDoc(transportDoc);
        if (transportSnapshot.exists()) {
          const transportData = transportSnapshot.data();
          setTransportDetails(transportData);
        } else {
          console.error("Transport Company not found");
        }
      } catch (error) {
        console.error("Error fetching transport details:", error);
      }
    };

    fetchTrasnportDetails();
  }, [transportcompanyId]);

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="item">
              <img
                src={transportDetails ? transportDetails.image : ""}
                alt=""
                className="itemImg"
              />
              <h1 className="title">Transport Company Details</h1>
              {transportDetails ? (
                <div className="item">
                  <div className="details">
                    <h1 className="itemTitle">{transportDetails.userName}</h1>
                    <div className="detailItem">
                      <span className="itemKey">Full Name:</span>
                      <span className="itemValue">{transportDetails.fullName}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">License Number:</span>
                      <span className="itemValue">{transportDetails.licenseNumber}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Phone:</span>
                      <span className="itemValue">{transportDetails.phone}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Payment ID:</span>
                      <span className="itemValue">{transportDetails.raastID}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Registeration Number:</span>
                      <span className="itemValue">{transportDetails.registrationNumber}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Role:</span>
                      <span className="itemValue">{transportDetails.role}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Status:</span>
                      <span className="itemValue">{transportDetails.status}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Vehicle:</span>
                      <span className="itemValue">{transportDetails.vehicle}</span>
                    </div>
                    
                  </div>
                </div>
              ) : (
                <p>Loading Transport details...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTransportCompany;
