import { Flex, Button, Text, View } from "@aws-amplify/ui-react";

const HomePageMain = () => {
  return (
    <Flex
      as="main"
      backgroundColor="#030637"
      color="white"
      padding="3vh 4vw"
      justifyContent="space-between"
      alignItems="center"
      width="100vw"
      maxWidth="100vw"
      height="calc(100vh - 80px)"
    >
      {/* Left Section - Text Content */}
      <Flex direction="column" width="45%" padding="1rem" marginTop="5%">
        <Text fontSize="2.5vw" fontWeight="bold" color="white">
          Empowering Communities, One Watt at a Time.
        </Text>
        <Text fontSize="1vw" marginTop="1vh" color="white">
          Access real-time load shedding schedules, share surplus energy with neighbors, 
          and explore cost-effective solar solutions—all from a single, user-friendly 
          platform. Whether you're looking to stay informed, reduce reliance on the grid, 
          or contribute to a smarter, more connected energy network, we give you the tools 
          to take control. Join a community that’s powering the future, together.
        </Text>
        
        <Flex gap="1rem" marginTop="2vh">
          <Button
            backgroundColor="#910A67"
            borderColor="#910A67"
            color="white"
            borderRadius="5px"
            padding="0.75vw 1.5vw"
            fontSize="1vw"
          >
            Get Started
          </Button>
          <Button
            backgroundColor="#3C0753"
            borderColor="#3C0753"
            color="white"
            borderRadius="5px"
            padding="0.75vw 1.5vw"
            fontSize="1vw"
          >
            Learn More
          </Button>
        </Flex>
      </Flex>

      {/* Right Section - SVG Image */}
      <View width="40%" display="flex" marginTop="auto">
        <img
          src="/electricbulb.svg"
          alt="Illustration"
          style={{ maxWidth: "80%", maxHeight: "55vh", objectFit: "contain" }}
        />
      </View>
    </Flex>
  );
};

export default HomePageMain;
