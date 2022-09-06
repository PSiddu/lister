import React, { useEffect, useState } from "react";
import "./Navbar.scss";
import { useAuth0 } from "@auth0/auth0-react";
import Axios from "axios";
import { useNavigate } from "react-router";
import { Button, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";

import { ChevronDownIcon } from "@chakra-ui/icons";

const Navbar = () => {
  const navigate = useNavigate();
  const { loginWithRedirect, logout, user } = useAuth0();
  const logIn = user === undefined ? "logged out" : "logged in";
  const [userMongo, setUserMongo] = useState();

  // get user data
  useEffect(() => {
    if (user !== undefined) {
      Axios.get(
        `https://lister-todo.herokuapp.com/getUser/${user.sub.split("|")[1]}`
        // `http://localhost:4000/getUser/${user.sub.split("|")[1]}`
      ).then((response) => {
        setUserMongo(response.data);
      });
    }
  }, [logIn, user]);

  const displayName = () => {
    if (userMongo !== undefined) {
      return userMongo.username;
    }
    if (userMongo !== undefined && userMongo.username === undefined) {
      return user.name;
    }
    return "";
  };

  return (
    <div className="navbar">
      <h1 onClick={() => navigate(`/`)} style={{ cursor: "pointer" }}>
        lister
      </h1>
      {user === undefined ? (
        <Button variant="outline" onClick={() => loginWithRedirect()}>
          <h2>Log In</h2>
        </Button>
      ) : (
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            color="white"
            background={"none"}
            border="1px solid"
            _expanded={{ color: "#41794c", background: "gray.100" }}
            _hover={{ color: "#41794c", background: "gray.100" }}
          >
            Hi, {displayName()}!
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => navigate(`/dashboard`)}>
              Dashboard
            </MenuItem>
            <MenuItem
              onClick={() =>
                logout({
                  returnTo:
                    //"http://localhost:3000/"
                    "https://lister-todo.herokuapp.com/",
                })
              }
            >
              Log Out
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </div>
  );
};

export default Navbar;
