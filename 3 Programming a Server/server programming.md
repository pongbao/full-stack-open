# Node.js and Express

## Simple web server

    const http = require('http')

In the first row, the application imports Node's built-in web server module. This is practically what we have already been doing in our browser-side code, but with a slightly different syntax:

    import http from 'http'

These days, code that runs in the browser uses ES6 modules. Modules are defined with an export and taken into use with an import.

## Express

Library that has been developed to ease server-side development with Node, by offering a more pleasing interface to work with the built-in http module, which aims to provide a better abstraction for general use cases we usually require to build a backend server.

    npm install express

- install the express module

  "express": "^4.18.2"

The caret in the front of ^4.18.2 means that if and when the dependencies of a project are updated, the version of express that is installed will be at least 4.18.2. However, the installed version of express can also have a larger patch number (the last number), or a larger minor number (the middle number). The major version of the library indicated by the first major number must be the same.

    npm update

- upate the dependencies of the project

  npm install

- install all up-to-date dependencies of the project defined in the _package.json_

  app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
  })

The request is answered by using the `send` method of the response object. Calling the method makes the server respond to the HTTP request by sending a response containing the string <h1>Hello World!</h1>that was passed to the `send` method. Since the parameter is a string, express automatically sets the value of the Content-Type header to be `text/html`. The status code of the response defaults to 200.

    app.get('/api/notes', (request, response) => {
    response.json(notes)
    })

The request is responded to with the `json` method of the response object. Calling the method will send the notes array that was passed to it as a JSON formatted string. Express automatically sets the Content-Type header with the appropriate value of `application/json`.

## nodemon

nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.

    npm install --save-dev nodemon

- installs nodemon

  node_modules/.bin/nodemon index.js

- start application with nodemon

  npm run dev

- start nodemon in dev mode

## REST

We can execute different operations on resources. The operation to be executed is defined by the HTTP verb:

| URL verb   | functionality                                                          |
| ---------- | ---------------------------------------------------------------------- |
| notes/10   | GET fetches a single resource                                          |
| notes GET  | fetches all resources in the collection                                |
| notes POST | creates a new resource based on the request data                       |
| notes/10   | DELETE removes the identified resource                                 |
| notes/10   | PUT replaces the entire identified resource with the request data      |
| notes/10   | PATCH replaces a part of the identified resource with the request data |

## Postman

Many tools exist for making the testing of backends easier. One of these is a command line program curl. However, instead of curl, we will take a look at using Postman for testing the application.

https://www.postman.com/downloads/

## Receiving data

    app.use(express.json())

To access the data easily, we need the help of the express json-parser that is taken to use with command app.use(express.json()).

# About HTTP Request Types

The HTTP standard talks about two properties related to request types, **safety** and **idempotency**.

**GET** and **HEAD** methods SHOULD NOT have the significance of taking an action other than retrieval. These methods ought to be considered "safe".

Safety

- executing request must not cause any _side effects_ on the server

All HTTP requests except POST should be **idempotent**:

Idempotence

- the side-effects of N > 0 identical requests is the same as for a single request. The methods GET, HEAD, PUT and DELETE share this property

POST is the only HTTP request type that is **neither safe nor idempotent**

## Middleware

The express `json-parser` we took into use earlier is a so-called **middleware**

- Middleware are functions that can be used for handling request and response objects
- Middlewares are synchronous by default

## morgan

https://github.com/expressjs/morgan

# Deploying app to the internet

## Same origin policy

A URL's origin is defined by the combination of protocol (AKA scheme), hostname, and port.

http://example.com:80/index.html

    protocol: http
    host: example.com
    port: 80

**Single origin** refers to the concept that web pages or applications can only access resources from the _same domain, protocol, and port_ that they originated from. In other words, if a web page is served from https://example.com, it can only make requests to resources on https://example.com, and not to resources on other domains like https://google.com or https://facebook.com.

**CORS (Cross-Origin Resource Sharing)** is a security feature that allows web pages or applications to _make requests to resources on different domains_. CORS allows a server to explicitly tell a web browser that it is okay for a web page to access its resources from a different domain. This is done by setting specific HTTP headers in the server's response to a request from a different domain.

