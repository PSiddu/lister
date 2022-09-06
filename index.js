const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const mongoose = require("mongoose");
const UserModel = require("./models/Users");
const cors = require("cors");
const path = require("path");

// in order to use json body request
app.use(express.json());
app.use(cors());

// for environment variables
require("dotenv").config();

// Serving static files from my React front-end
app.use("/", express.static(path.join(__dirname, "/client/build")));

mongoose.connect(process.env.MONGO_URL);

// app.get("/", (req, res) => {
//   res.send("Server is up!");
// });

/* getUsers: gets all of the users in the db (not used currently)
app.get("/getUsers", (req, res) => {
  UserModel.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});
*/

/* getUser by id: takes a user id as a parameter and returns the
    corresponding user object as it is in the db. */
app.get("/getUser/:id", (req, res) => {
  console.log(req.params.id);
  UserModel.findById(req.params.id)
    .then((doc) => {
      console.log(doc);
      if (!doc) {
        return res.status(404).end();
      }
      return res.status(200).json(doc);
    })
    .catch((err) => res.json(err));
});

/* createUser: creates a new user based on the User Model.
    NOTE: Users are created by Auth0, so this is currently not needed.
          If I choose to handle Authentication by myself, I would use this.
app.post("/createUser", async (req, res) => {
  const user = req.body;
  const newUser = new UserModel(user);
  await newUser.save();

  res.json(user);
});
*/

/* createList: adding a new blank list to user.lists.*/
app.put("/createList", async (req, res) => {
  const list = {
    name: "Untitled",
    description: "",
    complete: false,
    _id: req.body.id,
    createdAt: new Date(Date.now()).toLocaleString(),
    items: [],
    idstamp: 0,
  };
  const user = req.body.user;
  user.lists.push(list);
  user.idstamp = user.idstamp + 1;

  const newUser = new UserModel(user);

  UserModel.updateOne({ _id: req.body.user._id }, newUser)
    .then(() => {
      res.status(201).json({
        message: "Thing updated successfully!",
      });
      // console.log("Updated Successfully");
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
});

/* updateItems: called whenever something is changed within a list,
                such as the list name, description, or if a new task
                item has been added. A new user is made with the changes
                and replaces the original. */
app.put("/updateItems", async (req, res) => {
  const user = req.body.user;
  const id = req.body.id;
  const items = req.body.items;
  const name = req.body.name;
  const description = req.body.description;
  const createdAt = req.body.createdAt;
  const operation = req.body.operation;

  for (var i = 0; i < user.lists.length; i++) {
    if (user.lists[i]._id == id) {
      user.lists[i].items = items;
      user.lists[i].name = name;
      user.lists[i].createdAt = createdAt;
      user.lists[i].description = description;

      if (operation == "addtask") {
        user.lists[i].idstamp = user.lists[i].idstamp + 1;
      }
    }
  }
  const newUser = new UserModel(user);

  UserModel.updateOne({ _id: req.body.user._id }, newUser)
    .then(() => {
      res.status(201).json({
        message: "Thing updated successfully!",
      });
      // console.log("Updated Successfully");
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
});

/* deleteLists: deletes the list(s) passed to it by replacing
                the existing user.lists with a new user.lists
                that doesn't include the passed list(s). */
app.put("/deleteLists", async (req, res) => {
  const user = req.body.user;
  const lists = req.body.lists;

  user.lists = lists;
  const newUser = new UserModel(user);

  UserModel.updateOne({ _id: req.body.user._id }, newUser)
    .then(() => {
      res.status(201).json({
        message: "Thing updated successfully!",
      });
      console.log("Updated Successfully");
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
});

//send index.html for any GET route on the server
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
