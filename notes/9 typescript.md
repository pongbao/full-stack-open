# Background

TypeScript consists of three separate, but mutually fulfilling parts:

- The language
- The compiler
- The language service

image.png

The _language_ consists of syntax, keywords and type annotations. The syntax is similar to but not the same as JavaScript syntax.

The _compiler_ is responsible for type information erasure (i.e. removing the typing information) and for code transformations. Traditionally, _compiling_ means that code is transformed from a human-readable format to a machine-readable format. In TypeScript, human-readable source code is transformed into another human-readable source code, so the correct term would be _transpiling_.

The _language service_ collects type information from the source code. Development tools can use the type information for providing intellisense, type hints and possible refactoring alternatives.

## Key Features

### Type annotations

Type annotations in TypeScript are a lightweight way to record the intended **contract of a function or a variable**. In the example below, we have defined a `birthdayGreeter` function that accepts two arguments: one of type `string` and one of type `number`. The function will return a string.

    const birthdayGreeter = (name: string, age: number): string => {
    return `Happy birthday ${name}, you are now ${age} years old!`;
    };

    const birthdayHero = "Jane User";
    const age = 22;

    console.log(birthdayGreeter(birthdayHero, age));

### Structural Typing

TypeScript is a structurally-typed language. In structural typing, two elements are considered to be compatible with one another if, for each feature within the type of the first element, a corresponding and identical feature exists within the type of the second element. Two types are considered to be identical if they are compatible with each other.

### Type Inference

The TypeScript compiler can attempt to infer the type information if no type has been specified. Variables' type can be inferred based on their assigned value and their usage. The type inference takes place when initializing variables and members, setting parameter default values, and determining function return types.

### Type erasure

TypeScript removes all type system constructs during compilation.

Input:

    let x: SomeType;

Output:

    let x;

## Advantages

1. TypeScript offers type checking and static code analysis. We can require values to be of a certain type, and have the compiler warn about using them incorrectly. This can reduce runtime errors, and you might even be able to reduce the number of required unit tests in a project, at least concerning pure-type tests.

2. The type annotations in the code can function as a type of code-level documentation.

3. IDEs can provide more specific and smarter _IntelliSense_ when they know exactly what types of data you are processing.

## Disadvantages

1. When using external libraries, you may find that some libraries have either missing or in some way invalid type declarations. Most often, this is due to the library not being written in TypeScript, and the person adding the type declarations manually not doing such a good job with it.

https://github.com/DefinitelyTyped/DefinitelyTyped

https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html

2. The type inference in TypeScript is pretty good but not quite perfect. Sometimes, you may feel like you have declared your types perfectly, but the compiler still tells you that the property does not exist or that this kind of usage is not allowed.

3. The errors given by the type system may sometimes be quite hard to understand, especially if you use complex types. As a rule of thumb, the TypeScript error messages have the most useful information at the end of the message. When running into long confusing messages, start reading them from the end.

# Setting up

    npm install -g ts-node typescript

Tnstalls both ts-node and the official typescript package globally

In the `tsconfig.json` file:

    {
      "compilerOptions":{
        "noImplicitAny": false
      }
    }

The compiler option `noImplicitAny` makes it mandatory to have types for all variables used. This option is currently a default, but it lets us define it explicitly.

## @types/{npm_package}

Since the global variable process is defined by Node itself, we get its typings from the package @types/node.

Since version 10.0 ts-node has defined @types/node as a peer dependency. If the version of npm is at least 7.0, the peer dependencies of a project are automatically installed by npm.

If you have an older npm, the peer dependency must be installed explicitly:

    npm install --save-dev @types/node

## The alternative array syntax

Note that there is also an alternative syntax for arrays in TypeScript. Instead of writing

    let values: number[]

we could use the "generics syntax" and write

    let values: Array<number>;

Another note: somehow surprisingly TypeScript does not allow to define the same variable in many files at a "block-scope", that is, outside functions (or classes).

This is actually not quite true. This rule applies only to files that are treated as "scripts". A file is a script if it does not contain any export or import statements. If a file has those, then the file is treated as a module, and the variables do not get defined in the block-scope.

## auto-reloading

To simplify the development, we should enable auto-reloading to improve our workflow:

    npm install --save-dev ts-node-dev

