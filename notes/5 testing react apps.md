# Login at frontend

Commonly used React trick is used to render the forms conditionally

    {
    user === null && loginForm()
    }

## Saving the token to the browser's local storage

Local Storage is a `key-value` database in the browser.

It is very easy to use. A _value_ corresponding to a certain _key_ is saved to the database with the method `setItem`. For example:

    window.localStorage.setItem('name', 'juha tauriainen')

saves the string given as the second parameter as the value of the key name.

The value of a key can be found with the method getItem:

    window.localStorage.getItem('name')

and removeItem removes a key.

Values saved to the storage are DOMstrings, so we cannot save a JavaScript object as it is. The object has to be converted to a JSON string first, with the method JSON.stringify. Correspondingly, when a JSON string is read from the local storage, it has to be parsed back to JavaScript with JSON.parse.

We still have to modify our application so that when we enter the page, the application checks if user details of a logged-in user can already be found on the local storage. If they can, the details are saved to the state of the application and to noteService.

The right way to do this is with an effect hook

## A note on using local storage

No matter how the validity of tokens is checked and ensured, saving a token in the local storage might contain a security risk if the application has a security vulnerability that allows Cross Site Scripting (XSS) attacks. An XSS attack is possible if the application would allow a user to inject arbitrary JavaScript code (e.g. using a form) that the app would then execute. When using React sensibly it should not be possible since React sanitizes all text that it renders, meaning that it is not executing the rendered content as JavaScript.

If one wants to play safe, the best option is to not store a token in local storage. This might be an option in situations where leaking a token might have tragic consequences.

It has been suggested that the identity of a signed-in user should be saved as httpOnly cookies, so that JavaScript code could not have any access to the token. The drawback of this solution is that it would make implementing SPA applications a bit more complex. One would need at least to implement a separate page for logging in.

However, it is good to notice that even the use of httpOnly cookies does not guarantee anything. It has even been suggested that httpOnly cookies are not any safer than the use of local storage.

So no matter the used solution the most important thing is to minimize the risk of XSS attacks altogether.

# props.children and proptypes

## References to components with ref

### useRef

The `useRef` hook is used to create a noteFormRef ref, that is assigned to the Togglable component containing the creation note form. The noteFormRef variable acts as a reference to the component. This hook ensures the same reference (ref) that is kept throughout re-renders of the component.

`useRef` is particularly useful when you need to access a value or element within a component, but you don't want to trigger a re-render when that value or element changes.

    import React, { useRef } from 'react';

    function MyComponent() {
    const buttonRef = useRef();

    const handleClick = () => {
        buttonRef.current.style.color = 'red';
    };

    return (
        <div>
        <button ref={buttonRef} onClick={handleClick}>
            Click me!
        </button>
        </div>
        );
    }

### forwardRef

`forwardRef` is another React hook that is used for forwarding refs from a parent component to a child component.

    // ChildComponent.js
    import React from 'react';

    const ChildComponent = React.forwardRef((props, ref) => {
        return <input type="text" ref={ref} />;
    });

    export default ChildComponent;

    // ParentComponent.js
    import React, { useRef } from 'react';
    import ChildComponent from './ChildComponent';

    const ParentComponent = () => {
        const inputRef = useRef(null);

        const handleButtonClick = () => {
            inputRef.current.focus();
        };

        return (
            <div>
                <ChildComponent ref={inputRef} />
                <button onClick={handleButtonClick}>Focus Input</button>
            </div>
        );
    };

export default ParentComponent;

### useRef vs. forwardRef

forwardRef is used to pass a ref from a parent component to a child component. It allows a parent component to access the child component's ref, which can be useful for triggering child component methods, focusing on child component inputs, or accessing the child component's internal state.

useRef is used to create a ref object that can be attached to any element or component. It allows you to store a mutable value that persists across component renders, which can be useful for accessing or modifying the DOM node or internal state of an element or component.

### useImperativeHandle

To recap, the useImperativeHandle function is a React hook, that is used for defining functions in a component, which can be invoked from outside of the component.

## PropTypes

We would like to enforce that when the Togglable component is used, the button label text prop must be given a value.

The expected and required props of a component can be defined with the prop-types package. Let's install the package:

    npm install prop-types

We can define the buttonLabel prop as a mandatory or required string-type prop as shown below:

    Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired
    }

# Testing React apps

Tests will be implemented with the same Jest testing library developed by Facebook that was used in the previous part. Jest is configured by default to applications created with create-react-app. In addition to Jest, we also need another testing library that will help us render components for testing purposes. The current best option for this is react-testing-library which has seen rapid growth in popularity in recent times.

    npm install --save-dev @testing-library/react @testing-library/jest-dom

The `screen` object provides a set of utility functions that allow you to query the DOM based on various criteria, such as the element's role, label, text content, and more. For example, you can use the `screen.getByRole()` function to find an element based on its role attribute, or the `screen.getByText()` function to find an element based on its text content.

