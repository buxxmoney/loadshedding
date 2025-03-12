import Navbar from "./components/Navbar";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Marketplace from "./pages/EnergyMarketplace";
import Footer from "./components/Footer";

Amplify.configure(outputs);

function App() {
  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar /> {/* Navbar stays at the top with highest z-index */}
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/MarketPlace" element={<Marketplace />} />
          </Routes>
        </div>
        <Footer /> {/* Footer stays at the bottom */}
      </div>
    </Router>
  );
}


export default App;
