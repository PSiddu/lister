import React from "react";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import List from "./pages/List";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import {
  theme,
  ChakraProvider,
  ColorModeScript,
  CSSReset,
} from "@chakra-ui/react";

const App = () => {
  const customTheme = {
    ...theme,
    initialColorMode: "light",
    useSystemColorMode: false,

    fonts: {
      heading: '"Cabin", sans-serif',
      body: '"Cabin", sans-serif',
      mono: '"Cabin", sans-serif',
      Text: '"Cabin", sans-serif',
    },
  };

  return (
    <div>
      <Router>
        <ChakraProvider theme={customTheme}>
          <ColorModeScript
            initialColorMode={customTheme.config.initialColorMode}
          />
          <CSSReset />
          <Navbar />
          <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route exact path="/dashboard" element={<Dashboard />}></Route>
            <Route exact path="/list/:id" element={<List />}></Route>
          </Routes>
        </ChakraProvider>
      </Router>
    </div>
  );
};

export default App;
