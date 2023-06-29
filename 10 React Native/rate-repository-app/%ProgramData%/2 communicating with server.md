# Rendering a Collection

## Key attribute (from react docs)

React uses the key attributes of objects in an array to determine how to update the view generat-ed by a component when the component is re-rendered.

    <ul>
    <li>Duke</li>
    <li>Villanova</li>
    </ul>

    <ul>
    <li>Connecticut</li>
    <li>Duke</li>
    <li>Villanova</li>
    </ul>

React will mutate every child instead of realizing it can keep the <li>Duke</li> and <li>Villanova</li> subtrees intact. This inefficiency can be a problem.

Using indices as key is also highly discouraged as it can lead to unpredictable results. What happens if you push an item to the list or remove something in the middle?

# Forms

## Controlled Components

Assigning a value attribute of an element within the _App_ component **controls** that element.

# Getting Data from the Server

## JSON server installation

- https://github.com/typicode/json-server

  npm install -g json-server

- this runs the json server on port 3000 by default

  json-server --port <port> --watch db.json

- sets the port to `port`

  npx json-server --port 3001 --watch db.json

- run the json server from the root of the app

## Browser as a runtime environment

Currently, JavaScript engines are _single-threaded_, which means that they **cannot execute code in parallel**. As a result, it is a requirement in practice to use a non-blocking model for executing IO operations. Otherwise, the browser would "freeze" during, for instance, the fetching of data from a server.

Another consequence of this single-threaded nature of JavaScript engines is that if some code execution takes up a lot of time, the browser will get stuck for the duration of the execution.

## Node Package Manager (npm)

    npm install axios

- installs axios library for communication between server and browser

  npm install json-server --save-dev

- install a json server as a development dependency

  ````{
  // ...
  "scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject",
  "server": "json-server -p3001 --watch db.json"
  },
  }```
  ````

- add the server to the `package.json` file
- now we can run the server without parameter definitions using `npm run server`

There is a fine difference in the parameters. _axios_ is installed as a **runtime dependency** of the application because the execution of the program requires the existence of the library. On the other hand, _json-server_ was installed as a **development dependency (--save-dev)**, since the program itself doesn't require it. It is used for assistance during software development. There will be more on different dependencies in the next part of the course.

A promise can have three distinct states:

1. The promise is **pending**: It means that the final value (one of the following two) is not available yet.
2. The promise is **fulfilled**: It means that the operation has been completed and the final value is available, which generally is a successful operation. This state is sometimes also called resolved.
3. The promise is **rejected**: It means that an error prevented the final value from being determined, which generally represents a failed operation.

## Hooks

State hooks

- provide state to React components

Effect hooks

- Lets you perform side effects on function components. Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects.

### UseEffect

    useEffect(hook, [])

- takes two parameters:

  1. The effect itself

  - By default, effects run after every completed render, but you can choose to fire it only when certain values have changed.
  - In our case, however, we only want to execute the effect along with the first render.

  2. Specify how often the effect is run

  - If the second parameter is an empty array [], then the effect is only run along with the first render of the component

![part2c server workflow!](./images/part2c%20server%20workflow%20illustration.png)

The JavaScript code making up our React application is run in the browser. The browser gets the JavaScript from the _React dev server_, which is the application that runs after running the command `npm start`. The _dev-server_ transforms the JavaScript into a format understood by the browser. Among other things, it stitches together JavaScript from different files into one file.

The React application running in the browser fetches the JSON formatted data from _json-server_ running on port 3001 on the machine. The server we query the data from - _json-server_ - gets its data from the file db.json.

## Altering Data in the Server

## REST

- individual data objects are called _resources_

## export default

The export default statement is used to export a single object, function or primitive from a module that can be imported in another module. It can be used to export an object that contains multiple functions.

By using the syntax export default {...}, the object containing the functions can be imported as a single object in another module using the import statement, like so:

    import `<arbitrary variable>` from "./src";

This allows the functions to be easily accessed and used in other parts of the code.

Using export default is a common pattern for exporting a set of related functions or objects, and it simplifies the import statement by importing all the related functions at once.

## Sample APIs

https://www.exchangerate-api.com/
https://restcountries.com/v3.1/all
https://openweathermap.org/

Do not save the api-key to source control! Nor hardcode the api-key to your source code. Instead use an environment variable to save the key.

    REACT_APP_API_KEY=t0p53cr3t4p1k3yv4lu3 npm start // For Linux/macOS Bash
    ($env:REACT_APP_API_KEY="t0p53cr3t4p1k3yv4lu3") -and (npm start) // For Windows PowerShell
    set "REACT_APP_API_KEY=t0p53cr3t4p1k3yv4lu3" && npm start // For Windows cmd.exe

You can access the value of the key from the process.env object:

    const api_key = process.env.REACT_APP_API_KEY
    // variable api_key has now the value set in startup

Note that if you created the application using npx create-react-app ... and you want to use a different name for your environment variable then the environment variable name must still begin with REACT*APP*. You can also use a .envfile rather than defining it on the command line each time by creating a file entitled '.env' in the root of the project and adding the following.

    REACT_APP_API_KEY=t0p53cr3t4p1k3yv4lu3
    Note that you will need to restart the server to apply the changes.
