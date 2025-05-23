import { useNavigate } from "react-router-dom";
import { View, Text, Button, Card, Flex } from "@aws-amplify/ui-react";

const LearnMore = () => {
  const navigate = useNavigate();

  return (
    <View style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center",  // ✅ Centers everything
        minHeight: "100vh",    // ✅ Ensures the page stretches properly
        width: "100%", 
        maxWidth: "1200px",    // ✅ Restricts width to prevent page from being too wide
        margin: "0 auto"       // ✅ Centers the content
       }}>
        <View style={{
                background: "#030637",
                padding: "1rem",
                position: "absolute",
                top: "100px",  // ✅ Adjusted from 80px to 100px to move it down
                zIndex: 10,               // ✅ Ensures it's above the table
            }}
        >
            
        <Card
            style={{
            maxWidth: "800px",
            width: "100%",
            padding: "2rem",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
        >
            <Text fontSize="2xl" fontWeight="bold" marginBottom="1rem">
            About the Energy Marketplace
            </Text>
            <Text fontSize="md" lineHeight="1.5">
            The idea for this marketplace was born from the need to mitigate load shedding
            and allow communities to trade excess energy. By enabling peer-to-peer energy
            sharing, we empower households and businesses to reduce waste and maximize their
            energy efficiency.
            </Text>
            <Text fontSize="md" lineHeight="1.5" marginTop="1rem">
            Our goal is to create a decentralized energy-sharing ecosystem where users can buy
            and sell excess solar power, ultimately making energy more accessible and
            sustainable.
            </Text>
            <Flex gap="1rem" marginTop="2rem">
            <Button onClick={() => navigate("/")} backgroundColor="#910A67" color="white">
                Back to Home
            </Button>
            <Button onClick={() => navigate("/marketplace")} backgroundColor="#3C0753" color="white">
                Go to Marketplace
            </Button>
            </Flex>
        </Card>
        </View>
    </View>
  );
};

export default LearnMore;
