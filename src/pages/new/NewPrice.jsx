import React, { useEffect, useState } from "react";
import "./priceListing.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast"

const NewPrice = () => {
  const [data, setData] = useState({
    name: "",
    category: "",
    day : "",
    minPrice: "",
    maxPrice: "",
    avgPrice: "",
    season: "",
  });
  const [filteredName, setFilteredName] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const categoryNamesMap = {
    Fruits: [
      "Apple (Ammre)",
      "Apple (Gatcha)",
      "Apple (Golden)",
      "Apple Kala Kullu (Madani)",
      "Apple Kala Kullu (Pahari)",
      "Apricot White",
      "Apricot Yellow",
      "Banana(DOZEN)",
      "Cocunut",
      "Dates (Aseel)",
      "Feutral early(100 Pcs) فروٹر",
      "Grapefruit(100Pcs)",
      "Grapes (Other)",
      "Grapes Gola",
      "Grapes Sundekhani",
      "Guava",
      "Jaman",
      "Jujube(بیر)",
      "Kinnow (100Pcs)",
      "Lemon (China)",
      "Lemon (Desi)",
      "Lemon (Other)",
      "Loquat",
      "Lychee",
      "Mango (Malda)",
      "Mango Desi",
      "Mango Saharni",
      "Mango(Anwer Ratol)",
      "Mango(Chounsa)",
      "Mango(Desahri)",
      "Mango(Sindhri)",
      "Melon",
      "Musambi(100Pcs)",
      "Orange(100Pcs)",
      "Papaya(پپیتا)",
      "Peach",
      "Peach Special",
      "Pear",
      "Persimmon(جاپانی پھل)",
      "Plum",
      "Pomegranate Desi",
      "Pomegranate (Badana)",
      "Pomegranate (Kandhari)",
      "Strawberry",
      "Sugarcane",
      "Sweet Musk Melon",
      "Sweet Musk Melon (Shireen)",
      "Sweet Potato (شکر قندی)",
      "Watermelon",
    ],
    Vegetables: [
      "Batho",
      "Bitter Gourd (کریلا)",
      "Bottle Gourd (کدو)",
      "Brinjal",
      "Cabbage",
      "Capsicum (شملہ مرچ)",
      "Carrot",
      "Carrot China",
      "Cauliflower",
      "Cocoyam (اروی)",
      "Coriander (دھنیا)",
      "Cucumber (Kheera)",
      "Fenugreek (میتھی)",
      "Garlic (China)",
      "Garlic (Local)",
      "Ginger (Thai)",
      "Ginger(China)",
      "Green Chickpeas (چھولیا)",
      "Green Chilli",
      "Green Onion",
      "Lady Finger/Okra (بھنڈی توری)",
      "Mint (پودینہ)",
      "Mongray",
      "Mustard Greens (ساگ سرسوں)",
      "Onion",
      "Peas",
      "Potato Fresh",
      "Potato Store",
      "Potato Sugar Free",
      "Pumpkin",
      "Radish",
      "Spinach",
      "Suger Beet (چقندر)",
      "Tinda Desi",
      "Tindian",
      "Tomato",
      "Turmeric Whole (ثابت ہلدی)",
      "Turnip",
      "Water chestnut (سنگھاڑا)",
      "Zucchini (گھیا توری)",
    ],
    Grain: [
      "Barley (جو)",
      "Canola",
      "Gram Black",
      "Gram Flour (بیسن)",
      "Gram Pulse",
      "Gram White (Imported)",
      "Gram White (Local)",
      "Maize",
      "Millet",
      "Paddy (IRRI)",
      "Paddy Basmati",
      "Paddy Kainat",
      "RapeSeed (Torya)",
      "Red Chilli Whole (Dry)",
      "Rice (IRRI)",
      "Rice Basmati (385)",
      "Rice Basmati Super (New)",
      "Rice Basmati Super (Old)",
      "Rice Kainat (New)",
      "Sesame (تِل)",
      "Sorghum",
      "Sugar",
      "Sunflower",
      "Wheat",
      "Wheat Straw",
    ],
    Pulse: [
      "Groundnut",
      "Jaggery (گڑ)",
      "Mash",
      "Mash Pulse Washed (Imported)",
      "Mash Pulse (Local)",
      "Masoor Pulse (Imported)",
      "Masoor Pulse (Local)",
      "Masoor Whole (Imported)",
      "Masoor Whole (Local)",
      "Moong",
      "Moong Pulse",
      "Mustard Seed",
    ],
  };

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
    setErrors({ ...errors, [id]: "" });
  };
  const handleNameChange = (e) => {
    const value = e.target.value;
    setData({ ...data, name: value });
    setErrors({ ...errors, name: "" });
  };
  
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const filteredCategoryNames = categoryNamesMap[selectedCategory] || [];
    setData({ ...data, category: selectedCategory, });
    setFilteredName(filteredCategoryNames);
    setErrors({ ...errors, category: "" });
  };

  const handleDayChange = (e) => {
    const value = e.target.value;
    setData({ ...data, day: value });
    setErrors({ ...errors, day: "" });
  };
  const handleSeasonChange = (e) => {
    const value = e.target.value;
    setData({ ...data, season: value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!data.category) {
      newErrors.category = "Category is required";
    }
    if (!data.name) {
      newErrors.name = "Name is required";
    }
    if (!data.season) {
      newErrors.season = "Season is required";
    }
    if (!data.day) {
      newErrors.day = "Day is required";
    }
    if (!data.minPrice) {
      newErrors.minPrice = "Minimum Price is required";
    }
    if (!data.maxPrice) {
      newErrors.maxPrice = "Maximum Price is required";
    }
    if (!data.avgPrice) {
      newErrors.avgPrice = "Average Price is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await addDoc(collection(db, "priceListing"), {
        ...data,
        timeStamp: serverTimestamp(),
      });
      toast.success("Price List Added Successfully")
      navigate(-1);
    } catch (error) {
      toast.error("Price List not Addedd")
    }
  };
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Price List</h1>
        </div>

        <div className="bottom">
          {/* <div className="left"></div> */}
          <div className="right">
            <form onSubmit={handleAdd}>
              <div className="dropdownInput">
                <label>Select Category</label>
                <select id="category" onChange={handleCategoryChange}>
                  <option value="">Select Category</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Grain">Grain</option>
                  <option value="Pulse">Pulse</option>
                </select>
                {errors.category && <span className="error">{errors.category}</span>}
              </div>
              <div className="dropdownInput">
                <label>Select Name</label>
                <select id="name" onChange={handleNameChange}>
                  <option value="">Select a name</option>
                  {filteredName.map((name, index) => (
                    <option key={index} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                {errors.name && <span className="error">{errors.name}</span>}
              </div>
              <div className="dropdownInput">
                <label>Select Season</label>
                <select id="season" onChange={handleSeasonChange}>
                  <option value="">Select Season</option>
                  <option value="all">All</option>
                  <option value="summer">Summer</option>
                  <option value="winter">Winter</option>
                  <option value="spring">Spring</option>
                  <option value="autumn">Autumn</option>
                </select>
                {errors.season && <span className="error">{errors.season}</span>}
              </div>
              <div className="dropdownInput">
                <label>Select Day</label>
                <select id="day" onChange={handleDayChange}>
                    <option value="">Select Day</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="twoDaysAgo">Two days Ago</option>
                </select>
                {errors.day && <span className="error">{errors.day}</span>}
              </div>
              <div className="formInput">
              <label>Minimum Price</label>
                <input
                  type="number"
                  id="minPrice"
                  placeholder="Enter Minimum Price"
                  onChange={handleChange}
                  min="0"
                  
                />
                 {errors.minPrice && <span className="error">{errors.minPrice}</span>}
              </div>

              <div className="formInput">
              <label>Maximum Price Price</label>
                <input
                  type="number"
                  id="maxPrice"
                  placeholder="Enter Maximum Price"
                  onChange={handleChange}
                  min="0"
                />
                 {errors.maxPrice && <span className="error">{errors.maxPrice}</span>}
              </div>

              <div className="formInput">
              <label>Average Price</label>
                <input
                  type="number"
                  id="avgPrice"
                  placeholder="Enter Average Price"
                  onChange={handleChange}
                  min="0"
                />
                 {errors.avgPrice && <span className="error">{errors.avgPrice}</span>}
              </div>
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPrice;
