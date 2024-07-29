import { React, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/home/Home";
import List from "./pages/list/List";
import Login from "./pages/login/Login";
import New from "./pages/new/New";
import Single from "./pages/single/Single";
import {
  fertilizersInput,
  guideInputs,
  marketInputs,
  userInputs,
} from "./formSource";
import { AuthContext } from "./context/AuthContext";
import GuideList from "./pages/list/GuideList";
import NewGuide from "./pages/new/NewGuide";
import MarketNearMeList from "./pages/list/MarketNearMeList";
import NewMarket from "./pages/new/NewMarket";
import UpdateGuide from "./pages/single/UpdateGuide";
import UpdateMarket from "./pages/single/UpdateMarket";
import NewFertilizers from "./pages/new/NewFertilizers";
import FertilizersList from "./pages/list/FertilizersList";
import UpdateFertilizers from "./pages/single/UpdateFertilizers";
import NewPrice from "./pages/new/NewPrice";
import UpdatePrice from "./pages/single/UpdatePrice";
import PriceList from "./pages/list/PriceList";
import { Toaster } from "react-hot-toast";
import ProductList from "./pages/list/ProductList";
import OrderList from "./pages/list/OrderList";
import SingleOrder from "./pages/single/SingleOrder";
import SingleUser from "./pages/single/SingleUser";
import SingleItem from "./pages/single/SingleItem";
import SingleGuide from "./pages/single/SingleGuide";
import SingleMarket from "./pages/single/SingleMarket";
import SinglePriceListing from "./pages/single/SinglePriceListing";
import SingleFertilizer from "./pages/single/SingleFertilizer";
import TransportCompanyList from "./pages/list/TransportCompanyList";
import SingleTransportCompany from "./pages/single/SingleTransportCompany";
import NewKuliner from "./pages/new/NewKuliner";
import UpdateKuliner from "./pages/single/UpdateKuliner";
import NewHotel from "./pages/new/NewHotel";
// import UpdateHotel from "./single/UpdateHotel";




function App() {
  return (
    <div className="App">
      <Router>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} /> {/* Redirect to /home */}
          <Route path="home" element={<Home />} />
          <Route path="users">
            <Route
              index
              element={<List />}
            />
            <Route
              path=":userId"
              element={<SingleUser />}
            />
            <Route
              path="new"
              element={<New inputs={userInputs} title="Add New User" />}
            />
          </Route>

          <Route path="products">
            <Route
              index
              element={<ProductList />}
            />
            <Route
              path=":productId"
              element={<SingleItem />}
            />
          </Route>

          <Route path="guide">
            <Route
              index
              element={<GuideList />}
            />
            <Route
              path=":guideId"
              element={<SingleGuide />}
            />
            <Route
              path="update/:guideId"
              element={<UpdateGuide />}
            />
            <Route
              path="newguide"
              element={<NewGuide guide={guideInputs} title="Add New Guide" />}
            />
          </Route>

          <Route path="orders">
            <Route
              index
              element={<OrderList />}
            />
            <Route
              path=":ordersId"
              element={<SingleOrder />}
            />
          </Route>

          <Route path="kuliner/new" element={<NewKuliner />} />
          <Route path="kuliner/update/:kulinerId" element={<UpdateKuliner />} />

          <Route path="marketnearme">
            <Route
              index
              element={<MarketNearMeList />}
            />
            <Route
              path=":nearmeId"
              element={<SingleMarket />}
            />
            <Route
              path="update/:nearmeId"
              element={<UpdateMarket />}
            />
            <Route
              path="newmarket"
              element={<NewMarket market={marketInputs} title="Add New Market" />}
            />
          </Route>

          <Route path="fertilizers">
            <Route
              index
              element={<FertilizersList />}
            />
            <Route
              path=":fertilizersId"
              element={<SingleFertilizer />}
            />
            <Route
              path="update/:fertilizersId"
              element={<UpdateFertilizers />}
            />
            <Route
              path="newfertilizers"
              element={<NewFertilizers fertilizers={fertilizersInput} title="Add New Fertilizer" />}
            />
          </Route>

          <Route path="pricelisting">
            <Route
              index
              element={<PriceList />}
            />
            <Route
              path=":pricelistingId"
              element={<SinglePriceListing />}
            />
            <Route
              path="update/:pricelistingId"
              element={<UpdatePrice />}
            />
            <Route
              path="newpricelisting"
              element={<NewPrice fertilizers={fertilizersInput} title="Add New Fertilizer" />}
            />
          </Route>

          <Route path="transportcompany">
            <Route
              index
              element={<TransportCompanyList />}
            />
            <Route
              path=":transportcompanyId"
              element={<SingleTransportCompany />}
            />
          </Route>
<Route path="/hotels/new" element={<NewHotel />} />

          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
