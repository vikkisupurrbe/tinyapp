const express = require("express");
const app =  express();
const PORT = 8080;

app.set("view engine", "ejs"); // set EJS as the templating engine

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => { // when a user visits /urls, the server
  // creates templateVars with urlDatabase
  const templateVars = { urls: urlDatabase }; 
  // passes templateVars to urls_index.ejs, renders urls_index.ejs and sends the response back to the user
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});