const bcrypt = require("bcryptjs");

// look up users by their email
const getUserByEmail = (users, email) => {

  for (let userId in users) {
    if (users[userId].email === email) {
      return { error: null, data: users[userId] }; // Return the user object if the email exists
    }
  }
  return {error: "No user found!", data: null};

};

// users login with email and password need to match the database
const authenticateUser = (users, email, password) => {
  for (let userId in users) {
    if (users[userId].email === email) {
      if (bcrypt.compareSync(password, users[userId].password)) {
        return { error: null, data: users[userId] };
      } else {
        return { error: "Password does not match!", data: null };
      }
    }
  }
  return { error: "Email not found in the system. Please register.", data: null };
};

// new user registration
const generateRandomString = function() {
  return Math.random().toString(36).substring(2, 10);
}; // generate a random alphanumeric string that is 8 characters long for newUserID

const createUser = (users, newUserData) => {
  const newUserID = generateRandomString();
  
  // check if the email newUser entered already exists
  const {error} = getUserByEmail(users, newUserData.email);
  if (error === null) {
    return {error: "User already exists!", data: null};
  }
  
  // check for empty field
  if (!newUserData.email || !newUserData.password) {
    return { error: "Empty field!", data: null };
  }

  // hash the password before storing
  const hashedPassword = bcrypt.hashSync(newUserData.password, 10);
  
  const newUser = {
    id: newUserID,
    email: newUserData.email,
    password: hashedPassword
  };

  users[newUserID] = newUser; // add new user to users
  // console.log(newUser);
  return { error: null, data: newUser };
};

const urlsForUser = (id, urlDatabase) => {
  const userUrls = {};

  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] =  urlDatabase[shortURL];
    }
  }
  return userUrls;
};

module.exports = { createUser, getUserByEmail, authenticateUser, urlsForUser };

// test
/*
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

console.log(authenticateUser(users, "user@example.com", "123456"));
// { error: 'Password does not match!', data: null }
console.log(authenticateUser(users, "momo@123.com", "123456"));
// { error: 'Email not found!', data: null }

console.log(authenticateUser(users, "user@example.com", "purple-monkey-dinosaur"));
{
  error: null,
  data: {
    id: 'userRandomID',
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur'
  }
}

//console.log(createUser(users, {email: "user@example.com", password: "1234" })); user with existing email will successfully register
*/
