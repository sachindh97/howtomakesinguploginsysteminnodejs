const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");

const app = express();

const db = require("./dbconnection");

// database connection
db.connect((err) => {
  err
    ? console.log("db connection failed ...")
    : console.log("db connection success ..");
});
//cors
app.use(cors());

// router path
const routes = require("./router/router");

// bodyparser
app.use(bodyparser.json());

app.use("/api", routes);

// server
app.listen(3000, (err) => {
  if (err) throw err;
  console.log("server running....");
});
