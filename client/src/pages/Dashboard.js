import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  IconButton,
  Flex,
  Box,
  Heading,
  useColorMode,
  Switch,
} from "@chakra-ui/react";

import DashTable from "../components/DashTable";
import "./Dashboard.scss";

import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

import { useAuth0 } from "@auth0/auth0-react";
import Axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const { user } = useAuth0();
  const logIn = user === undefined ? "logged out" : "logged in";
  const [userMongo, setUserMongo] = useState();
  const [data, setData] = useState();
  const [selectedRecords, setSelectedRecords] = useState([]);

  /* This hook defines some scss root variables that need to change depending on
     the state of colorMode. (Dark or light). This will allow for the antd table to
     change on dark mode, since all other components are from Chakra UI. Typically,
     this is not very good practice, but given that these are two incompatible
     component libraries, and how the antd colors can't be changed within the 
     Javascript, this was one of the only ways. */
  useEffect(() => {
    const root = document.documentElement;

    // the headings of the table
    root?.style.setProperty(
      "--color",
      colorMode === "dark" ? "#30343c" : "#fafafa"
    );
    // the text color within the table
    root?.style.setProperty(
      "--t-color",
      colorMode === "dark" ? "white" : "black"
    );
    // the background color of the regular table cells
    root?.style.setProperty(
      "--bg-color",
      colorMode === "dark" ? "#20242c" : "white"
    );
    // border color of the table and its cells
    root?.style.setProperty(
      "--border-color",
      colorMode === "dark" ? "white" : "#41794c"
    );
    // border color of active pagination
    root?.style.setProperty(
      "--p-color",
      colorMode === "dark" ? "white" : "#096dd9"
    );
    // hover color of the table cells
    root?.style.setProperty(
      "--hv-color",
      colorMode === "dark" ? "#696969" : "#F8F8F8"
    );
    // border bottom had irregular behavior, so correcting that
    root?.style.setProperty(
      "--btm-color",
      colorMode === "dark" ? "white" : "#f0f0f0"
    );
  }, [colorMode]);

  // getting user data from Mongo db
  useEffect(() => {
    if (user !== undefined) {
      Axios.get(
        `https://lister-todo.herokuapp.com/getUser/${user.sub.split("|")[1]}`
        // `http://localhost:4000/getUser/${user.sub.split("|")[1]}`
      ).then((response) => {
        setUserMongo(response.data);
        setData(response.data.lists);
      });
    }
  }, [logIn, user]);

  // handler for creating new list
  const createNewList = () => {
    let newID = String(userMongo.idstamp + 1).padStart(8, "0");
    Axios.put(
      // `http://localhost:4000/createList`
      `https://lister-todo.herokuapp.com/createList`,
      {
        id: newID,
        user: userMongo,
      }
    ).then((response) => {
      // console.log(response);
      navigate(`/list/${newID}`);
    });
  };

  // handler for deleting all selected list(s)
  const deleteLists = () => {
    const deleteIds = [];

    selectedRecords.forEach((record) => {
      deleteIds.push(record._id);
    });

    let cpy_data = [...data];
    const newData = cpy_data.filter((item) => {
      return !deleteIds.includes(item._id);
    });

    Axios.put(
      // `http://localhost:4000/deleteLists`
      `https://lister-todo.herokuapp.com/deleteLists`,
      {
        lists: newData,
        user: userMongo,
      }
    ).then((response) => {
      setData(newData);
      setSelectedRecords([]);
    });
  };

  // handler for table entry click to take user to that list
  const goToList = (id) => {
    navigate(`/list/${id}`);
  };

  // array of headers (which will define the columns of the table)
  const columns = [
    {
      title: "List Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: "Last Modified",
      dataIndex: "createdAt",
      sorter: (a, b) => a.createdAt > b.createdAt,
    },
  ];

  return (
    <div>
      {userMongo !== undefined ? (
        <Flex
          paddingLeft={"5%"}
          paddingRight={"5%"}
          justify={["space-between", "space-between", "flex-end", "flex-end"]}
          marginTop={["3%", "3%", "1%", "1%"]}
        >
          <p
            style={{
              fontFamily: "Raleway, sans-serif",
              fontWeight: "bold",
              fontSize: "20px",
              color: colorMode === "dark" ? "white" : "#41794c",
            }}
          >
            Toggle Color Mode:
          </p>
          <Switch
            onChange={toggleColorMode}
            paddingLeft={["0px", "0px", "20px", "20px"]}
            fontSize="18px"
            size="lg"
          ></Switch>
        </Flex>
      ) : (
        ""
      )}
      {data !== undefined && data.length === 0 ? (
        <Flex
          paddingLeft={"5%"}
          paddingRight={"5%"}
          marginTop={["3%", "3%", "1%", "1%"]}
        >
          <Box
            bg={colorMode === "dark" ? "#28242c" : "#FAF9F6"}
            w="100%"
            p={4}
            borderStyle={"dashed"}
            borderColor="grey"
            borderWidth={"2px"}
            height={["300px", "300px", "500px", "500px"]}
            _hover={
              colorMode === "light"
                ? {
                    boxShadow:
                      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                  }
                : {
                    boxShadow:
                      "0 4px 8px 0 rgba(255, 255, 255, 0.2), 0 6px 20px 0 rgba(255, 255, 255, 0.19)",
                  }
            }
            cursor="pointer"
            onClick={() => createNewList()}
          >
            <Heading
              align="center"
              color={colorMode === "dark" ? "white" : "#41794c"}
              fontFamily="Raleway, sans-serif"
              marginTop={"15%"}
            >
              Create New List
            </Heading>
          </Box>
        </Flex>
      ) : (
        <Flex>
          {userMongo !== undefined ? (
            <div>
              {console.log(data)}
              <Heading
                marginLeft="5%"
                marginTop={["3%", "3%", "1%", "1%"]}
                color={colorMode === "dark" ? "white" : "#41794c"}
                fontFamily="Raleway, sans-serif"
                size="lg"
              >
                Your Lists:
              </Heading>
              <Flex paddingLeft={"5%"} marginTop={"2%"}>
                {selectedRecords.length === 0 && (
                  <IconButton
                    onClick={() => createNewList()}
                    isRound
                    aria-label="Add list"
                    icon={<AddIcon />}
                    marginRight={"1%"}
                    variant="outline"
                    color={colorMode === "dark" ? "white" : "#41794c"}
                    borderWidth={"2px"}
                    borderColor={colorMode === "dark" ? "white" : "#41794c"}
                    zIndex={100}
                  />
                )}
                <IconButton
                  onClick={() => deleteLists()}
                  isRound
                  aria-label="Delete list(s)"
                  icon={<DeleteIcon />}
                  variant="outline"
                  color={colorMode === "dark" ? "white" : "#41794c"}
                  borderWidth={"2px"}
                  borderColor={colorMode === "dark" ? "white" : "#41794c"}
                  zIndex={100}
                />
              </Flex>
              <DashTable
                columns={columns}
                data={data}
                goToList={goToList}
                selectedRecords={selectedRecords}
                setSelectedRecords={setSelectedRecords}
                showSorterTooltip={false}
              />
            </div>
          ) : (
            ""
          )}
        </Flex>
      )}
    </div>
  );
};

export default Dashboard;
