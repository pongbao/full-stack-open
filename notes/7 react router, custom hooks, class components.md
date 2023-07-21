# React Router

The React Router library which provides an excellent solution for managing navigation in a React application

    npm install react-router-dom

The Note component receives all of the notes as props notes, and it can access the URL parameter (the id of the note to be displayed) with the `useParams` function of the React Router.

With the `useNavigate` function of the React Router the browser's URL can be changed programmatically. With user login, we call navigate('/') which causes the browser's URL to change to / and the application renders the corresponding component Home.

Use `useMatch` hook to figure out the id of the note to be displayed in the App component. It is not possible to use the `useMatch` hook in the component which defines the routed part of the application.

# Hooks

## Rules

**Don’t call Hooks inside loops, conditions, or nested functions.**
Instead, always use Hooks at the top level of your React function.

**Don’t call Hooks from regular JavaScript functions**.
Instead, you can:

- Call Hooks from React function components.
- Call Hooks from custom Hooks

## Custom Hooks

Let's extract the counter logic into a custom hook. The code for the hook is as follows:

    const useCounter = () => {
        const [value, setValue] = useState(0)

        const increase = () => {
            setValue(value + 1)
        }

        const decrease = () => {
            setValue(value - 1)
        }

        const zero = () => {
            setValue(0)
        }

        return {
            value,
            increase,
            decrease,
            zero
        }
    }

Our custom hook uses the `useState` hook internally to create its state. The same hook could be reused in the application that was keeping track of the number of clicks made to the left and right buttons:

    const App = () => {
        const left = useCounter()
        const right = useCounter()

        return (
            <div>
            {left.value}
            <button onClick={left.increase}>
                left
            </button>
            <button onClick={right.increase}>
                right
            </button>
            {right.value}
            </div>
        )
    }

## Spread Attributes

Since the `name` object has exactly all of the attributes that the input element expects to receive as props, we can pass the props to the element using the spread syntax in the following way:

    <input {...name} />

## More about hooks

The internet is starting to fill up with more and more helpful material related to hooks. The following sources are worth checking out:

Awesome React Hooks Resources (https://github.com/rehooks/awesome-react-hooks)
Easy to understand React Hook recipes by Gabe Ragland (https://usehooks.com/)
Why Do React Hooks Rely on Call Order? (https://overreacted.io/why-do-hooks-rely-on-call-order/)

# Styles

## React Bootstrap

    npm install react-bootstrap

## Material UI

    npm install @mui/material @emotion/react @emotion/styled

## Styled Components

    npm install styled-components

# Webpack

## Bundling

Even though ES6 modules are defined in the ECMAScript standard, the older browsers do not know how to handle code that is divided into modules.

For this reason, code that is divided into modules must be bundled for browsers, meaning that all of the source code files are transformed into a single file that contains all of the application code.

    npm install --save-dev webpack webpack-cli

Installs the webpack module

    npm run build

Build the app

## Bundling React

    npm install react react-dom

Installs the library for building a minimal React application

## Loaders

By default, webpack only knows how to deal with plain JavaScript. Webpack states that we may need an appropriate loader to bundle the App.js file correctly.

We can use _loaders_ to inform webpack of the files that need to be processed before they are bundled.

    npm install @babel/core babel-loader @babel/preset-react --save-dev

Installs the load and required packages as a development dependency

If the bundled application's source code uses async/await, the browser will not render anything on some browsers. We now have to install two more missing dependencies, that is `core-js` and `regenerator-runtime`.

    npm install core-js regenerator-runtime

## Transpilers

The process of transforming code from one form of JavaScript to another is called _transpiling_. The general definition of the term is to compile source code by transforming it from one language to another.

The transpilation process that is executed by Babel is defined with _plugins_. In practice, most developers use ready-made presets that are groups of pre-configured plugins. Currently, we are using the `@babel/preset-react` preset for transpiling the source code of our application.

Install the preset with the command:

    npm install @babel/preset-env --save-dev

## CSS

The job of the _css loader_ is to load the CSS files and the job of the _style loader_ is to generate and inject a style element that contains all of the styles of the application.

Install the loaders:

    npm install style-loader css-loader --save-dev

## weback-dev-server

Every time we make a change to the code, we have to bundle it and refresh the browser to test the code. The `webpack-dev-server` offers a solution to our problems.

    npm install --save-dev webpack-dev-server

When we make changes to the code, the browser will automatically refresh the page. However, the result of the bundling exists only in memory.

## Source Map

Fixing the error message in this respect is quite easy. We will ask webpack to generate a so-called _source map_ for the bundle, which makes it possible to map errors that occur during the execution of the bundle to the corresponding part in the original source code.

# Minification

When we deploy the application to production, we are using the main.js code bundle that is generated by webpack. The size of the main.js file is 1009487 bytes even though our application only contains a few lines of our code. The large file size is because the bundle also contains the source code for the entire React library.

The optimization process for JavaScript files is called _minification_. One of the leading tools intended for this purpose is `UglifyJS`.

    "build": "webpack --mode=production"

## Polyfill

If we want the application to be IE-compatible, we need to add a `polyfill`, which is code that adds the missing functionality to older browsers.

# Useful libraries and interesting links

If your application has to handle complicated data

- https://www.npmjs.com/package/lodash

If you prefer the functional programming style

- https://ramdajs.com/

If you are handling times and dates

- https://github.com/date-fns/date-fns

If you have complex forms in your apps

- https://react-hook-form.com/

If your application displays graphs, there are multiple options to choose from

- https://recharts.org/en-US/
- https://github.com/highcharts/highcharts-react

Gathering of analytics data on the interaction between the users and the page is more challenging than for traditional web applications where the entire page is loaded

- https://github.com/react-ga/react-ga

Best practice for React

- https://reactpatterns.com/
- https://vasanthk.gitbooks.io/react-bits/content/
