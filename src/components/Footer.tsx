import { Flex, Text } from "@aws-amplify/ui-react";

const Footer = () => {
  return (
    <Flex
      as="footer"
      backgroundColor="#030637"
      color="white"
      paddingTop="7rem"
      padding="1.5rem"
      justifyContent="space-evenly"
      alignItems="center"
      direction="column"
    >
      <Flex gap="2rem">
        <Flex direction="column" alignItems="center" textAlign="center" marginBottom="1rem" width="33%">
          <Text fontSize="1rem" fontWeight="bold" color="white">✨ Mission</Text>
          <Text fontSize="0.875rem" marginLeft="8px" color="white">
            Our mission is to empower communities by providing real-time load shedding tracking, energy sharing, and access to sustainable power solutions.
          </Text>
        </Flex>

        <Flex direction="column" alignItems="center" textAlign="center" marginBottom="1rem" width="33%">
          <Text fontSize="1rem" fontWeight="bold" color="white">🔗 Navigation</Text>
        </Flex>

        <Flex direction="column" alignItems="center" textAlign="center" marginBottom="1rem" width="33%">
          <a href="https://www.linkedin.com/in/sebastianbuxman"
             target="_blank"
             rel="noopener noreferrer"
             style={{color: "white", fontWeight:'bold', fontSize: '1rem'}}
             >
              🌍 Stay Connected
             </a>
        </Flex>
      </Flex>
      <Text fontSize="0.75rem" marginTop="1rem" color="white">
        © 2025 Load Shedding Community Power Hub. All rights reserved.
      </Text>
    </Flex>
  );
};

export default Footer;
