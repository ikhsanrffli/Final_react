export const userColumns = [
  {
    field: "profileImage",
    headerName: "Image",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.profileImage} alt="avatar" />
          {params.row.username}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 120,
  },

  {
    field: "fullName",
    headerName: "Username",
    width: 120,
  },

  {
    field: "phone",
    headerName: "Phone",
    width: 120,
  },
  {
    field: "password",
    headerName: "Password",
    width: 120,
  },
];



export const guideColumn = [
  { field: "id", headerName: "ID", width: 150 },
  {
    field: "image",
    headerName: "Image",
    width: 100,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.img} alt="avatar" />
        </div>
      );
    },
  },

  {
    field: "title",
    headerName: "Title",
    width: 200,
  },
  {
    field: "content",
    headerName: "Description",
    width: 300,
  },
  // {
  //   field: "category",
  //   headerName: "Category",
  //   width: 150,
  // },
];

export const marketColumn = [
  // {
  //   field: "image",
  //   headerName: "Image",
  //   width: 70,
  //   renderCell: (params) => {
  //     return (
  //       <div className="cellWithImg">
  //         <img className="cellImg" src={params.row.img} alt="avatar" />
  //       </div>
  //     );
  //   },
  // },

  {
    field: "name",
    headerName: "Hotel Name",
    width: 150,
  },
  {
    field: "address",
    headerName: "Address",
    width: 150,
  },
  {
    field: "facilities",
    headerName: "Facilities",
    width: 80,
  },
  // {
  //   field: "longitude",
  //   headerName: "Longitude",
  //   width: 70,
  // },
  // {
  //   field: "latitude",
  //   headerName: "Latitude",
  //   width: 70,
  // },
  {
    field: "price",
    headerName: "Price",
    width: 200,
  },
  {
    field: "contactInfo",
    headerName: "Contact",
    width: 120,
  },
];

export const fertilizersColumn = [
  {
    field: "image",
    headerName: "Image",
    width: 100,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.img} alt="avatar" />
        </div>
      );
    },
  },

  {
    field: "productName",
    headerName: "Name",
    width: 100,
  },
  // {
  //   field: "productPrice",
  //   headerName: "Rs.Price",
  //   width: 100,
  // },
  // {
  //   field: "productCategory",
  //   headerName: "Category",
  //   width: 100,
  // },
  {
    field: "location",
    headerName: "Location",
    width: 200,
  },
  // {
  //   field: "productCompany",
  //   headerName: "Company",
  //   width: 100,
  // },
  // {
  //   field: "productAvailability",
  //   headerName: "Availability",
  //   width: 100,
  // },
  {
    field: "rating",
    headerName: "Rating",
    width: 100,
  },
];

export const priceListingColumn = [

  {
    field: "name",
    headerName: "Name",
    width: 150,
  },
  {
    field: "category",
    headerName: "Category",
    width: 100,
  },
  {
    field: "season",
    headerName: "Season",
    width: 100,
  },
  {
    field: "day",
    headerName: "Day",
    width: 100,
  },
  {
    field: "minPrice",
    headerName: "Rs. Minimum Price",
    width: 150,
  },
  {
    field: "maxPrice",
    headerName: "Rs. Maximum Price",
    width: 150,
  },
  {
    field: "avgPrice",
    headerName: "Rs. Avergae Price",
    width: 150,
  },
];

export const orderColumn = [
  {
    field: "profileImage",
    headerName: "Image",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.profileImage} alt="avatar" />
          {params.row.username}
        </div>
      );
    },
  },
  {
    field: "name",
    headerName: "Name",
    width: 100,
  },
  // {
  //   field: "email",
  //   headerName: "Email",
  //   width: 100,
  // },
  {
    field: "description",
    headerName: "Description",
    width: 100,
  },
  // {
  //   field: "phone",
  //   headerName: "Phone",
  //   width: 100,
  // },
  {
    field: "price",
    headerName: "Price",
    width: 100,
  },

  // {
  //   field: "paymentMethodType",
  //   headerName: "Payment Method Type",
  //   width: 100,
  // },
  {
    field: "id",
    headerName: "Order Id",
    width: 200,
  },
  
];

export const transportColumn = [
  {
    field: "image",
    headerName: "Image",
    width: 70,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.image} alt="avatar" />
        </div>
      );
    },
  },
  {
    field: "userName",
    headerName: "Username",
    width: 80,
  },
  {
    field: "fullName",
    headerName: "Name",
    width: 80,
  },
  {
    field: "email",
    headerName: "Email",
    width: 100,
  },
  {
    field: "licenseNumber",
    headerName: "License Number",
    width: 100,
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 100,
  },
  {
    field: "raastID",
    headerName: "payment Id",
    width: 100,
  },
  {
    field: "registrationNumber",
    headerName: "Reg #",
    width: 100,
  },
  {
    field: "vehicle",
    headerName: "Vehicle",
    width: 70,
  },
  {
    field: "cnic",
    headerName: "CNIC",
    width: 100,
  },
];

