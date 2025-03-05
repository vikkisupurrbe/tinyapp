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

  users[newUserID] = newUser; // add new user to users

  return newUser;
};

module.exports = { createUser };