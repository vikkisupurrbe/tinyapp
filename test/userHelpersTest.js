const { assert } = require('chai');
const { getUserByEmail, urlsForUser } = require('../userHelpers');

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

// tests for getUserByEmail
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

// tests for urlsForUser by AI
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
  x7UsT9: {
    longURL: "https://www.reddit.com",
    userID: "user2ID",
  }
};

describe('urlsForUser', function() {
  it('should return the URLs that belong to the specified user', function() {
    const userId = "aJ48lW";
    const result = urlsForUser(userId, urlDatabase);
    const expected = {
      b6UTxQ: {
        longURL: "https://www.tsn.ca",
        userID: "aJ48lW",
      },
      i3BoGr: {
        longURL: "https://www.google.ca",
        userID: "aJ48lW",
      }
    };

    assert.deepEqual(result, expected);  // Assert the result matches the expected URLs for the given user
  });

  it('should return an empty object if no URLs belong to the specified user', function() {
    const userId = "user3ID";  // User who does not exist in the urlDatabase
    const result = urlsForUser(userId, urlDatabase);
    const expected = {};

    assert.deepEqual(result, expected);  // Assert that the result is an empty object
  });

  it('should return an empty object if the urlDatabase is empty', function() {
    const emptyDatabase = {};
    const userId = "aJ48lW";  // User id that would normally return URLs
    const result = urlsForUser(userId, emptyDatabase);
    const expected = {};

    assert.deepEqual(result, expected);  // Assert that the result is an empty object
  });

  it('should not return URLs that do not belong to the specified user', function() {
    const userId = "aJ48lW";
    const result = urlsForUser(userId, urlDatabase);
    
    // Ensure that no URLs belonging to other users are returned
    assert.isUndefined(result['x7UsT9']);  // User with ID 'user2ID' should not appear for 'aJ48lW'
  });
});