import { render, screen } from "@testing-library/react";
import Note from "./Note";

    test("renders content", () => {
        const note = {
            content: "Component testing is done with react-testing-library",
            important: true,
        };
        render(<Note note={note} />);

        const element = screen.getByText(
            "Component testing is done with react-testing-library"
        );
        expect(element).toBeDefined();
    });

Create-react-app configures tests to be run in watch mode by default, which means that the npm test command will not exit once the tests have finished, and will instead wait for changes to be made to the code. Once new changes to the code are saved, the tests are executed automatically after which Jest goes back to waiting for new changes to be made.

If you want to run tests "normally", you can do so with the command:

    $env:CI=$true; npm test

The console may issue a warning if you have not installed Watchman.

https://facebook.github.io/watchman/

## Debugging

Object screen has method debug that can be used to print the HTML of a component to the terminal.

    screen.debug()

It is also possible to use the same method to print a wanted element to console

    screen.debug(element)

Library user-event that makes simulating user input a bit easier

    npm install --save-dev @testing-library/user-event

## Clicking buttons

The event handler is a mock function defined with Jest:

    const mockHandler = jest.fn()

A session is started to interact with the rendered component:

    const user = userEvent.setup()

The test finds the button based on the text from the rendered component and clicks the element:

    const button = screen.getByText('make not important')
    await user.click(button)

Clicking happens with the method click of the userEvent-library. The expectation of the test verifies that the mock function has been called exactly once.

    expect(mockHandler.mock.calls).toHaveLength(1)

## getAllByRole

    const inputs = screen.getAllByRole('textbox')

    await user.type(inputs[0], 'testing a form...')

Method `getAllByRole` now returns an array and the right input field is the first element of the array. However, this approach is a bit suspicious since it relies on the order of the input fields. Finding the right input field is easy with the method `getByPlaceholderText`.

## Finding elements

the `getByText` command that the test uses does not find the element

    test('renders content', () => {
        const note = {
            content: 'Does not work anymore :(',
            important: true
        }

        render(<Note note={note} />)

        const element = screen.getByText('Does not work anymore :(')

        expect(element).toBeDefined()
    })

Command `getByText` looks for an element that has the same text that it has as a parameter, and nothing more. If we want to look for an element that contains the text, we could use an extra option:

    const element = screen.getByText(
        'Does not work anymore :(', { exact: false }
    )

or we could use the command `findByText`:

    const element = await screen.findByText('Does not work anymore :(')

It is important to notice that, unlike the other ByText commands, findByText returns a promise!

There are situations where yet another form of the command `queryByText` is useful. The command returns the element but it does not cause an exception if the element is not found.

We could eg. use the command to ensure that something is not rendered to the component:

    test('does not render this', () => {
        const note = {
            content: 'This is a reminder',
            important: true
        }

        render(<Note note={note} />)

        const element = screen.queryByText('do not want this thing to be rendered')
        expect(element).toBeNull()
    })

We can easily find out the coverage of our tests by running them with the command.

    CI=true npm test -- --coverage

## Snapshot Testing

Developers do not need to define any test themselves, it is simple enough to adopt snapshot testing

    www.jestjs.io/docs/snapshot-testing

# End-to-end testing

## Cypress

Cypress is exceptionally easy to use, and when compared to Selenium, for example, it requires a lot less hassle and headache. Its operating principle is radically different than most E2E testing libraries because Cypress tests are run completely within the browser.

    npm install --save-dev cypress

Installs Cypress to the **frontend** as a development dependency

    "cypress:open": "cypress open"

Add to scripts in the **frontend** package.json

    "start:test": "cross-env NODE_ENV=test node index.js"

Add to scripts in the **backend** package.json

**Run both frotend and backend before using cypress**

Mocha recommends that arrow functions are not used, because they might cause some issues in certain situations.

    cy.visit(url)

Visit a url

    cy.contains(string)

Search for a string in page

    cy.get(selector)

Search for elements by css selector

When developing a new test or when debugging a broken test, we can define the test with it.only instead of it, so that Cypress will only run the required test.

Using should is a bit trickier than using contains, but it allows for more diverse tests than contains which works based on text content only.

https://docs.cypress.io/guides/references/assertions#Common-Assertions

We can, for example, make sure that the error message is red and it has a border:

    it('login fails with wrong password', function() {
        // ...

        cy.get('.error').should('contain', 'wrong credentials')
        cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
        cy.get('.error').should('have.css', 'border-style', 'solid')
    })

The Cypress documentation gives us the following advice: Fully test the login flow – but only once!. So instead of logging in a user using the form in the beforeEach block, Cypress recommends that we bypass the UI and do an HTTP request to the backend to log in. The reason for this is that logging in with an HTTP request is much faster than filling out a form.
