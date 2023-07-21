# Introduction - Setup

## Expo

For the development of our application, we will be using Expo. Expo is a platform that eases the setup, development, building, and deployment of React Native applications. Let's get started with Expo by initializing our project with create-expo-app:

    npx create-expo-app rate-repository-app --template expo-template-blank

Next, let's navigate to the created rate-repository-app directory with the terminal and install a few dependencies we'll be needing soon:

    npx expo install react-native-web@0.18.10 react-dom@18.2.0 @expo/webpack-config@^18.0.1

Side Note: I personally needed to do `npm install expo` and `npm install uuid` to remove the warnings

The script starts the Metro bundler which is a JavaScript bundler for React Native. It can be described as the Webpack of the React Native ecosystem. In addition to the Metro bundler, the Expo command-line interface should be open in the terminal window.

## Android Studio

https://docs.expo.dev/workflow/android-studio-emulator/

## Expo mobile app

Install the mobile app and scan the qr code after running `npm start`

## ESLint

Install the lint

    npm install --save-dev eslint @babel/eslint-parser eslint-plugin-react eslint-plugin-react-native

Create .eslintrc file

    {
        "plugins": ["react", "react-native"],
        "settings": {
            "react": {
            "version": "detect"
            }
        },
        "extends": [
            "eslint:recommended",
            "plugin:react/recommended",
            "@babel/preset-env",
            "@babel/preset-react"
        ],
        "parser": "@babel/eslint-parser",
        "env": {
            "react-native/react-native": true
        },
        "rules": {
            "react/prop-types": "off",
            "react/react-in-jsx-scope": "off"
        }
    }

## Debugger

https://stackoverflow.com/questions/76098915/expo-js-debugger-connects-to-chrome-instead-of-react-native-debugger

# Basics

## Core Components

https://reactnative.dev/docs/components-and-apis

## Router

Let's get started by installing the react-router-native library:

    npm install react-router-native

## Formik

One of the libraries in the React ecosystem that ease the state management of forms

The main concepts of Formik are the _context_ and the _field_. The Formik's co*ntext is provided by the Formik component that contains the form's *state\*. The state consists of information on a form's fields. This information includes for example the **value** and **validation errors** of each field. State's fields can be referenced by their name using the `useField` hook or the `Field` component.

    npm install formik

## Expo Snack

Expo Snack is an online editor for React Native, similar to JSFiddle and CodePen. It is a useful platform for quickly trying out code.

https://snack.expo.dev/

## Form validation

The second approach is the validation schema which is provided for the Formik component as the value of the _validationSchema_ prop. This validation schema can be created with a validation library called **Yup**. Let's get started by installing Yup:

    npm install yup

## Platform

A big benefit of React Native is that we don't need to worry about whether the application is run on an Android or iOS device. However, there might be cases where we need to execute platform-specific code. Such cases could be for example using a different implementation of a component on a different platform.

We can access the user's platform through the `Platform.OS` constant

    import { React } from 'react';
    import { Platform, Text, StyleSheet } from 'react-native';

    const styles = StyleSheet.create({
    text: {
        color: Platform.OS === 'android' ? 'green' : 'blue',
        },
    });

    const WhatIsMyPlatform = () => {
        return <Text style={styles.text}>Your platform is: {Platform.OS}</Text>;
    }

Possible values for the `Platform.OS constants` are _android_ and _ios_. Another useful way to define platform-specific code branches is to use the `Platform.select` method. Given an object where keys are one of ios, android, native and default, the `Platform.select` method returns the most fitting value for the platform the user is currently running on. We can rewrite the styles variable in the previous example using the Platform.select method like this:

    const styles = StyleSheet.create({
        text: {
            color: Platform.select({
            android: 'green',
            ios: 'blue',
            default: 'black',
            }),
        },
    });

We can even use the `Platform.select` method to require a platform-specific component:

    const MyComponent = Platform.select({
        ios: () => require('./MyIOSComponent'),
        android: () => require('./MyAndroidComponent'),
    })();

    <MyComponent />;

However, a more sophisticated method for implementing and importing platform-specific components (or any other piece of code) is to use the `.ios.jsx` and `.android.jsx` file extensions. Note that the `.jsx` extension can as well be any extension recognized by the bundler, such as `.js`. We can for example have files `Button.ios.jsx` and `Button.android.jsx` which we can import like this:

    import Button from './Button';

    const PlatformSpecificButton = () => {
        return <Button />;
    };

Now, the Android bundle of the application will have the component defined in the `Button.android.jsx` whereas the iOS bundle the one defined in the `Button.ios.jsx file`.

# Communicating with server

In our React Native application, we will be using the same `@apollo/client` library as in part 8. Let's get started by installing the library along with the graphql library which is required as a peer dependency:

    npm install @apollo/client graphql

Before we can start using Apollo Client, we will need to slightly configure the Metro bundler so that it handles the `.cjs` file extensions used by the **Apollo Client**. First, let's install the `@expo/metro-config` package which has the default **Metro** configuration:

    npm install @expo/metro-config

Then, we can add the following configuration to a `metro.config.js` in the `root` directory of our project:

    const { getDefaultConfig } = require('@expo/metro-config');

    const defaultConfig = getDefaultConfig(\_\_dirname);

    defaultConfig.resolver.sourceExts.push('cjs');

    module.exports = defaultConfig;

