"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const fetch = require("node-fetch");


const urlencodedParser = bodyParser.urlencoded({
  extended: false
});

const PORT = 4000;

const app = express();
const api = "3a8bc35ffd38047c3426323bc05d54e6";

app.use(session({
  secret: "dwai2§dkjwao210dwkalcklxkd3d013ie2kdlkwla4i29keedlkccvoit32011",
  resave: true,
  cookie: {
    maxAge: 3600000
  }, //time in millisecs before cookie expires
  saveUninitialized: false
}));


//allowing CSS
app.use(express.static(__dirname + '/public'));

app.set("views", "views");
app.set("view engine", "pug");


app.get("/", function(req, res) {
  fetch("https://api.nasa.gov/insight_weather/?api_key=jF2ykJ3roLtiKY8WIJjgqihbOEkpJozFpE7aiTVS&feedtype=json&ver=1.0")
  .then((response) => {
    console.log(response);
  })


  res.render("index");

});

//END OF GET/POST

app.listen(PORT, function() {
  console.log(`Shopping App listening on Port ${PORT}`);
});
