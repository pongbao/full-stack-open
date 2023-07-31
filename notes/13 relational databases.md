# Using Sequelize

## Fly.io

A psql console connection to the database can be opened as follows

    flyctl postgres connect -a <app_name-db>

When using Fly.io, the local connection to the database should first be enabled by tunneling the localhost port 5432 to the Fly.io database port using the following command

    flyctl proxy 5432 -a <app-name>-db

## Application database

CREATE TABLE notes (
id SERIAL PRIMARY KEY,
content text NOT NULL,
important boolean,
date time
);

In addition to the notes table, Postgres created a subtable called _notes_id_seq_, which keeps track of what value is assigned to the id column when creating the next note.

## Sequelize

    npm install pg sequelize

Installs postgres and sequelize libraries.

Sequelize is a so-called **Object relational mapping (ORM) library** that allows you to store JavaScript objects in a relational database without using the SQL language itself, similar to Mongoose that we used with MongoDB.

We defined `underscored: true`, which means that table names are derived from model names as plural snake case versions. Practically this means that, if the name of the model, as in our case is "Note", then the name of the corresponding table is its plural version written with a lower case initial letter, i.e. notes. If, on the other hand, the name of the model would be "two-part", e.g. StudyGroup, then the name of the table would be `study_groups`. Sequelize automatically infers table names, but also allows explicitly defining them.

We also defined that the table does not have to use the timestamps columns (created_at and updated_at).

Calling the build method does not save the object in the database yet, so it is still possible to edit the object before the actual save event:

    const note = Note.build(req.body)
    note.important = true
    await note.save()

If the object being created is not valid, there is an error message as a result. For example, when trying to create a note without content, the operation fails, and the console reveals the reason to be _SequelizeValidationError: notNull Violation Note.content cannot be null:_

## Creating databases automatically

That is, when the application starts, the command CREATE TABLE IF NOT EXISTS "notes"... is executed which creates the table _notes_ if it does not already exist.

    Note.sync()

Searching for a single note is possible with the method `findByPk`, because it is retrieved based on the id of the primary key
