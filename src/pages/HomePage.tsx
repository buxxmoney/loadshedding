import HomePageMain from "../components/HomePageMain";
import "@aws-amplify/ui-react/styles.css";
import React from "react"

const HomePage: React.FC = () => {
    return(
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", paddingTop: "80px" }}>
            <HomePageMain />
        </div>
    )
}

export default HomePage;