## Environmental Variables

Unfortunately, React Native doesn't have direct support for environment variables. However, we can access the Expo configuration defined in the `app.json` file at runtime from our JavaScript code. This configuration can be used to define and access environment dependant variables.

The configuration can be accessed by importing the `Constants` constant from the `expo-constants` module as we have done a few times before. Once imported, the `Constants.manifest` property will contain the configuration.

The next step is to use the configuration to define environment dependant variables in our application. Let's get started by renaming the `app.json file` to `app.config.js`. Once the file is renamed, we can use JavaScript inside the configuration file. Change the file contents so that the previous object:

    {
        "expo": {
            "name": "rate-repository-app",
            // rest of the configuration...
        }
    }

Is turned into an export, which contains the contents of the expo property:

    export default {
        name: 'rate-repository-app',
        // rest of the configuration...
    }

Expo has reserved an extra property in the configuration for any application-specific configuration. To see how this works, let's add an env variable into our application's configuration:

    export default {
        name: 'rate-repository-app',
        // rest of the configuration...
        extra: {
            env: process.env.ENV
        },
    };

## Storing in user's device

One such common scenario is storing the user's authentication token so that we can retrieve it even if the user closes and reopens our application. In web development, we have used the browser's `localStorage` object to achieve such functionality. React Native provides similar persistent storage, the `AsyncStorage`.

We can use the npx expo install command to install the version of the `@react-native-async-storage/async-storage` package that is suitable for our Expo SDK version:

    npx expo install @react-native-async-storage/async-storage

Operations of `AsyncStorage` are asynchronous. Because `AsyncStorage` operates with string keys in a global namespace it is a good idea to create a simple abstraction for its operations. This abstraction can be implemented for example using a _class_.

## Using stored data

We also provided the storage instance for the `createApolloClient` function as an argument. This is because next, we will send the access token to Apollo Server in each request. The Apollo Server will expect that the access token is present in the Authorization header in the format Bearer <ACCESS_TOKEN>. We can enhance the Apollo Client's request by using the `setContext` function.

# Testing

For testing an Expo based React Native application with Jest, Expo provides a set of Jest configuration in a form of jest-expo preset. In order to use ESLint in the Jest's test files, we also need the eslint-plugin-jest plugin for ESLint. Let's get started by installing the packages:

    npm install --save-dev jest jest-expo eslint-plugin-jest

The `transform` option tells Jest to transform `.js` and `.jsx` files with the Babel compiler. The `transformIgnorePatterns` option is for ignoring certain directories in the `node_modules` directory while transforming files. This Jest configuration is almost identical to the one proposed in the Expo's documentation (https://docs.expo.io/guides/testing-with-jest/).

In addition to the React Native Testing Library, we need a set of React Native specific Jest matchers such as `toHaveTextContent` and `toHaveProp`. These matchers are provided by the jest-native library.

    npm install --save-dev --legacy-peer-deps react-test-renderer@18.2.0 @testing-library/react-native @testing-library/jest-native

If you face peer dependency issues, make sure that the react-test-renderer version matches the project's React version in the npm install command above. You can check the React version by running `npm list react --depth=0`.

If the installation fails due to peer dependency issues, try again using the `--legacy-peer-deps` flag with the npm install command.

Create a file `setupTests.js` in the root directory of your project, that is, the same directory where the `package.json` file is located. In that file add the following line:

    import '@testing-library/jest-native/extend-expect';

How to query: https://callstack.github.io/react-native-testing-library/docs/how-should-i-query

## Expo linking

To learn how to open a URL in a browser, read the Expo's Linking API documentation (https://docs.expo.dev/versions/latest/sdk/linking/). You will need this feature while implementing the button for opening the repository in GitHub. The `Linking.openURL` method will come in handy.

## Date formatting

You can for example install the `date-fns` library and use the format function for formatting the creation date.

## React Native Paper

https://reactnativepaper.com/

## use-debounce

To avoid a multitude of unnecessary requests while the user types the keyword fast, only pick the latest input after a short delay. This technique is often referred to as **debouncing**. The `use-debounce library` is a handy hook for debouncing a state variable. Use it with a sensible delay time, such as 500 milliseconds.

## Cursor-based Pagination

When an API returns an ordered list of items from some collection, it usually returns a subset of the whole set of items to reduce the required bandwidth and to decrease the memory usage of the client applications. The desired subset of items can be parameterized so that the client can request for example the first twenty items on the list after some index. This technique is commonly referred to as **pagination**. When items can be requested after a certain item defined by a cursor, we are talking about **cursor-based pagination**(https://relay.dev/graphql/connections.htm).

    {
    repositories(first: 2) {
        totalCount
        edges {
        node {
            id
            fullName
            createdAt
        }
        cursor
        }
        pageInfo {
        endCursor
        startCursor
        hasNextPage
        }
    }

## Infinite scrolling

Vertically scrollable lists in mobile and desktop applications are commonly implemented using a technique called **infinite scrolling**. The principle of infinite scrolling is quite simple:

- Fetch the initial set of items
- When the user reaches the last item, fetch the next set of items after the last item
