const getUserByEmail = (users, email) => {
  
  for (let userId in users) {
    if (users[userId].email === email) {
      return { error: null, data: users[userId] }; // Return the user object if the email exists
    }
  }
  return {error: "No user found!", data: null};

};

const generateRandomString = function() {
  return Math.random().toString(36).substring(2, 10);
}; // generate a random alphanumeric string that is 8 characters long for newUserID

const createUser = (users, newUserData) => {

  const newUserID = generateRandomString();

  const newUser = {
    id: newUserID,
    email: newUserData.email,
    password: newUserData.password,
  };

  // check if the email newUser entered already exists
  const {error} = getUserByEmail(users, newUser.email);
  if (error === null) {
    return {error: "User already exist", data: null};
  }

  // check for empty field
  const isInvalidUser = Object.values(newUser).filter((value) => value === "").length > 0;

  if (isInvalidUser) {
    return {error: "Empty field", data: null};
  }

  users[newUserID] = newUser; // add new user to users

  return { error: null, data: newUser };
};

module.exports = { createUser, getUserByEmail };

//console.log(createUser(users, {email: "user@example.com", password: "1234" })); user with existing email will successfully register