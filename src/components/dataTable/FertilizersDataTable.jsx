import React, { useState, useEffect } from "react";
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy
} from "firebase/firestore";
import { toast } from "react-hot-toast";

const HistoryDataTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [historyType, setHistoryType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      let allData = [];
      for (const userDoc of querySnapshot.docs) {
        const userData = userDoc.data();
        const historyQuery = query(
          collection(db, `users/${userDoc.id}/history`),
          orderBy("date", "desc")
        );
        const historySnapshot = await getDocs(historyQuery);
        const userHistory = historySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          userId: userDoc.id,
          email: userData.email
        }));
        
        const latestEntries = userHistory.reduce((acc, current) => {
          const key = `${current.historyType}-${current[`${current.historyType}ID`]}`;
          if (!acc[key] || new Date(current.date) > new Date(acc[key].date)) {
            acc[key] = current;
          }
          return acc;
        }, {});

        allData = [...allData, ...Object.values(latestEntries)];
      }
      setData(allData);
      filterData(allData, historyType, searchTerm, paymentFilter);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filterData = (dataToFilter, type, search, paymentStatus) => {
    let filtered = dataToFilter;

    if (type !== "all") {
      filtered = filtered.filter(item => item.historyType === type);
    }

    if (search) {
      filtered = filtered.filter(item => 
        item.username?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (paymentStatus !== "all") {
      filtered = filtered.filter(item => 
        paymentStatus === "paid" ? item.pay : !item.pay
      );
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    filterData(data, historyType, searchTerm, paymentFilter);
  }, [historyType, data, searchTerm, paymentFilter]);

  const handlePaymentUpdate = async (id, userId) => {
    try {
      await updateDoc(doc(db, `users/${userId}/history`, id), {
        pay: true
      });
      toast.success("Payment status updated successfully");
      await fetchData();
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status");
    }
  };

  const getColumns = () => {
    const commonColumns = [
      { field: "date", headerName: "Date", width: 150 },
      { field: "email", headerName: "Email", width: 160 },
      { field: "username", headerName: "Name", width: 160 },
      { 
        field: "pay", 
        headerName: "Payment Status", 
        width: 150,
        renderCell: (params) => (
          <div style={{ color: params.value ? "green" : "red" }}>
            {params.value ? "Paid" : "Unpaid"}
          </div>
        )
      },
      { field: "price", headerName: "Price", width: 100 },
    ];

    const specificColumns = {
      kuliner: [
        { field: "kulinerID", headerName: "Kuliner ID", width: 150 },
        { field: "kulinerName", headerName: "Kuliner Name", width: 200 },
        { field: "quantity", headerName: "Quantity", width: 100 },
      ],
      bus: [
        { field: "ticketID", headerName: "Ticket ID", width: 150 },
        { field: "transportName", headerName: "Transport Name", width: 200 },
        { field: "totalPassanger", headerName: "Total Passengers", width: 150 },
      ],
      hotel: [
        { field: "hotelID", headerName: "Hotel ID", width: 150 },
        { field: "hotelName", headerName: "Hotel Name", width: 200 },
        { field: "roomType", headerName: "Room Type", width: 150 },
      ],
      Ship: [
        { field: "ticketID", headerName: "Ticket ID", width: 150 },
        { field: "origin", headerName: "Origin", width: 150 },
        { field: "totalPassanger", headerName: "Total Passengers", width: 150 },
      ],
    };

    const actionColumn = [
      {
        field: "action",
        headerName: "Action",
        width: 150,
        renderCell: (params) => (
          <button
            onClick={() => handlePaymentUpdate(params.row.id, params.row.userId)}
            disabled={params.row.pay}
            style={{
              backgroundColor: params.row.pay ? "#ccc" : "#4CAF50",
              color: "white",
              border: "none",
              padding: "5px 10px",
              cursor: params.row.pay ? "default" : "pointer",
            }}
          >
            {params.row.pay ? "Paid" : "Set as Paid"}
          </button>
        ),
      },
    ];

    return [...commonColumns, ...(specificColumns[historyType] || []), ...actionColumn];
  };

  return (
    <div className="dataTable">
      <div className="datatableTitle">
        Payment History
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <select
            value={historyType}
            onChange={(e) => setHistoryType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="kuliner">Kuliner</option>
            <option value="bus">Bus</option>
            <option value="hotel">Hotel</option>
            <option value="Ship">Ship</option>
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '5px' }}
          />
        </div>
      </div>

      <DataGrid
        rows={filteredData}
        columns={getColumns()}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
};

export default HistoryDataTable;