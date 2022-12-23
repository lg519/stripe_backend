const cors = require("cors");
const express = require("express");
// TODO: add a stripe key
// const stripe = require("stripe")("");
const uuid = require("uuid");

const app = express();

//middleware
app.use(express.json());
app.use(cors());

//routes
app.get("/", (req, res) => res.send("HEYAA"));
//listen
app.listen(8282, () => console.log("LISTENING AT PORT 8282"));
