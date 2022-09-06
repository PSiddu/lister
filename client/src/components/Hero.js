import React from "react";
import PropTypes from "prop-types";
import {
  Flex,
  Image,
  Heading,
  Stack,
  HStack,
  Text,
  Button,
  useColorMode,
} from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router";

export default function Hero({ title, subtitle, image, ...rest }) {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  const { loginWithRedirect, user } = useAuth0();
  return (
    <Flex
      align="center"
      justify={{ base: "center", md: "space-around", xl: "space-between" }}
      direction={{ base: "column-reverse", md: "row" }}
      wrap="no-wrap"
      paddingRight="10px"
      paddingTop="50px"
      minH="70vh"
      px={8}
      mb={16}
      {...rest}
    >
      <HStack spacing="12px">
        <Image
          src={image}
          width="95%"
          rounded="1rem"
          border={
            colorMode === "light" ? "2px #41794c solid" : "2px white solid"
          }
        />
      </HStack>
      <Stack
        spacing={4}
        w={{ base: "70%", md: "80%" }}
        align={["center", "center", "flex-end", "flex-end"]}
      >
        <Heading
          as="h1"
          size="2xl"
          fontWeight="bold"
          color={colorMode === "light" ? "#41794c" : "white"}
          textAlign={["center", "center", "center", "center"]}
          fontFamily="Raleway, sans-serif"
          marginBottom={"5%"}
        >
          {title}
        </Heading>
        {user === undefined ? (
          <Button
            variant="outline"
            onClick={() => loginWithRedirect()}
            borderColor={colorMode === "light" ? "#41794c" : "white"}
            padding={"22px"}
            alignSelf="center"
          >
            <Text
              fontSize={["xl", "xl", "3xl", "3xl"]}
              color={colorMode === "light" ? "#41794c" : "white"}
              fontFamily="Raleway, sans-serif"
            >
              Log in or sign up
            </Text>
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard`)}
            borderColor={colorMode === "light" ? "#41794c" : "white"}
            padding={"22px"}
            alignSelf="center"
          >
            <Text
              fontSize={["xl", "xl", "3xl", "3xl"]}
              color={colorMode === "light" ? "#41794c" : "white"}
              fontFamily="Raleway, sans-serif"
            >
              Go to your Dashboard
            </Text>
          </Button>
        )}
      </Stack>
    </Flex>
  );
}

Hero.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  image: PropTypes.string,
};
