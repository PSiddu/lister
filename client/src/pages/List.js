import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Flex,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Checkbox,
  Heading,
  Text,
  SlideFade,
  useColorMode,
  IconButton,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import Axios from "axios";
import { useNavigate, useParams } from "react-router";
import "./List.scss";

const List = () => {
  const { id } = useParams();
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const { user } = useAuth0();
  const logIn = user === undefined ? "logged out" : "logged in";
  const [userMongo, setUserMongo] = useState();
  const [items, setItems] = useState([]);
  const [currItem, setCurrItem] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState();

  // get user data
  useEffect(() => {
    if (user !== undefined) {
      Axios.get(
        // `http://localhost:4000/getUser/${user.sub.split("|")[1]}`
        `https://lister-todo.herokuapp.com/getUser/${user.sub.split("|")[1]}`
      ).then((response) => {
        setUserMongo(response.data);
        setName(response.data.lists.filter((item) => item._id === id)[0].name);
        setDescription(
          response.data.lists.filter((item) => item._id === id)[0].description
        );
        setItems(
          response.data.lists.filter((item) => item._id === id)[0].items
        );
        setDate(
          response.data.lists.filter((item) => item._id === id)[0].createdAt
        );
      });
    }
  }, [logIn, user, id]);

  // handle adding a new task item to the list
  const handleNewTaskSubmit = () => {
    let cpy_items = [...items];
    Axios.get(
      `https://lister-todo.herokuapp.com/getUser/${user.sub.split("|")[1]}`
      // `http://localhost:4000/getUser/${user.sub.split("|")[1]}`
    ).then((response) => {
      const currStamp = response.data.lists.filter((item) => item._id === id)[0]
        .idstamp;
      cpy_items.push({ name: currItem, complete: false, _id: currStamp });
      setItems(cpy_items);
      setDate(new Date(Date.now()).toLocaleString());
      handleSave(
        id,
        response.data,
        cpy_items,
        name,
        description,
        new Date(Date.now()).toLocaleString(),
        "addtask"
      );
      setCurrItem("");
    });
  };

  // handle setting the complete state of a task item
  const handleCheckbox = (id) => {
    let cpy_items = [...items];

    cpy_items.forEach((item) => {
      item._id === id ? (item.complete = !item.complete) : <div></div>;
    });

    setItems(cpy_items);
    setDate(new Date(Date.now()).toLocaleString());
    handleSave(
      id,
      userMongo,
      cpy_items,
      name,
      description,
      new Date(Date.now()).toLocaleString(),
      "updatecomplete"
    );
  };

  // handle deleting a task item from the list
  const handleDelete = (iid) => {
    let cpy_items = [...items];

    Axios.get(
      `https://lister-todo.herokuapp.com/getUser/${user.sub.split("|")[1]}`
      // `http://localhost:4000/getUser/${user.sub.split("|")[1]}`
    ).then((response) => {
      let newItems = cpy_items.filter((x) => {
        return x._id !== iid;
      });
      setItems(newItems);
      setDate(new Date(Date.now()).toLocaleString());
      handleSave(
        id,
        response.data,
        newItems,
        name,
        description,
        new Date(Date.now()).toLocaleString(),
        "delete"
      );
    });
  };

  // handle changing the name of the list
  const handleNameChange = (val) => {
    setName(val);
    setDate(new Date(Date.now()).toLocaleString());
    handleSave(
      id,
      userMongo,
      items,
      val,
      description,
      new Date(Date.now()).toLocaleString(),
      "namechange"
    );
  };

  // handle changing the description of the list
  const handleDescription = (val) => {
    setDescription(val);
    setDate(new Date(Date.now()).toLocaleString());
    handleSave(
      id,
      userMongo,
      items,
      name,
      val,
      new Date(Date.now()).toLocaleString(),
      "descriptionchange"
    );
  };

  // this function sends a put request to update all properties
  // of the list. Is called when anything is changed in the list.
  const handleSave = (
    p_id,
    p_user,
    p_items,
    p_name,
    p_description,
    p_date,
    operation
  ) => {
    Axios.put(
      `https://lister-todo.herokuapp.com/updateItems`,
      // `http://localhost:4000/updateItems`,
      {
        id: p_id,
        user: p_user,
        items: p_items,
        name: p_name,
        description: p_description,
        createdAt: p_date,
        operation: operation,
      }
    ).then((response) => {
      console.log("done");
    });
  };

  return userMongo !== "undefined" ? (
    <Flex
      direction={"column"}
      paddingLeft="5%"
      paddingRight="5%"
      marginTop="3%"
    >
      <Flex justifyContent={"space-between"} marginBottom="1%">
        <IconButton
          aria-label="Return to Dashboard"
          icon={<ArrowBackIcon />}
          onClick={() => navigate(`/dashboard`)}
          isRound
          variant="outline"
          color={colorMode === "dark" ? "white" : "#41794c"}
          borderWidth={"2px"}
          borderColor={colorMode === "dark" ? "white" : "#41794c"}
          fontFamily="Raleway, sans-serif"
          fontWeight="bold"
          fontSize="16px"
        />
        <p
          style={{
            fontFamily: "Raleway, sans-serif",
            fontWeight: "bold",
            fontSize: "16px",
            color: colorMode === "dark" ? "white" : "#41794c",
          }}
        >
          Last Modified: {new Date(date).toLocaleString()}
        </p>
      </Flex>
      <Flex
        direction={["column", "column", "row", "row"]}
        justify={["auto", "auto", "space-between", "space-between"]}
      >
        <Heading
          fontWeight={"bold"}
          fontSize="2xl"
          color={colorMode === "dark" ? "white" : "#41794c"}
          fontFamily="Raleway, sans-serif"
          size="md"
          marginTop="5px"
        >
          Name:
        </Heading>
        <Input
          marginLeft="1%"
          marginRight="1%"
          value={name}
          onChange={({ target }) => handleNameChange(target.value)}
          placeholder="Enter Name: "
          fontFamily="Raleway, sans-serif"
          fontWeight={"bold"}
          borderColor={colorMode === "dark" ? "white" : "#41794c"}
          focusBorderColor={colorMode === "dark" ? "white" : "#41794c"}
          borderWidth="2px"
        ></Input>
        <Heading
          fontWeight={"bold"}
          fontSize="2xl"
          color={colorMode === "dark" ? "white" : "#41794c"}
          fontFamily="Raleway, sans-serif"
          size="md"
          marginLeft="1%"
          marginTop="5px"
        >
          Description:
        </Heading>
        <Input
          marginLeft="1%"
          fontFamily="Raleway, sans-serif"
          fontWeight={"bold"}
          value={description}
          onChange={({ target }) => handleDescription(target.value)}
          placeholder="Enter Description: "
          borderColor={colorMode === "dark" ? "white" : "#41794c"}
          focusBorderColor={colorMode === "dark" ? "white" : "#41794c"}
          borderWidth="2px"
        ></Input>
      </Flex>
      <Heading
        fontWeight={"bold"}
        fontSize="2xl"
        color={colorMode === "dark" ? "white" : "#41794c"}
        fontFamily="Raleway, sans-serif"
        size="md"
        marginTop="1%"
        marginBottom={"5px"}
      >
        Tasks:
      </Heading>
      <InputGroup size="md" marginBottom={"1%"}>
        <Input
          pr="7rem"
          fontFamily="Raleway, sans-serif"
          fontWeight={"bold"}
          placeholder="Enter New Task Here: "
          value={currItem}
          borderColor={colorMode === "dark" ? "white" : "#41794c"}
          focusBorderColor={colorMode === "dark" ? "white" : "#41794c"}
          borderWidth="2px"
          onChange={({ target }) => setCurrItem(target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleNewTaskSubmit();
            }
          }}
        />
        <InputRightElement width="6rem" marginRight="1%">
          <Button
            variant="outline"
            h="1.75rem"
            size="md"
            onClick={() => handleNewTaskSubmit()}
            color={colorMode === "dark" ? "white" : "#41794c"}
            fontFamily="Raleway, sans-serif"
            borderColor={colorMode === "dark" ? "white" : "#41794c"}
            fontWeight="bold"
            fontSize={"18px"}
          >
            Add Task
          </Button>
        </InputRightElement>
      </InputGroup>
      {items.map((item) => (
        <SlideFade in={true} offsetY="20px">
          <Flex
            borderColor={colorMode === "dark" ? "white" : "#41794c"}
            focusBorderColor={colorMode === "dark" ? "white" : "#41794c"}
            borderWidth="2px"
            borderRadius={"6px"}
            minHeight="40px"
            justify={"space-between"}
            marginBottom={"5px"}
            direction={["column", "column", "row", "row"]}
          >
            <Text
              fontFamily="Raleway, sans-serif"
              fontWeight={"bold"}
              fontSize="18px"
              paddingTop={"5px"}
              paddingLeft={"2%"}
              as={item.complete ? "s" : null}
            >
              {item.name}
            </Text>
            <Flex justify={["space-between", "space-between", "auto", "auto"]}>
              <Checkbox
                isChecked={item.complete}
                onChange={() => handleCheckbox(item._id)}
                fontFamily="Raleway, sans-serif"
                fontWeight={"bold"}
                fontSize="18px"
                fontStyle={"italic"}
                borderColor={colorMode === "dark" ? "white" : "#41794c"}
                marginRight="50px"
                marginLeft={["5%", "5%", "none", "none"]}
              >
                Complete?
              </Checkbox>
              <Button
                variant="outline"
                h="1.75rem"
                width="6rem"
                size="md"
                color={colorMode === "dark" ? "white" : "#41794c"}
                fontFamily="Raleway, sans-serif"
                borderColor={colorMode === "dark" ? "white" : "#41794c"}
                fontWeight="bold"
                fontSize={"18px"}
                onClick={() => handleDelete(item._id)}
                marginTop={["none", "none", "5px", "5px"]}
                marginRight={["5%", "5%", "3%", "3%"]}
                marginBottom={["5px", "5px", "none", "none"]}
              >
                {" "}
                Delete{" "}
              </Button>
            </Flex>
          </Flex>
        </SlideFade>
      ))}
    </Flex>
  ) : (
    <div></div>
  );
};

export default List;
