import { Flex, Button, View } from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { signOut, user } = useAuthenticator();

  return (
    <Flex
      as="nav"
      justifyContent="space-between"
      alignItems="center"
      padding="1rem 2rem"
      backgroundColor="#030637"
      color="white"
      width="100%"
      position="fixed"
      top="0"
      left="0"
      style={{ zIndex: 100 }}
    >
      {/* Left - Logo */}
      <View backgroundColor="#030637" fontSize="3.5rem" fontWeight="bold" display="flex">
        <Link to="/"> ⚡</Link> 
      </View>

      {/* Center - Navigation Links */}
      <Flex gap="2rem">
        <Link to="/marketplace" style={{ color: "white", fontSize: "1rem", fontWeight: "500" }}>
          Energy Marketplace
        </Link>
        <Link to="/transactions" style={{ color: "white", fontSize: "1rem", fontWeight: "500" }}>
          Transaction History
        </Link>
      </Flex>

      {/* Right - Sign Out Button */}
      {user ? (
        <Button
          onClick={signOut}
          backgroundColor="#910A67"
          borderColor="#910A67"
          color="white"
          borderRadius="5px"
          padding="0.5rem 1rem"
          fontSize="1rem"
          fontWeight="600"
        >
          Sign Out
        </Button>
      ) : (
        <Button
          as="a"
          href="/login"
          backgroundColor="#910A67"
          borderColor="#910A67"
          color="white"
          borderRadius="5px"
          padding="0.5rem 1rem"
          fontSize="1rem"
          fontWeight="600"
        >
          Log In
        </Button>
      )}
    </Flex>
  );
};

export default Navbar;
