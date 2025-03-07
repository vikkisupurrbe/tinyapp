const { assert } = require('chai');
const { getUserByEmail } = require('../userHelpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail(testUsers,"user@example.com")
    const expectedUserID = "userRandomID";
    // assume there is no error
    assert.isNull(user.error);
    // assert the returned user is correct one
    assert.deepEqual(user.data.id, expectedUserID);
  });

  it('should return a user object when provided with an existing email', function() {
    const user = getUserByEmail(testUsers,"user@example.com");
    const expectedUser = {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
    };
    // assume there is no error
    assert.isNull(user.error);
    // assert the returned user is correct one
    assert.deepEqual(user.data, expectedUser);
  });

  it('should return an error message when the email does not exist', function() {
    const user = getUserByEmail(testUsers, "john@doe.com");
    // assert error as expected
    assert.equal(user.error, "No user found!");
    // assert the returned user data is null
    assert.isNull(user.data);
  });
});
