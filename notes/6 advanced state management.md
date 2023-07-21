# Flux Architecture and Redux

In Flux, the state is separated from the React components and into its own _stores_. State in the store is not changed directly, but with different _actions_.

## Redux

Create a new create-react-app-application and install redux with the command

    npm install redux

As in Flux, in Redux the state is also stored in a _store_. The state of the store is changed with actions. Actions are objects, which have at least a field determining the type of the action.

The impact of the action to the state of the application is defined using a reducer. In practice, a reducer is a function that is given the current state and an action as parameters. It returns a **new** state. The switch statement is the most common approach to writing a reducer.

    const counterReducer = (state = 0, action) => {
        switch (action.type) {
          case 'INCREMENT':
            return state + 1
          case 'DECREMENT':
            return state - 1
          case 'ZERO':
            return 0
          default: // if none of the above matches, code comes here
            return state
        }
    }

Reducer is never supposed to be called directly from the application's code. Reducer is only given as a parameter to the createStore-function which creates the store:

    import { createStore } from 'redux'

    const counterReducer = (state = 0, action) => {
      // ...
    }

    const store = createStore(counterReducer)

The store now uses the reducer to handle actions, which are dispatched or 'sent' to the store with its dispatch method.

    store.dispatch({ type: 'INCREMENT' })

The third important method the store has is subscribe, which is used to create callback functions the store calls whenever an action is dispatched to the store.

    store.subscribe(() => {
      const storeNow = store.getState()
      console.log(storeNow)
    })

## Pure functions, immutable

A reducer state must be composed of **immutable** objects. If there is a change in the state, the **old object is not changed**, but it is **replaced with a new, changed, object**.

Install the library as a development dependency

    npm install --save-dev deep-freeze

`deepFreeze` ensures that the reducer does not change the state of the store given to it as a parameter.

## Forwarding Redux Store to various components

Install react-redux

    npm install react-redux

The `useDispatch` hook provides any React component access to the dispatch function of the Redux `store` defined in `index.js`

The component can access the notes stored in the `store` with the `useSelector` hook of the react-redux library. `useSelector` receives a function as a parameter. The function either searches for or selects data from the Redux store.

# Many Reducers

We can create the actual reducer for our application by combining the two existing reducers with the `combineReducers` function. The combined reducer works in such a way that every action gets handled in every part of the combined reducer.

Redux Toolkit is a library that solves these common Redux-related problems.

    npm install @reduxjs/toolkit

Create the store using Redux Toolkit's `configureStore` function. We can easily create reducer and related action creators using the `createSlice` function. The `createSlice` function's `name` parameter defines the prefix which is used in the action's type values. For example, the `createNote` action defined later will have the `type` value of **notes/createNote**.

    dispatch(createNote('Redux Toolkit is awesome!'))

responds to dispatching the object:

    dispatch({ type: 'notes/createNote', payload: 'Redux Toolkit is awesome!' })

Redux Toolkit utilizes the _Immer_ library with reducers created by `createSlice` function, which makes it possible to mutate the state argument inside the reducer. Immer uses the mutated state to produce a new, immutable state and thus the state changes remain immutable.

# Communicating with server using redux

install json-server for the project (automaticaly generates IDs)

    npm install json-server --save-dev

add axios to the project

    npm install axios

## Redux Thunk

The use of the library doesn't need any additional configuration or even installation when the Redux store is created using the Redux Toolkit's `configureStore` function. Components would dispatch an action without the need to know about the communication between the server that happens behind the scenes. With Redux Thunk it is possible to implement _action creators_ which return a function instead of an object.

# React Query, useReducer, and the context

## React Query

React Query library can be used to store and manage data retrieved from the server.

Install the library with the command

    npm install react-query

Retrieving data from the server is still done in the familiar way with the Axios `get` method. However, the Axios method call is now wrapped in a query formed with the `useQuery` function. The first parameter of the function call is a string _notes_ which acts as a _key_ to the query defined, i.e. the list of notes.

The return value of the `useQuery` function is an object that indicates the status of the query.

## useMutation

To create a new note, a mutation is defined using the function `useMutation`

The new note is saved on the server, but it is not updated on the screen.

In order to render a new note as well, we need to tell React Query that the old result of the query whose key is the string notes should be invalidated.

Fortunately, invalidation is easy, it can be done by defining the appropriate `onSuccess` callback function to the mutation

## Optimizing performance

Making an extra HTTP GET request doesn't really matter, but in some situations it might put a strain on the server.

If necessary, it is also possible to optimize performance by manually updating the query state maintained by React Query.

By reading the documentation, we notice that the default functionality of React Query's queries is that the queries (whose status is stale) are updated when _window focus_, i.e. the active element of the application's user interface, changes. If we want, we can turn off the functionality by creating a query as follows:

    const App = () => {
    // ...
    const result = useQuery('notes', getNotes, {
        refetchOnWindowFocus: false // highlight-line
    })

    // ...
    }

## React Query vs. Redux

React Query can partially replace the state of the application in some cases, but as the documentation states

- React Query is a **server-state library**, responsible for managing asynchronous operations between your server and client
- Redux, etc. are **client-state libraries** that can be used to store asynchronous data, albeit inefficiently when compared to a tool like - React Query

So React Query is a library that maintains the server state in the **frontend**, i.e. acts as a cache for what is stored on the server. React Query simplifies the processing of data on the server, and can in some cases eliminate the need for data on the server to be saved in the frontend state.

## Using context for passing state to components

One solution would be to pass values as props in the usual way. The solution works, but is not optimal. If the component structure gets complicated, e.g. the dispatcher should be forwarded using props through many components to the components that need it, even though the components in between in the component tree do not need the dispatcher. This phenomenon is called _prop drilling_.

### Context API

React's context is a kind of global state of the application, to which it is possible to give direct access to any component app. The context is created with React's hook `createContext`.
