import React from "react";
import { Flex, useColorMode } from "@chakra-ui/react";
import Hero from "../components/Hero";
import LightList from "../assets/to-do-light.jpg";
import DarkList from "../assets/to-do-dark.jpg";

const Home = () => {
  const { colorMode } = useColorMode();

  return (
    <Flex align="center" paddingTop={["none", "none", "none", "50px"]}>
      <Hero
        title="A minimal list-keeping app based on simplicity"
        subtitle="Log In or Sign Up"
        image={colorMode === "light" ? LightList : DarkList}
      />
    </Flex>
  );
};

export default Home;
