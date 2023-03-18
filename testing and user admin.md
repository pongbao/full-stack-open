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
