const express = require("express");
const cookieParser = require("cookie-parser");
const users = require("./userData");
const { createUser, getUserByEmail, authenticateUser } = require("./userHelpers");
const app =  express();
const PORT = 8080;

app.set("view engine", "ejs"); // set EJS as the templating engine
app.use(cookieParser());


const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.use(express.urlencoded({ extended: true })); // convert the request body from a buffer into string that we can read

const generateRandomString = function() {
  return Math.random().toString(36).substring(2, 8);
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
  const userId = req.cookies["user_id"];
  const user = users[userId];
  // creates templateVars with urlDatabase
  const templateVars = {
    urls: urlDatabase,
    user
  };
  // passes templateVars to urls_index.ejs, renders urls_index.ejs and sends the response back to the user
  res.render("urls_index", templateVars);
});

// show the page to create a shortURL based on a long URL
app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  if (!user) {
    return res.redirect("/login");
  }
  res.render("urls_new", {user: user});
});

// show the page with the provided longURL and the shortID
app.get("/urls/:id", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user
  };
  res.render("urls_show", templateVars);
});

// create a randomly generated shortID, store shortID - longURL as a new key-value pair in urlDatabase
app.post("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  if (!user) {
    return res.status(403).send("<h1>Access Denied</h1><p>You must be logged in to shorten URLs. <a href='/login'>Login here</a></p>");
  }
  const shortID = generateRandomString();
  urlDatabase[shortID] = req.body.longURL;
  console.log(req.body);
  console.log("New URL added:", shortID, "=>", urlDatabase[shortID]);
  res.redirect(`/urls/${shortID}`);
});

// redirect user to the original website using the shortID, if user enters an invalid shortID, no page found
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send("<h1>404 - Short URL Not Found</h1><p>The short URL you are looking for does not exist.</p><p><a href='/urls'>Go back to My URLs</a></p>");
  }
});

// delete the url from urlDatabase
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

// edit the existing longURL with the current shortID
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const newURL = req.body.newURL;
  urlDatabase[id] = newURL;
  res.redirect("/urls");
});

// login GET, shows the login page
app.get('/login', (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  if (user) {
    return res.redirect('/urls');
  }
  res.render('login', { user: null });
});

// login POST
app.post("/login", (req, res) => {
  const {email, password} = req.body;
  const {error, data} = authenticateUser(users, email, password);
  if (error) {
    return res.status(403).send(error);
  }
  res.cookie("user_id", data.id);
  res.redirect("urls");
});

// logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

// register as a new user
app.get("/register", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  if (user) {
    return res.redirect('urls');
  }
  res.render("register", { user: null });
});

// create a new user object to the global users object
app.post("/register", (req, res) => {
  const {error, data} = createUser(users, req.body);

  if (error) {
    return res.status(400).send(error);
  }
  // console.log("New user:", data); new user with id, email, password created
  // console.log(users); new user added to users
  res.cookie("user_id", data.id);
  res.redirect("/urls");
});