import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Sidebar from "../../components/sidebar/Sidebar";
import "../new/new.scss";
import Navbar from "../../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast"

const UpdatePrice = () => {
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const { pricelistingId } = useParams(); // Get the guide ID from the URL
  const [filteredName, setFilteredName] = useState([]);
  const [priceData, setPriceData] = useState({
    name: "",
    category: "",
    day: "",
    minPrice: 0,
    maxPrice: 0,
    avgPrice: 0,
    season: ""
  });

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

  const seasonOptions = ["Select Season", "summer", "winter", "spring", "autumn"];
  const handleSeasonChange = (e) => {
    const selectedSeason = e.target.value;
    setPriceData({ ...priceData, season: selectedSeason });
  };
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const filteredCategoryNames = categoryNamesMap[selectedCategory] || [];
    setData({ ...data, category: selectedCategory });
    setFilteredName(filteredCategoryNames);
  };


  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const guideDoc = await getDoc(doc(db, "priceListing", pricelistingId));
        if (guideDoc.exists()) {
          // Set the guideData state with the fetched data
          const data = guideDoc.data();
          setPriceData(data);
          // Populate the filtered names based on the fetched category
          setFilteredName(categoryNamesMap[data.category] || []);
          setPriceData((prevData) => ({ ...prevData, season: data.season }));
        } else {
          console.log("Guide not found.");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPriceData(); // Fetch data when the component is mounted and 'id' changes
  }, [pricelistingId]);
  

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "priceListing", pricelistingId), priceData);
      toast.success("Price List Updated Successfully")
      navigate(-1);
    } catch (error) {
      toast.error("Price List not Updated")
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Update Price List</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form>
              <div className="formInput">
                <label>Select Category</label>
                <select
                  value={priceData.category}
                  onChange={(e) =>
                    setPriceData({ ...priceData, category: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Grain">Grain</option>
                  <option value="Pulse">Pulse</option>
                </select>
              </div>

              <div className="formInput">
                <label>Select Name</label>
                <select
                  value={priceData.name}
                  onChange={(e) =>
                    setPriceData({ ...priceData, name: e.target.value })
                  }
                >
                  <option value="">Select a name</option>
                  {filteredName.map((name, index) => (
                    <option key={index} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formInput">
                <label>Select Season</label>
                <select
                  value={priceData.season}
                  onChange={handleSeasonChange}
                >
                  {seasonOptions.map((season, index) => (
                    <option key={index} value={season}>
                      {season}
                    </option>
                  ))}
                </select>
              </div>



              <div className="formInput">
                <label>Select Day</label>
                <select
                  value={priceData.day}
                  onChange={(e) =>
                    setPriceData({ ...priceData, day: e.target.value })
                  }
                >
                  <option value="">Select Day</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="twoDaysAgo">Two days Ago</option>
                </select>
              </div>

              <div className="formInput">
                <label>Minimum Price</label>
                <input
                  type="number"
                  value={priceData.minPrice}
                  onChange={(e) =>
                    setPriceData({ ...priceData, minPrice: e.target.value })
                  }
                  placeholder="Minimum Price"
                  min="0"
                />
              </div>

              <div className="formInput">
                <label>Maximum Price</label>
                <input
                  type="number"
                  value={priceData.maxPrice}
                  onChange={(e) =>
                    setPriceData({ ...priceData, maxPrice: e.target.value })
                  }
                  placeholder="Maximum Price"
                  min="0"
                />
              </div>

              <div className="formInput">
                <label>Average Price</label>
                <input
                  type="number"
                  value={priceData.avgPrice}
                  onChange={(e) =>
                    setPriceData({ ...priceData, avgPrice: e.target.value })
                  }
                  placeholder="Average Price"
                  min="0"
                />
              </div>
              <button type="button" onClick={handleUpdate}>
                Update Price
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePrice;
