# Intro to React

`npx create-react-app <app-name>`

- creates a React-based app

`npm start`

- runs the app in an external browser

## App.js

- contains all components
- import all components into the index.js file

## index.js

- main JS file

## Rules

1. Always keep the console open
2. Components should be capitalized
3. Wrap components inside a <div> tag or a `<>` fragment
4. Do not render objects

   const App = () => {
   const friends = [ 'Peter', 'Maya']
   console.log(friends)
   return (
    <div>
    <p>{friends}</p>
    </div>
    )
   }

   - this prints out `PeterMaya` in the console

# JavaScript

## ECMAScript

- official name of the JavaScript standard
- latest version as of date is ES13

## concat

In React code, it is preferable to use the method `concat`, which creates a new array with the added item. This ensures the original array remains unchanged.

    const t = [1, -1, 3]

    const t2 = t.concat(5) // creates new array

    console.log(t) // [1, -1, 3] is printed
    console.log(t2) // [1, -1, 3, 5] is printed

## map

Based on the old array, map creates a new array, for which the function given as a parameter is used to create the items

    const t = [1, 2, 3]

    const m1 = t.map(value => value * 2)
    console.log(m1)   // [2, 4, 6] is printed

Map can also transform the array into something completely different

    const m2 = t.map(value => '<li>' + value + '</li>')
    console.log(m2)
    // [ '<li>1</li>', '<li>2</li>', '<li>3</li>' ] is printed

## Destructuring Arrays

    const t = [1, 2, 3, 4, 5]

    const [first, second, ...rest] = t

    console.log(first, second)  // 1, 2 is printed
    console.log(rest)          // [3, 4, 5] is printed

- the variables `first` and `second` will receive the first two integers of the array as their values. The remaining integers are "collected" into an array of their own which is then assigned to the variable `rest`

## Objects

The properties of an object are referenced by using the "dot" notation, or by using brackets

    console.log(object1.name)         // Arto Hellas is printed
    const fieldName = 'age'
    console.log(object1[fieldName])    // 35 is printed

You can also add properties to an object on the fly by either using dot notation or brackets:

    object1.address = 'Helsinki'
    object1['secret number'] = 12341

# Component state, event handlers

## Component helper functions

- function inside a component that "helps" in the construction of the component render

## UseState

    const [ counter, setCounter ] = useState(0)

The function call adds _state_ to the component and renders it initialized with the value of zero. The function returns an array that contains two items. We assign the items to the variables `counter` and `setCounter` by using the destructuring assignment syntax.

    () => setCounter(counter + 1)

When the state modifying function `setCounter` is called, React re-renders the component which means that the function body of the component function gets re-executed.

The second time the component function is executed it calls the useState function and returns the new value of the state: 1.

**Calling a function that changes the state causes the component to rerender**

_It is forbidden in React to mutate state directly_, since it can result in unexpected side effects. Changing state has to always be done by setting the state to a new object. If properties from the previous state object are not changed, they need to simply be copied, which is done by **copying those properties into a new object and setting that as the new state**.

## State Update

- State update is async

## Debugger

You can pause the execution of your application code in the Chrome developer console's _debugger_, by writing the command `debugger` anywhere in your code

## Rules of Hooks

1. The `useState` function must not be called from inside of a loop or a conditional expression
2. Hooks may only be called from the inside of a function body that defines a React Component

## Components

- Do not define components within components