## _any_ type

We already have `noImplicitAny: true` configured in our example, so why does the compiler not complain about the implicit any types? The reason is that the body field of an Express Request object is explicitly typed any. The same is true for the request.query field that Express uses for the query parameters.

What if we would like to restrict developers from using the _any_ type? Fortunately, we have methods other than tsconfig.json to enforce a coding style. What we can do is use ESlint to manage our code. Let's install ESlint and its TypeScript extensions:

    npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser

### .eslintrc

    {
        "parser": "@typescript-eslint/parser",
        "parserOptions": {
            "ecmaVersion": 11,
            "sourceType": "module"
        },
        "plugins": ["@typescript-eslint"],
        "rules": {
            "@typescript-eslint/no-explicit-any": 2
        }
    }

# Typing an Express app

One major change from the previous part is that **we're not going to use ts-node anymore**. It is a handy tool that helps you get started, but in the long run, it is advisable to use the _official TypeScript compiler_ that comes with the typescript npm-package. The official compiler generates and packages JavaScript files from the .ts files so that the built production version won't contain any TypeScript code anymore. This is the exact outcome we are aiming for since TypeScript itself is not executable by browsers or Node.

    npm install typescript --save-dev

We can now initialize our tsconfig.json settings by running:

    npm run tsc -- --init

Note the extra -- before the actual argument! Arguments before -- are interpreted as being for the `npm` command, while the ones after that are meant for the command that is run through the script (i.e. `tsc` in this case).

Configurations:

- The `target` configuration tells the compiler which ECMAScript version to use when generating JavaScript. ES6 is supported by most browsers, so it is a good and safe option.

- `outDir` tells where the compiled code should be placed.

- `module` tells the compiler that we want to use CommonJS modules in the compiled code. This means we can use the old require syntax instead of the import one, which is not supported in older versions of Node, such as version 10.

- `strict` is a shorthand for multiple separate options: noImplicitAny, noImplicitThis, alwaysStrict, strictBindCallApply, strictNullChecks, strictFunctionTypes and strictPropertyInitialization. They guide our coding style to use the TypeScript features more strictly. For us, perhaps the most important is the already-familiar noImplicitAny. It prevents implicitly setting type any, which can for example happen if you don't type the parameters of a function. Details about the rest of the configurations can be found in the tsconfig documentation. Using strict is suggested by the official documentation.

- `noUnusedLocals` prevents having unused local variables, and `noUnusedParameters` throws an error if a function has unused parameters.

- `noImplicitReturns` checks all code paths in a function to ensure they return a value.

- `noFallthroughCasesInSwitch` ensures that, in a switch case, each case ends either with a return or a break statement.

- `esModuleInterop` allows interoperability between CommonJS and ES Modules; see more in the documentation.

Continue by installing express and, of course, also `@types/express`. Also, since this is a real project, which is intended to be grown over time, we will use ESlint from the very beginning:

    npm install express

    npm install --save-dev eslint @types/express @typescript-eslint/eslint-plugin @typescript-eslint/parser

Install ts-node-dev:

    npm install --save-dev ts-node-dev

Our `package.json` should look like this:

    {
        "name": "flight-diaries",
        "version": "1.0.0",
        "description": "",
        "main": "index.js",
        "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1",
            "tsc": "tsc",
            "dev": "ts-node-dev index.ts",
            "lint": "eslint --ext .ts ."
        },
        "author": "",
        "license": "MIT",
        "devDependencies": {
            "@types/express": "^4.17.17",
            "@typescript-eslint/eslint-plugin": "^5.59.7",
            "@typescript-eslint/parser": "^5.59.7",
            "eslint": "^8.41.0",
            "ts-node-dev": "^2.0.0",
            "typescript": "^5.0.4"
        },
        "dependencies": {
            "express": "^4.18.2"
        }
    }

Let's try to create a production build by running the TypeScript compiler. Since we have defined the outdir in our tsconfig.json, nothing's left but to run the script `npm run tsc`.

## Utility Types

