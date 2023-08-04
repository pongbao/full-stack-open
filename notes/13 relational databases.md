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

## Connection between tables

    User.hasMany(Note)
    Note.belongsTo(User)
    Note.sync({ alter: true })
    User.sync({ alter: true })

## Operators

https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#operators

# Migrations

We could proceed as before, i.e. change the model that defines the table and rely on Sequelize to synchronize the changes to the database. This is specified by these lines in the file models/index.js

    Note.sync({ alter: true })
    User.sync({ alter: true })

However, this approach does not make sense in the long run. Let's remove the lines that do the synchronization and move to using a much more robust way, **migrations** provided by Sequelize (and many other libraries).

In practice, a migration is a single JavaScript file that describes some modification to a database. A separate migration file is created for each single or multiple changes at once. Sequelize keeps a record of which migrations have been performed, i.e. which changes caused by the migrations are synchronized to the database schema. When creating new migrations, Sequelize keeps up to date on which changes to the database schema are yet to be made. In this way, changes are made in a controlled manner, with the program code stored in version control.

## umzug

We could run the migrations from the command line using the Sequelize command line tool. However, we choose to perform the migrations manually from the program code using the Umzug library. Let's install the library

    npm install umzug

## Eager fetch vs lazy fetch

### Eager fetch

When we make queries using the `include`` attribute:

    User.findOne({
        include: {
            model: Note
        }
    })

The so-called **eager fetch** occurs, i.e. all the rows of the tables attached to the user by the join query, in the example the notes made by the user, are fetched from the database at the same time.

### Lazy fetch

%here are also situations where you want to do a so-called **lazy fetch**, e.g. search for user related teams only if they are needed.

## Migration and model redundancy

Couldn't we optimize the code so that, for example, the model exports the shared parts needed for the migration?

However, the problem is that the definition of the model may change over time, for example the name field may change or its data type may change. Migrations must be able to be performed successfully at any time from start to end, and if the migrations are relying on the model to have certain content, it may no longer be true in a month or a year's time. Therefore, despite the "copy paste", the migration code should be completely separate from the model code.

### Sequelize CLI

Generates both models and migration files based on commands given at the command line. For example, the following command would create a User model with name, username, and admin as attributes, as well as the migration that manages the creation of the database table:

    npx sequelize-cli model:generate --name User --attributes name:string,username:string,admin:boolean
