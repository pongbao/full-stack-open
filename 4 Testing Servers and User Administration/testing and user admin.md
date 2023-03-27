# Structure and Intro to Testing

Modify the structure of our project to adhere to Node.js best practices

1. Separate all printing to the console to its own module utils/logger.js
2. The handling of environment variables is extracted into a separate utils/config.js

## express.Router

`notes.js`

    const notesRouter = require('express').Router()

    //...

    module.exports = notesRouter

`app.js`

    const notesRouter = require('./controllers/notes')
    app.use('/api/notes', notesRouter)

The module exports the router to be available for all consumers of the module. All routes are now defined for the router object.

A router object is an isolated instance of middleware and routes. You can think of it as a “mini-application,” capable only of performing middleware and routing functions. Every Express application has a built-in app router.

Another option for exports

    const { info, error } = require('./utils/logger')

    info('message')
    error('error message')

The latter way may be preferable if only a small portion of the exported functions are used in a file.

## Testing Node applications

### jest

Testing library developed and used internally by Facebook

    npm install --save-dev jest

This command installs jest in dev mode

    "test": "jest --verbose"

This is the npm script test for jest using the _verbose_ style

    "jest": {
    "testEnvironment": "node"
    }

Specifying execution environment to be node

    test("reverse of a", () => {
    const result = reverse("a");

    expect(result).toBe("a");
    });

Individual test cases are defined with the test function. The first parameter of the function is the test description as a string. The second parameter is a function, that defines the functionality for the test case.

The convention of naming our tests files with the extension `.test.js`

    describe('average', () => {
    // tests
    })

Describe blocks can be used for grouping tests into logical collections.

    npm test -- -t 'when list has only one blog, equals the likes of that'

Running a single test or describe block

## Lodash

https://lodash.com/

Lodash is a utility library for JavaScript that provides many useful functions for working with arrays, objects, strings, and more

## Object.entries

Used to convert an object into a list of key-value pairs

# Testing the backend

## mongod-memory-server

Implement some of the backend tests by mocking the database instead of using a real database

## Integration Testing

Kind of testing where multiple components of the system are being tested as a group

## Separating modes for dev and production

    npm install --save-dev cross-env

There is a slight issue in the way that we have specified the mode of the application in our scripts: it will not work on Windows. We can correct this by installing the cross-env package as a development dependency

    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development nodemon index.js"
    "test": "cross-env NODE_ENV=test jest --verbose -runInBand"

We also added the runInBand option to the npm script that executes the tests. This option will prevent Jest from running tests in parallel.

    npm install cross-env

Install to make a production dependency for deployment

## supertest

    npm install --save-dev supertest

Help us write our tests for testing the API

    .expect('Content-Type', /application\/json/)

The desired value is now defined as regular expression or in short regex. The regex starts and ends with a slash /, because the desired string application/json also contains the same slash, it is preceded by a \ so that it is not interpreted as a regex termination character.

## beforeEach

Initialize before every test with the beforeEach function

## Running one set of tests at a time

    npm test -- tests/note_api.test.js

Only runs the tests found in the tests/note_api.test.js file

    npm test -- -t 'notes'

run all of the tests that contain _notes_ in their name

## Try and Catch

    try {
    const savedNote = await note.save()
    response.status(201).json(savedNote)
    } catch(exception) {
    next(exception)
    }

With async/await the recommended way of dealing with exceptions is the old and familiar try/catch mechanism

## express-async-errors

Refactor the code to eliminate the _catch_ from the methods. The 'magic' of the library allows us to eliminate the _try-catch blocks_ completely.

    npm install express-async-errors

Installs the library

## Promise.all

    await Promise.all(promiseArray)

Wait for all of the asynchronous operations to finish executing

# User administration

The ids of the notes are stored within the user document as an array of Mongo ids. The definition is as follows:

    {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
    }

The type of the field is ObjectId that references note-style documents. Mongo does not inherently know that this is a field that references notes, the syntax is purely related to and defined by Mongoose.

## bycrypt

    npm install bcrypt

Install the bcrypt package for generating the password hashes:

## mongoose-unique-validator

Mongoose does not have a built-in validator for checking the uniqueness of a field. Fortunately there is a ready-made solution for this, the mongoose-unique-validator library

    npm install mongoose-unique-validator

## populate

The populate method is chained after the find method making the initial query. The parameter given to the populate method defines that the ids referencing note objects in the notes field of the user document will be replaced by the referenced note documents.

    usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('notes')

    response.json(users)
    })

# Token Authentication

1. User starts by logging in using a login form implemented with React

- We will add the login form to the frontend in part 5

2. This causes the React code to send the username and the password to the server address _/api/login_ as a HTTP POST request.

3. If the username and the password are correct, the server **generates a token** that somehow identifies the logged-in user.

- The token is **signed digitally**, making it impossible to falsify (with cryptographic means)

4. The backend responds with a status code indicating the operation was successful and returns the token with the response.

5. The browser saves the token, for example to the state of a React application.

6. When the user creates a new note (or does some other operation requiring identification), the React code sends the token to the server with the request.

7. The server uses the token to identify the user

## jsonwebtoken

Package to generate JSON web tokens

    npm install jsonwebtoken

Because the passwords themselves are not saved to the database, but hashes calculated from the passwords, the bcrypt.compare method is used to check if the password is correct:

    await bcrypt.compare(body.password, user.passwordHash)

If the password is correct, a token is created with the method jwt.sign. The token contains the username and the user id in a digitally signed form.

    const userForToken = {
    username: user.username,
    id: user._id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

Set a value to the environment variable SECRET. It can be any string.

    const getTokenFrom = request => {
        const authorization = request.get('authorization')
        if (authorization && authorization.startsWith('Bearer ')) {
            return authorization.replace('Bearer ', '')
        }
        return null
    }

The helper function getTokenFrom isolates the token from the authorization header. Here's how it works:

1. The function first extracts the authorization header from the request object using the request.get('authorization') method. This header is typically included in requests to indicate the authentication credentials of the user making the request.

2. If the authorization header is present and starts with the string "Bearer ", the function returns the substring after "Bearer " as the token string. This assumes that the token is included in the header in the form "Bearer <token>". The replace method is used to remove the "Bearer " prefix from the authorization string.

3. If the authorization header is not present or does not start with "Bearer ", the function returns null to indicate that no token was found.

   const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
   if (!decodedToken.id) {
   return response.status(401).json({ error: 'token invalid' })
   }
   const user = await User.findById(decodedToken.id)

The validity of the token is checked with jwt.verify. The method also decodes the token, or returns the Object which the token was based on.

This code first uses the getTokenFrom function to extract a JWT token from the request's authorization header, and then verifies the token using the jwt.verify method from the jsonwebtoken library. The jwt.verify method takes two arguments: the token to verify, and the secret key used to sign the token. In this case, the secret key is read from an environment variable process.env.SECRET.

If the token is successfully verified, the jwt.verify method returns the decoded token object, which contains the payload data that was originally encoded in the token.

The next line of code checks whether the decoded token object contains an id property. If the id property is not present or is falsy, it means the token is invalid, and the code returns a 401 unauthorized response with an error message of "invalid token".

## Issues with Token-based Authentication

Once the API user, eg. a React app gets a token, the API has a blind trust to the token holder. What if the access rights of the token holder should be revoked?

### Solution 1: Limit the validity period of a token

    const token = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: 60*60 }
    )

60\*60 seconds: 1 hour

### Solution 2: Server-side session

Save info about each token to backend database and to check for each API request if the access right corresponding to the token is still valid. With this scheme, access rights can be revoked at any time.
