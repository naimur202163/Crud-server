const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://mydbuser1:XSzJ1yYpwViGky5X@cluster0.tlrw7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";



const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.get("/", (req, res) => {
  res.send("Hello world");
});

client.connect((err) => {
  const userList = client.db("randomUsers").collection("users");

  app.post("/addUser", (req, res) => {
    console.log(req.body);
    userList.insertOne(req.body).then((result) => {
      console.log(result);
      res.send(result.acknowledged);
    });
  });

  //   app.get("/users", (req, res) => {
  //     userList.find({}).toArray((err, documents) => {
  //       res.send(documents);
  //     });
  //   });

  app.get("/users", async (req, res) => {
    const result = await userList.find({}).toArray();
    res.send(result);
  });

  app.delete("/deleteUser/:id", async (req, res) => {
    console.log(req.params.id);
    const result = await userList.deleteOne({ _id: ObjectId(req.params.id) });

    console.log(result.acknowledged);
    res.send(result.acknowledged);
  });

  app.get("/singleUser/:id", (req, res) => {
    console.log(req.params.id);
    userList.findOne({ _id: ObjectId(req.params.id) }).then((result) => {
      res.send(result);
    });
  });

  // uodate user info
  app.put("/update/:id", async (req, res) => {
    const id = req.params.id;
    const updatedName = req.body;
    const filter = { _id: ObjectId(id) };
    const updateInfo = {
      $set: {
        name: updatedName.name,
      },
    };
    const result = await userList.updateOne(filter, updateInfo);
    console.log(result);
    res.send(result);
  });
});


app.listen(port, () => {
  console.log("Running Server on port", port);
});