Sometimes, we might want to use a specific modification of a type. For example, consider a page for listing some data, some of which is sensitive and some of which is non-sensitive. We might want to be sure that no sensitive data is used or displayed. We could pick the fields of a type we allow to be used to enforce this. We can do that by using the utility type **Pick**.

    const getNonSensitiveEntries =
    (): Pick<DiaryEntry, 'id' | 'date' | 'weather' | 'visibility'>[] => {
        // ...
    }

There's also the **Omit** utility type, which we can use to declare which fields to exclude.

    const getNonSensitiveEntries = (): Omit<DiaryEntry, 'comment'>[] => {
        // ...
    }

One thing in our application is a cause for concern. In `getNonSensitiveEntries`, we are returning the complete diary entries, and no error is given despite typing!

This happens because TypeScript only checks whether we have all of the required fields or not, but excess fields are not prohibited.

Because TypeScript doesn't modify the actual data but only its type, we need to exclude the fields ourselves.

## Enum

_Enums_ are one of the few features TypeScript has which is not a type-level extension of JavaScript.

Enums allow a developer to define a set of named constants. Using enums can make it easier to document intent, or create a set of distinct cases. TypeScript provides both numeric and string-based enums.

## unknown

_unknown_ is the ideal type for our kind of situation of input validation, since we don't yet need to define the type to match any type, but can first verify the type and then confirm the expected type.

# React with types

We can use create-react-app to create a TypeScript app by adding a template argument to the initialization script. So in order to create a TypeScript Create React App, run the following command:

    npx create-react-app my-app --template typescript

Everything else should be more or less fine except that, at the moment, the configuration allows compiling JavaScript files because `allowJs` is set to true. That would be fine if you need to mix TypeScript and JavaScript (e.g. if you are in the process of transforming a JavaScript project into TypeScript or something like that), but we want to **create a pure TypeScript app**, so let's change that configuration to `false`.

## eslintrc

    {
        "env": {
            "browser": true,
            "es6": true,
            "jest": true
        },
        "extends": [
            "eslint:recommended",
            "plugin:react/recommended",
            "plugin:@typescript-eslint/recommended"
        ],
        "plugins": ["react", "@typescript-eslint"],
        "settings": {
            "react": {
            "pragma": "React",
            "version": "detect"
            }
        },
        "rules": {
            "@typescript-eslint/explicit-function-return-type": 0,
            "@typescript-eslint/explicit-module-boundary-types": 0,
            "react/react-in-jsx-scope": 0
        }
    }

## HTMLElement type assertion

You probably noticed that we used a type assertion for the return value of the function `document.getElementById`

    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Welcome name="Sarah" />
    )

We need to do this since the ReactDOM.createRoot takes an `HTMLElement` as a parameter but the return value of function `document.getElementById` has the following type

    HTMLElement | null

since if the function does not find the searched element, it will return `null`.

## Discriminated union

The specific technique of type narrowing where a union type is narrowed based on literal attribute value is called _discriminated union_.

    courseParts.forEach((part) => {
        switch (part.kind) {
        case "basic":
            console.log(part.name, part.description, part.exerciseCount);
            break;
        case "group":
            console.log(part.name, part.exerciseCount, part.groupProjectCount);
            break;
        case "background":
            console.log(
            part.name,
            part.description,
            part.exerciseCount,
            part.backgroundMaterial
            );
            break;
        default:
            break;
        }
    });

## Exhaustive type checking

With TypeScript, we can use a method called exhaustive type checking. Its basic principle is that if we encounter an unexpected value, we call a function that accepts a value with the type _never_ and also has the return type `never`.

    /**
        * Helper function for exhaustive type checking
        */
        const assertNever = (value: never): never => {
        throw new Error(
            `Unhandled discriminated union member: ${JSON.stringify(value)}`
        );
    };

## React app with state

One of the best sources for information about typing React is the React TypeScript Cheatsheet (https://react-typescript-cheatsheet.netlify.app/).

The chapter about `useState` hook instructs to use a type parameter in situations where the compiler can not infer the type.

Let us now define a type for notes:

    interface Note {
        id: number,
        content: string
    }

The solution is now simple:

    const [notes, setNotes] = useState<Note[]>([]);

## Narrowing axios error

https://dev.to/mdmostafizurrahaman/handle-axios-error-in-typescript-4mf9

Note: Axios error can be annoying