The problem is that, by default, the JavaScript code of an application that runs in a browser can only communicate with a server in the same origin. Because our server is in localhost port `3001`, while our frontend is in localhost port `3000`, they do not have the same origin.

    npm install cors

- in your backend repository, install cors with this command

  const cors = require('cors')
  app.use(cors())

- use the middleware

## Fly.io

    https://fly.io/docs/hands-on/install-flyctl/

- install the flyctl

  fly auth login

- authenticate via the command line

  fly launch

- initialize the app

  fly deploy

- deploy the app

  fly open

- open the app in the browser

## Deploying the front end

One option for deploying the frontend is to copy the production build (the build directory) to the root of the backend repository and configure the backend to show the frontend's main page (the file build/index.html) as its main page.

To make express show static content, the page index.html and the JavaScript, etc., it fetches, we need a built-in middleware from express called static.

    app.use(express.static('build'))

Whenever express gets an HTTP GET request it will first check if the build directory contains a file corresponding to the request's address. If a correct file is found, express will return it.

Because of our situation, both the _frontend and the backend are at the same address_, we can declare baseUrl as a **relative URL**. This means we can leave out the part declaring the server.

## fly.toml

    [env]
      PORT = "8080" # add this

    [experimental]
      auto_rollback = true

    [[services]]
      http_checks = []
      internal_port = 8080
      processes = ["app"]

## Deployment to Fly

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));

- port settings

## Additional Scripts for Streamlning Deployment

    "build:ui": "cd ..//2 Communicating with Server/part2/ && npm run build && xcopy build \"..\\..\\3 Programming a Server\\backend\\build\" /E /I /Y",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",
    "logs:prod": "fly logs"

## Proxy

    "proxy": "http://localhost:3001"

After a restart, the React development environment will work as a proxy. If the React code does an HTTP request to a server address at http://localhost:3000 not managed by the React application itself (i.e. when requests are not about fetching the CSS or JavaScript of the application), the request will be redirected to the server at http://localhost:3001.

# Saving data to MongoDB

## Chrome dev tools

    node --inspect index.js

## MongoDB

- document database (vs. relational database)

### mongoose

    npm install mongoose

We could use the database directly from our JavaScript code with the official MongoDB Node.js driver library, but it is quite cumbersome to use. We will instead use the Mongoose library that offers a higher-level API.

    node mongo.js <password>

run to input credentials

    const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
    })

    const Note = mongoose.model('Note', noteSchema)

- schema of a note and the matching model

  const note = new Note({
  content: 'HTML is Easy',
  important: false,
  })

Models are so-called _constructor functions_ that create new JavaScript objects based on the provided parameters. Since the objects are created with the model's constructor function, they have all the properties of the model, which include methods for saving the object to the database.

Saving the object to the database happens with the appropriately named `save` method, which can be provided with an event handler with the `then` method

    note.save().then(result => {
      console.log('note saved!')
      mongoose.connection.close()
    })

The objects are retrieved from the database with the find method of the Note model. The parameter of the method is an object expressing search conditions. Since the parameter is an empty object{}, we get all of the notes stored in the notes collection.

    Note.find({}).then((result) => {
      result.forEach((note) => {
        console.log(note);
      });
      mongoose.connection.close();
    });

Only important notes

    Note.find({ important: true }).then(result => {
      // ...
    })

When Mongoose's strictQuery option is set to true (the default), it enforces strict matching of query parameters to fields defined in the schema.

    mongoose.set("strictQuery", false);

## Database configuration in its own module

    MONGODB_URI=address_here npm run dev

- command to run the app

### Using dotenv library

    npm install dotenv

- installs dotenv library

  MONGODB_URI=mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority
  PORT=3001

- contained in a .env file

## Fly.io Users

- include `.env` in the .dockerignore file
- set the env value from the command line

  fly secrets set MONGODB_URI=<uri>

## 400 Bad Request

The request could not be understood by the server due to malformed syntax. The client SHOULD NOT repeat the request without modifications.
