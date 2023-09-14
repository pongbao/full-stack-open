# Postgres docs

Source: https://www.postgresql.org/docs/current/intro-whatis.html

## How to uninstall completely

https://askubuntu.com/questions/32730/how-to-remove-postgres-from-my-installation

## Intro

### What is PostgreSQL

PostgreSQL is an object-relational database management system (ORDBMS) based on POSTGRES, Version 4.2, developed at the University of California at Berkeley Computer Science Department. POSTGRES pioneered many concepts that only became available in some commercial database systems much later.

PostgreSQL is an open-source descendant of this original Berkeley code. It supports a large part of the SQL standard and offers many modern features:

- complex queries
- foreign keys
- triggers
- updatable views
- transactional integrity
- multiversion concurrency control

Also, PostgreSQL can be extended by the user in many ways, for example by adding new

- data types
- functions
- operators
- aggregate functions
- index methods
- procedural languages

And because of the liberal license, PostgreSQL can be used, modified, and distributed by anyone free of charge for any purpose, be it private, commercial, or academic.

### Installation and Setup

#### Download link

https://www.postgresql.org/download/

#### Setup Environmental variables

In system variables, add:

- C:\Program Files\PostgreSQL\15\lib
- C:\Program Files\PostgreSQL\15\bin

#### Add current user

Steps:

- Open pgAdmin
- Right-click on Login/Group Roles
- Create > Login/Group Role...
- In 'General', input username (Windows username)
- In 'Definition', input password
- In 'Privileges', tick everything except streaming replication and backups

## The SQL Language

In the CLI:

- `createdb` creates a database
- `psql <database_name>` will enter the database

In the Postgres Shell:

- `SELECT version();` shows the Postgres version used
- `SELECT current_date;` shows the current date

# tutorialspoint

Source: https://www.tutorialspoint.com/postgresql

## Basics

### SQL Statement

    KEYWORD identifiers KEYWORD identifier

e.g. SELECT id, name FROM states (COMMAND columns CLAUSE table_name)

### Data Types

While creating table, for each column, you specify a data type, i.e., what kind of data you want to store in the table fields.

This enables several benefits −

- **Consistency** − Operations against columns of same data type give consistent results and are usually the fastest.
- **Validation** − Proper use of data types implies format validation of data and rejection of data outside the scope of data type.
- **Compactness** − As a column can store a single type of value, it is stored in a compact way.
- **Performance** − Proper use of data types gives the most efficient storage of data. The values stored can be processed quickly, which enhances the performance.

`CREATE TYPE` command allows users to create a custom data type

_Data Types_
![Data types](data_types.png)

_Monetary Types_
![Monetary Types](monetary_types.png)

_Character Types_
![Character Types](character_types.png)

_Binary Types_
![Alt text](binary_types.png)

_Date and Time Types_
![Date and Time Types](date_types.png)

_Boolean Type_
![Boolean Types](boolean_types.png)

Enumerated Type

CREATE TYPE type AS ENUM ('xxx','yyy','zzz')

Geometric Type
![Geometric Types](geometric_types.png)

## Entering shell

CLI

    psql -U postgres

Start Menu: search for 'SQL Shell'

## Clearing screen

    \! cls

## Create Database

SQL syntax

    CREATE DATABASE dbname;

CLI

    createdb [option...] [dbname [description]];

    $ createdb -h localhost -p 5432 -U postgres testdb;

## Select Database

SQL syntax

    \c [dbname];

CLI

    psql -h [host] -p [port] -U [user] [dbname]

    $ psql -h localhost -p 5432 -U postgres testdb

`\q` to quit

## Drop Database

SQL syntax

    DROP DATABASE [ IF EXISTS ] name;

CLI

    dropdb  [option...] [dbname]

## Create Table

SQL syntax

    CREATE TABLE [table_name](
        column1 datatype,
        column2 datatype,
        column3 datatype,
        .....
        columnN datatype,
        PRIMARY KEY( one or more columns )
    );

List all tables

    \d

Check table

    \d [table_name]

## Drop Table

SQL syntax

    DROP TABLE [table_name];

## Schema

A schema is a named collection of tables. A schema can also contain views, indexes, sequences, data types, operators, and functions. Schemas are analogous to directories at the operating system level, except that schemas cannot be nested. (Note: In my understanding it's like a bookshelf where each shelf in a library contains a certain category)

Advantages of using a Schema

- It allows many users to use one database without interfering with each other.

- It organizes database objects into logical groups to make them more manageable.

- Third-party applications can be put into separate schemas so they do not collide with the names of other objects.

### Create a schema

SQL syntax

    CREATE SCHEMA [schema_name]; # create a schema
    CREATE TABLE [schema_name].[table_name]; # create a table in a schema

    testdb=# create table myschema.company(
        ID   INT              NOT NULL,
        NAME VARCHAR (20)     NOT NULL,
        AGE  INT              NOT NULL,
        ADDRESS  CHAR (25),
        SALARY   DECIMAL (18, 2),
        PRIMARY KEY (ID)
    );

    SELECT * FROM myschema.company # check if schema was produced

### Drop a schema

SQL syntax

    DROP SCHEMA myschema; # drop a schema
    DROP SCHEMA myschema CASCADE; # drop a schema including all contained objects

### View all schemas

SQL syntax

    SELECT schema_name FROM information_schema.schemata; # schema_name is a column in the information_schema.schemata table

## Insert Query

SQL syntax

    INSERT INTO TABLE_NAME (column1, column2, column3,...columnN);
    VALUES (value1, value2, value3,...valueN); # column names can be omitted if all values are provided

Samples

    INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY,JOIN_DATE) VALUES (1, 'Paul', 32, 'California', 20000.00,'2001-07-13');

    INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,JOIN_DATE) VALUES (2, 'Allen', 25, 'Texas', '2007-12-13'); # default inserted into salary as it's not provided

    INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY,JOIN_DATE) VALUES (3, 'Teddy', 23, 'Norway', 20000.00, DEFAULT ); # explicitly insert a default value

    INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY,JOIN_DATE) VALUES (4, 'Mark', 25, 'Rich-Mond ', 65000.00, '2007-12-13' ), (5, 'David', 27, 'Texas', 85000.00, '2007-12-13'); # multi-row values

## Select Query

SQL syntax

    SELECT column1, column2, columnN FROM table_name; # fetch certain columns

    SELECT * FROM table_name; # fetch all columns

## Expressions

SQL Syntax

    SELECT column1, column2, columnN
    FROM table_name
    WHERE [CONDITION | EXPRESSION];

### Boolean

    SELECT column1, column2, columnN
    FROM table_name
    WHERE SINGLE VALUE MATCHING EXPRESSION

Sample

    SELECT * FROM COMPANY WHERE SALARY = 10000;

### Numeric

    SELECT numerical_expression as  OPERATION_NAME
    [FROM table_name WHERE CONDITION];

Sample

    SELECT (15 + 6) AS ADDITION;

### Built-In Functions

- avg()
- sum()
- count()

Sample

    SELECT COUNT(*) AS "RECORDS" FROM COMPANY;

### Date

    SELECT CURRENT_TIMESTAMP # 2013-05-06 14:38:28.078+05:30

## WHERE Clause

SQL Syntax

    SELECT column1, column2, columnN
    FROM table_name
    WHERE [search_condition];

Sample

    SELECT * FROM COMPANY WHERE AGE >= 25 AND SALARY >= 65000;

    SELECT * FROM COMPANY WHERE AGE >= 25 OR SALARY >= 65000;

    SELECT * FROM COMPANY WHERE AGE IS NOT NULL;

    SELECT * FROM COMPANY WHERE NAME LIKE 'Pa%'; # NAME starts with 'Pa', does not matter what comes after 'Pa'.

    SELECT * FROM COMPANY WHERE AGE IN (25, 27); # AGE value is either 25 or 27

    SELECT * FROM COMPANY WHERE AGE NOT IN (25, 27); # AGE value is neither 25 nor 27

    SELECT * FROM COMPANY WHERE AGE BETWEEN 25 AND 27; # AGE value is in BETWEEN 25 AND 27 (inclusive)

    SELECT AGE FROM COMPANY WHERE EXISTS (SELECT AGE FROM COMPANY WHERE SALARY > 65000);
    # if there exists a row  where salary > 65000, return all of the ages in the company db

    SELECT * FROM COMPANY WHERE AGE > (SELECT AGE FROM COMPANY WHERE SALARY > 65000); # select the rows where AGE is higher than the AGE of the row where SALARY > 65000, works only if returned AGE is unique

## AND and OR Conjunctive Operators

### AND Operator

SQL Syntax

    SELECT column1, column2, columnN
    FROM table_name
    WHERE [condition1] AND [condition2]...AND [conditionN];

Sample

    SELECT * FROM COMPANY WHERE AGE >= 25 AND SALARY >= 65000;

### OR Operator

SQL Syntax

    SELECT column1, column2, columnN
    FROM table_name
    WHERE [condition1] OR [condition2]...OR [conditionN]

Sample

    SELECT * FROM COMPANY WHERE AGE >= 25 OR SALARY >= 65000;

## Update Query

SQL Syntax

    UPDATE table_name
    SET column1 = value1, column2 = value2...., columnN = valueN
    WHERE [condition];

Sample

    UPDATE COMPANY SET SALARY = 15000 WHERE ID = 3; # edit a specific row

    UPDATE COMPANY SET ADDRESS = 'Texas', SALARY=20000; # edit the entire table

## Delete Query

SQL Syntax

    DELETE FROM table_name
    WHERE [condition];

Sample

    DELETE FROM COMPANY WHERE ID = 2; # delete a specific row

    DELETE FROM COMPANY; # delete all records

## Like Clause

The PostgreSQL **LIKE** operator is used to match text values against a pattern using wildcards. If the search expression can be matched to the pattern expression, the LIKE operator will return true, which is **1**.

There are two wildcards used in conjunction with the LIKE operator −

- The percent sign (%)
- The underscore (\_)

The percent sign represents zero, one, or multiple numbers or characters. The underscore represents a single number or character. These symbols can be used in combinations.

If either of these two signs is not used in conjunction with the LIKE clause, then the LIKE acts like the equals operator.

SQL Syntax

    SELECT FROM table_name
    WHERE column LIKE 'XXXX%'

    or

    SELECT FROM table_name
    WHERE column LIKE '%XXXX%'

    or

    SELECT FROM table_name
    WHERE column LIKE 'XXXX_'

    or

    SELECT FROM table_name
    WHERE column LIKE '_XXXX'

    or

    SELECT FROM table_name
    WHERE column LIKE '_XXXX_'

Samples

    WHERE SALARY::text LIKE '200%' # values that start with 200

    WHERE SALARY::text LIKE '%200%' # values that have 200 in any position

    WHERE SALARY::text LIKE '_00%' # values that have 00 in the second and third positions

    WHERE SALARY::text LIKE '2_%_%' # values that start with 2 and are at least 3 characters in length

    WHERE SALARY::text LIKE '%2' # values that end with 2

    WHERE SALARY::text LIKE '_2%3' # values that have 2 in the second position and end with a 3

    WHERE SALARY::text LIKE '2___3' # values in a five-digit number that start with 2 and end with 3

Note: For fields which are non-numeric, putting in the "::text" is optional.

## Limit Clause

The PostgreSQL LIMIT clause is used to limit the data amount returned by the SELECT statement.

SQL SYNTAX

    SELECT column1, column2, columnN
    FROM table_name
    LIMIT [no of rows]
    <OFFSET [no of rows]>

Sample

    SELECT * FROM COMPANY LIMIT 4;

    SELECT * FROM COMPANY LIMIT 3 OFFSET 2;

## Order By Clause

SQL Syntax

    SELECT column-list
    FROM table_name
    [WHERE condition]
    [ORDER BY column1, column2, .. columnN] [ASC | DESC];

Samples

    SELECT * FROM COMPANY ORDER BY AGE ASC;

    SELECT * FROM COMPANY ORDER BY NAME, SALARY ASC; # NAME first, then SALARY

## Group By Clause

The GROUP BY clause follows the WHERE clause in a SELECT statement and precedes the ORDER BY clause.

SQL Syntax

    SELECT column-list
    FROM table_name
    WHERE [ conditions ]
    GROUP BY column1, column2....columnN
    ORDER BY column1, column2....columnN

Samples

    SELECT NAME, SUM(SALARY) FROM COMPANY GROUP BY NAME ORDER BY NAME;

## With Clause

In PostgreSQL, the WITH query provides a way to write auxiliary statements for use in a larger query. It helps in breaking down complicated and large queries into simpler forms, which are easily readable. These statements often referred to as Common Table Expressions or CTEs, can be thought of as defining temporary tables that exist just for one query.

SQL Syntax

    WITH
        name_for_summary_data AS (
            SELECT Statement)
        SELECT columns
        FROM name_for_summary_data
        WHERE conditions <=> (
            SELECT column
            FROM name_for_summary_data)
        [ORDER BY columns]

Samples

    With CTE AS
    (Select
    ID
    , NAME
    , AGE
    , ADDRESS
    , SALARY
    FROM COMPANY )
    Select * From CTE;

    WITH RECURSIVE t(n) AS (
        VALUES (0)
        UNION ALL
        SELECT SALARY FROM COMPANY WHERE SALARY < 20000
        )
    SELECT sum(n) FROM t;

    # t(n) has a base value of 0 then recursively adds more rows with SALARY that passes the condition, UNION all includes duplicates
    ## the values in t(n) are added altogether

    WITH moved_rows AS (
        DELETE FROM COMPANY
        WHERE
            SALARY >= 30000
        RETURNING *
        )
    INSERT INTO COMPANY1 (SELECT * FROM moved_rows);

## Having Clause

The WHERE clause places conditions on the selected columns, whereas the HAVING clause places conditions on groups created by the GROUP BY clause

Position of HAVING clause:

    SELECT
    FROM
    WHERE
    GROUP BY
    HAVING
    ORDER BY

SQL Syntax

    SELECT column1, column2
    FROM table1, table2
    WHERE [ conditions ]
    GROUP BY column1, column2
    HAVING [ conditions ]
    ORDER BY column1, column2

Samples

    SELECT NAME FROM COMPANY GROUP BY name HAVING count(name) < 2;

    SELECT NAME FROM COMPANY GROUP BY name HAVING count(name) > 1;

## Distinct Keyword

The PostgreSQL DISTINCT keyword is used in conjunction with SELECT statement to eliminate all the duplicate records and fetching only unique records.

SQL Syntax

    SELECT DISTINCT column1, column2,.....columnN
    FROM table_name
    WHERE [condition]

Sample

    SELECT DISTINCT name FROM COMPANY;

## Advanced Commands

### Constraints

Constraints are the rules enforced on data columns on table. These are used to prevent invalid data from being entered into the database. This ensures the accuracy and reliability of the data in the database.

The following are commonly used constraints available in PostgreSQL.

- NOT NULL Constraint − Ensures that a column cannot have NULL value.

Sample

    CREATE TABLE COMPANY1(
        ID INT PRIMARY KEY     NOT NULL,
        NAME           TEXT    NOT NULL,
        AGE            INT     NOT NULL,
        ADDRESS        CHAR(50),
        SALARY         REAL
    );

- UNIQUE Constraint − Ensures that all values in a column are different.

Sample (weird but okay)

    CREATE TABLE COMPANY3(
        ID INT PRIMARY KEY     NOT NULL,
        NAME           TEXT    NOT NULL,
        AGE            INT     NOT NULL UNIQUE,
        ADDRESS        CHAR(50),
        SALARY         REAL    DEFAULT 50000.00
    );

- PRIMARY Key − Uniquely identifies each row/record in a database table.

  - A table can have only one primary key, which may consist of single or multiple fields. When multiple fields are used as a primary key, they are called a **composite key**.

- FOREIGN Key − Constrains data based on columns in other tables.

Sample

    CREATE TABLE DEPARTMENT1(
        ID INT PRIMARY KEY      NOT NULL,
        DEPT           CHAR(50) NOT NULL,
        EMP_ID         INT      references COMPANY3(ID)
    );

- CHECK Constraint − The CHECK constraint ensures that all values in a column satisfy certain conditions.

Sample

    CREATE TABLE COMPANY5(
        ID INT PRIMARY KEY     NOT NULL,
        NAME           TEXT    NOT NULL,
        AGE            INT     NOT NULL,
        ADDRESS        CHAR(50),
        SALARY         REAL    CHECK(SALARY > 0)
    );

- EXCLUSION Constraint − The EXCLUDE constraint ensures that if any two rows are compared on the specified column(s) or expression(s) using the specified operator(s), not all of these comparisons will return TRUE.

Sample

    CREATE TABLE COMPANY7(
        ID INT PRIMARY KEY     NOT NULL,
        NAME           TEXT,
        AGE            INT  ,
        ADDRESS        CHAR(50),
        SALARY         REAL,
        EXCLUDE USING gist
        (NAME WITH =,
        AGE WITH <>)
    ); # returns error if you try to insert a record with same NAME but different AGE

Note: You need to execute the command `CREATE EXTENSION btree_gist`, once per database. This will install the `btree_gist` extension, which defines the exclusion constraints on plain scalar data types.

#### Dropping a constraint

SQL Syntax

    ALTER TABLE table_name DROP CONSTRAINT some_name;

### Joins

The PostgreSQL Joins clause is used to combine records from two or more tables in a database. A JOIN is a means for combining fields from two tables by using values common to each.

Join Types in PostgreSQL are:

- The CROSS JOIN
- The INNER JOIN
- The LEFT OUTER JOIN
- The RIGHT OUTER JOIN
- The FULL OUTER JOIN

#### Cross Join

A CROSS JOIN matches every row of the first table with every row of the second table. If the input tables have `x` and `y` columns, respectively, the resulting table will have `x+y` columns. If the tables have `m` and `n` rows respectively, the joined table will have `m*n` rows.

SQL Syntax

    SELECT ... FROM table1 CROSS JOIN table2 ...

Sample

    SELECT EMP_ID, NAME, DEPT FROM COMPANY CROSS JOIN DEPARTMENT;

#### Inner Join

A INNER JOIN creates a new result table by combining column values of two tables (table1 and table2) based upon the join-predicate. The query compares each row of table1 with each row of table2 to find all pairs of rows, which satisfy the join-predicate. When the join-predicate is satisfied, column values for each matched pair of rows of table1 and table2 are combined into a result row.

SQL Syntax

    SELECT table1.column1, table2.column2...
    FROM table1
    INNER JOIN table2
    ON table1.common_field = table2.common_field;

Sample

    SELECT EMP_ID, NAME, DEPT FROM COMPANY INNER JOIN DEPARTMENT
    ON COMPANY.ID = DEPARTMENT.EMP_ID;

#### Outer Join

The OUTER JOIN is an extension of the INNER JOIN. SQL standard defines three types of OUTER JOINs: LEFT, RIGHT, and FULL and PostgreSQL supports all of these.

#### Left Outer Join

In case of LEFT OUTER JOIN, an inner join is performed first. Then, for each row in table T1 that does not satisfy the join condition with any row in table T2, a joined row is added with null values in columns of T2. Thus, the joined table always has at least one row for each row in T1.

SQL Syntax

    SELECT ... FROM table1 LEFT OUTER JOIN table2 ON conditional_expression ...

Sample

    SELECT EMP_ID, NAME, DEPT FROM COMPANY LEFT OUTER JOIN DEPARTMENT ON COMPANY.ID = DEPARTMENT.EMP_ID;

#### Right Outer Join

First, an inner join is performed. Then, for each row in table T2 that does not satisfy the join condition with any row in table T1, a joined row is added with null values in columns of T1.

SQL Syntax

    SELECT ... FROM table1 RIGHT OUTER JOIN table2 ON conditional_expression ...

Sample

    SELECT EMP_ID, NAME, DEPT FROM COMPANY RIGHT OUTER JOIN DEPARTMENT ON COMPANY.ID = DEPARTMENT.EMP_ID;

#### Full Outer Join

First, an inner join is performed. Then, for each row in table T1 that does not satisfy the join condition with any row in table T2, a joined row is added with null values in columns of T2. In addition, for each row of T2 that does not satisfy the join condition with any row in T1, a joined row with null values in the columns of T1 is added.

SQL Syntax

    SELECT ... FROM table1 FULL OUTER JOIN table2 ON conditional_expression ...

Sample

    SELECT EMP_ID, NAME, DEPT FROM COMPANY FULL OUTER JOIN DEPARTMENT ON COMPANY.ID = DEPARTMENT.EMP_ID;

### Unions Clause

The PostgreSQL UNION clause/operator is used to combine the results of two or more SELECT statements without returning any duplicate rows.

To use UNION, each SELECT must have the same number of columns selected, the same number of column expressions, the same data type, and have them in the same order but they do not have to be the same length.

#### UNION

Removes duplicates

SQL Syntax

    SELECT column1 [, column2 ]
    FROM table1 [, table2 ]
    [WHERE condition]

#### UNION ALL

Same as UNION except duplicate rows are preserved.

### Null Values

The PostgreSQL NULL is the term used to represent a missing value. A NULL value in a table is a value in a field that appears to be blank.

A field with a NULL value is a field with no value. It is very important to understand that a NULL value is different from a zero value or a field that contains spaces.

Sample

    CREATE TABLE COMPANY(
        ID INT PRIMARY KEY     NOT NULL,
        NAME           TEXT    NOT NULL,
        AGE            INT     NOT NULL,
        ADDRESS        CHAR(50),
        SALARY         REAL
    );

#### IS (NOT) NULL

Sample

    SELECT  ID, NAME, AGE, ADDRESS, SALARY
    FROM COMPANY
    WHERE SALARY IS (NOT) NULL;

### Alias

You can rename a table or a column temporarily by giving another name, which is known as ALIAS. The use of table aliases means to rename a table in a particular PostgreSQL statement. Renaming is a temporary change and the actual table name does not change in the database.

#### Table Alias

SQL Syntax

    SELECT column1, column2....
    FROM table_name AS alias_name
    WHERE [condition];

Sample

    SELECT C.ID, C.NAME, C.AGE, D.DEPT
    FROM COMPANY AS C, DEPARTMENT AS D
    WHERE C.ID = D.EMP_ID;

#### Column Alias

SQL Syntax

    SELECT column_name AS alias_name
    FROM table_name
    WHERE [condition];

Sample

    SELECT C.ID AS COMPANY_ID, C.NAME AS COMPANY_NAME, C.AGE, D.DEPT
    FROM COMPANY AS C, DEPARTMENT AS D
    WHERE  C.ID = D.EMP_ID;

### Triggers

PostgreSQL Triggers are database callback functions, which are automatically performed/invoked when a specified database event occurs.

The following are important points about PostgreSQL triggers −

- PostgreSQL trigger can be specified to fire

  - Before the operation is attempted on a row (before constraints are checked and the INSERT, UPDATE or DELETE is attempted)

  - After the operation has completed (after constraints are checked and the INSERT, UPDATE, or DELETE has completed)

  - Instead of the operation (in the case of inserts, updates or deletes on a view)

- A trigger that is marked FOR EACH ROW is called once for every row that the operation modifies. In contrast, a trigger that is marked FOR EACH STATEMENT only executes once for any given operation, regardless of how many rows it modifies.

- Both, the WHEN clause and the trigger actions, may access elements of the row being inserted, deleted or updated using references of the form NEW.column-name and OLD.column-name, where column-name is the name of a column from the table that the trigger is associated with.

- If a WHEN clause is supplied, the PostgreSQL statements specified are only executed for rows for which the WHEN clause is true. If no WHEN clause is supplied, the PostgreSQL statements are executed for all rows.

- If multiple triggers of the same kind are defined for the same event, they will be fired in alphabetical order by name.

- The BEFORE, AFTER or INSTEAD OF keyword determines when the trigger actions will be executed relative to the insertion, modification or removal of the associated row.

- Triggers are automatically dropped when the table that they are associated with is dropped.

- The table to be modified must exist in the same database as the table or view to which the trigger is attached and one must use just tablename, not database.tablename.

- A CONSTRAINT option when specified creates a constraint trigger. This is the same as a regular trigger except that the timing of the trigger firing can be adjusted using SET CONSTRAINTS. Constraint triggers are expected to raise an exception when the constraints they implement are violated.

SQL Syntax

    CREATE  TRIGGER trigger_name [BEFORE|AFTER|INSTEAD OF] event_name
    ON table_name
    [
    -- Trigger logic goes here....
    ];

Here, event_name could be INSERT, DELETE, UPDATE, and TRUNCATE database operation on the mentioned table table_name. You can optionally specify FOR EACH ROW after table name.

The following is the syntax of creating a trigger on an UPDATE operation on one or more specified columns of a table as follows −

    CREATE  TRIGGER trigger_name [BEFORE|AFTER] UPDATE OF column_name
    ON table_name
    [
    -- Trigger logic goes here....
    ];

Sample

    CREATE TRIGGER example_trigger AFTER INSERT ON COMPANY FOR EACH ROW EXECUTE PROCEDURE auditlogfunc();


    CREATE OR REPLACE FUNCTION auditlogfunc() RETURNS TRIGGER AS $example_table$
        BEGIN
            INSERT INTO AUDIT(EMP_ID, ENTRY_DATE) VALUES (new.ID, current_timestamp);
            RETURN NEW;
        END;
    $example_table$ LANGUAGE plpgsql; # procedure

#### Listing Triggers

    SELECT * FROM pg_trigger;

    SELECT tgname FROM pg_trigger, pg_class WHERE tgrelid=pg_class.oid AND relname='company';

#### Dropping triggers

SQL Syntax

    DROP TRIGGER trigger_name;

### Indexes

Indexes are special lookup tables that the database search engine can use to speed up data retrieval. Simply put, an index is a pointer to data in a table. An index in a database is very similar to an index in the back of a book.

SQL Syntax

    CREATE INDEX index_name ON table_name;

#### Index Types

PostgreSQL provides several index types: B-tree, Hash, GiST, SP-GiST and GIN. Each Index type uses a different algorithm that is best suited to different types of queries. By default, the CREATE INDEX command creates B-tree indexes, which fit the most common situations.

##### Single-Column

SQL Syntax

    CREATE INDEX index_name
    ON table_name (column_name);

##### Multi-column

SQL Syntax

    CREATE INDEX index_name
    ON table_name (column1_name, column2_name);

##### Unique

Unique indexes are used not only for performance, but also for data integrity. A unique index does not allow any duplicate values to be inserted into the table. The basic syntax is as follows −

SQL Syntax

    CREATE UNIQUE INDEX index_name
    on table_name (column_name);

##### Partial

A partial index is an index built over a subset of a table; the subset is defined by a conditional expression (called the predicate of the partial index). The index contains entries only for those table rows that satisfy the predicate.

SQL Syntax

    CREATE INDEX index_name
    on table_name (conditional_expression);

##### Implicit indexes

Implicit indexes are indexes that are automatically created by the database server when an object is created. Indexes are automatically created for primary key constraints and unique constraints.

#### Drop Index

SQL Syntax

    DROP INDEX index_name;

#### When Should Indexes be Avoided?

Although indexes are intended to enhance a database's performance, there are times when they should be avoided. The following guidelines indicate when the use of an index should be reconsidered −

- Indexes should not be used on small tables.
- Tables that have frequent, large batch update or insert operations.
- Indexes should not be used on columns that contain a high number of NULL values.
- Columns that are frequently manipulated should not be indexed.

### Alter Table Command

SQL Syntax

    ALTER TABLE table_name ADD column_name datatype;

    ALTER TABLE table_name DROP COLUMN column_name;

    ALTER TABLE table_name ALTER COLUMN column_name TYPE datatype;

    ALTER TABLE table_name MODIFY column_name datatype NOT NULL;

    ALTER TABLE table_name ADD CONSTRAINT MyUniqueConstraint UNIQUE(column1, column2...);

    ALTER TABLE table_name ADD CONSTRAINT MyUniqueConstraint CHECK (CONDITION);

    ALTER TABLE table_name ADD CONSTRAINT MyPrimaryKey PRIMARY KEY (column1, column2...);

    ALTER TABLE table_name DROP CONSTRAINT MyUniqueConstraint;

    ALTER TABLE table_name DROP INDEX MyUniqueConstraint; # MySQL

    ALTER TABLE table_name DROP CONSTRAINT MyPrimaryKey;

    ALTER TABLE table_name DROP PRIMARY KEY; # MySQL

### Truncate Table

The PostgreSQL TRUNCATE TABLE command is used to delete complete data from an existing table. You can also use DROP TABLE command to delete complete table but it would remove complete table structure from the database and you would need to re-create this table once again if you wish to store some data.

SQL Syntax

    TRUNCATE TABLE table_name;

### Views

Views are pseudo-tables. That is, they are not real tables; nevertheless appear as ordinary tables to SELECT. A view can represent a subset of a real table, selecting certain columns or certain rows from an ordinary table. A view can even represent joined tables. Because views are assigned separate permissions, you can use them to restrict table access so that the users see only specific rows or columns of a table.

Views, which are kind of virtual tables, allow users to do the following −

- Structure data in a way that users or classes of users find natural or intuitive.

- Restrict access to the data such that a user can only see limited data instead of complete table.

- Summarize data from various tables, which can be used to generate reports.

#### Creating Views

SQL Syntax

    CREATE [TEMP | TEMPORARY] VIEW view_name AS
    SELECT column1, column2.....
    FROM table_name
    WHERE [condition];

If the optional TEMP or TEMPORARY keyword is present, the view will be created in the temporary space. Temporary views are automatically dropped at the end of the current session.

#### Dropping Views

SQL Syntax

    DROP VIEW view_name;

### Transactions

A transaction is a unit of work that is performed against a database. Transactions are units or sequences of work accomplished in a logical order, whether in a manual fashion by a user or automatically by some sort of a database program.

#### Properties of Transactions

Transactions have the following four standard properties, usually referred to by the acronym ACID −

- Atomicity − Ensures that all operations within the work unit are completed successfully; otherwise, the transaction is aborted at the point of failure and previous operations are rolled back to their former state.
- Consistency − Ensures that the database properly changes states upon a successfully committed transaction.
- Isolation − Enables transactions to operate independently of and transparent to each other.
- Durability − Ensures that the result or effect of a committed transaction persists in case of a system failure.

#### Transaction Control

The following commands are used to control transactions −

- BEGIN TRANSACTION − To start a transaction.
- COMMIT − To save the changes, alternatively you can use END TRANSACTION command.
- ROLLBACK − To rollback the changes.

Transactional control commands are only used with the DML commands INSERT, UPDATE and DELETE only. They cannot be used while creating tables or dropping them because these operations are automatically committed in the database.

#### Begin Command

Such transactions usually persist until the next COMMIT or ROLLBACK command is encountered. But a transaction will also ROLLBACK if the database is closed or if an error occurs.

SQL Syntax

    BEGIN;

    or

    BEGIN TRANSACTION;

#### Commit Command

The COMMIT command saves all transactions to the database since the last COMMIT or ROLLBACK command.

SQL Syntax

    COMMIT;

    or

    END TRANSACTION;

#### Rollback Command

The ROLLBACK command can only be used to undo transactions since the last COMMIT or ROLLBACK command was issued.

SQL Syntax

    ROLLBACK;

### Locks

Locks or Exclusive Locks or Write Locks prevent users from modifying a row or an entire table. Rows modified by UPDATE and DELETE are then exclusively locked automatically for the duration of the transaction. This prevents other users from changing the row until the transaction is either committed or rolled back.

SQL syntax

    LOCK [ TABLE ]
    name
    IN
    lock_mode

- name − The name (optionally schema-qualified) of an existing table to lock. If ONLY is specified before the table name, only that table is locked. If ONLY is not specified, the table and all its descendant tables (if any) are locked.
- lock_mode − The lock mode specifies which locks this lock conflicts with. If no lock mode is specified, then ACCESS EXCLUSIVE, the most restrictive mode, is used. Possible values are: ACCESS SHARE, ROW SHARE, ROW EXCLUSIVE, SHARE UPDATE EXCLUSIVE, SHARE, SHARE ROW EXCLUSIVE, EXCLUSIVE, ACCESS EXCLUSIVE.

**Once obtained, the lock is held for the remainder of the current transaction. There is no UNLOCK TABLE command; locks are always released at the transaction end.**

#### DeadLocks

Deadlocks can occur when two transactions are waiting for each other to finish their operations. While PostgreSQL can detect them and end them with a ROLLBACK, deadlocks can still be inconvenient. To prevent your applications from running into this problem, make sure to design them in such a way that they will lock objects in the same order.

#### Advisory Locks

PostgreSQL provides means for creating locks that have application-defined meanings. These are called advisory locks.

### Sub Queries

A subquery or Inner query or Nested query is a query within another PostgreSQL query and embedded within the WHERE clause. A subquery is used to return data that will be used in the main query as a condition to further restrict the data to be retrieved.

There are a few rules that subqueries must follow −

- Subqueries must be enclosed within parentheses.
- A subquery can have only one column in the SELECT clause, unless multiple columns are in the main query for the subquery to compare its selected columns.
- An ORDER BY cannot be used in a subquery, although the main query can use an ORDER BY. The GROUP BY can be used to perform the same function as the ORDER BY in a subquery.
- Subqueries that return more than one row can only be used with multiple value operators, such as the IN, EXISTS, NOT IN, ANY/SOME, ALL operator.
- The BETWEEN operator cannot be used with a subquery; however, the BETWEEN can be used within the subquery.

SQL Syntax

    SELECT column_name [, column_name ]
    FROM   table1 [, table2 ]
    WHERE  column_name OPERATOR
        (SELECT column_name [, column_name ]
        FROM table1 [, table2 ]
        [WHERE])

#### Insert

SQL Syntax

    INSERT INTO table_name [ (column1 [, column2 ]) ]
        SELECT [ *|column1 [, column2 ] ]
        FROM table1 [, table2 ]
        [ WHERE VALUE OPERATOR ]

#### Update

SQL Syntax

    UPDATE table
    SET column_name = new_value
    [ WHERE OPERATOR [ VALUE ]
        (SELECT COLUMN_NAME
        FROM TABLE_NAME)
        [ WHERE ] ]

#### Delete

    DELETE FROM TABLE_NAME
    [ WHERE OPERATOR [ VALUE ]
        (SELECT COLUMN_NAME
        FROM TABLE_NAME)
        [ WHERE ] ]

### Auto Increment

PostgreSQL has the data types smallserial, serial and bigserial; these are not true types, but merely a notational convenience for creating unique identifier columns. These are similar to AUTO_INCREMENT property supported by some other databases.

SQL Syntax

    CREATE TABLE tablename (
        colname SERIAL
    );

Sample

    CREATE TABLE COMPANY(
        ID  SERIAL PRIMARY KEY,
        NAME           TEXT      NOT NULL,
        AGE            INT       NOT NULL,
        ADDRESS        CHAR(50),
        SALARY         REAL
    );

### Privileges

Different kinds of privileges in PostgreSQL are −

- SELECT,
- INSERT,
- UPDATE,
- DELETE,
- TRUNCATE,
- REFERENCES,
- TRIGGER,
- CREATE,
- CONNECT,
- TEMPORARY,
- EXECUTE, and
- USAGE

#### Grant

Used to assign privileges

SQL Syntax

    GRANT privilege [, ...]
    ON object [, ...]
    TO { PUBLIC | GROUP group | username }

- privilege − values could be: SELECT, INSERT, UPDATE, DELETE, RULE, ALL.
- object − The name of an object to which to grant access. The possible objects are: table, view, sequence
- PUBLIC − A short form representing all users.
- GROUP group − A group to whom to grant privileges.
- username − The name of a user to whom to grant privileges. PUBLIC is a short form representing all users.

Sample

    CREATE USER manisha WITH PASSWORD 'password'; # Create a user
    GRANT ALL ON COMPANY TO manisha;

#### Revoke

Used to remove privileges

SQL Syntax

    REVOKE privilege [, ...]
    ON object [, ...]
    FROM { PUBLIC | GROUP groupname | username }

Sample

    REVOKE ALL ON COMPANY FROM manisha;

#### Deleting a user

    DROP USER [user];

### Functions

PostgreSQL functions, also known as Stored Procedures, allow you to carry out operations that would normally take several queries and round trips in a single function within the database. Functions allow database reuse as other applications can interact directly with your stored procedures instead of a middle-tier or duplicating code.

Functions can be created in a language of your choice like SQL, PL/pgSQL, C, Python, etc.

SQL Syntax

    CREATE [OR REPLACE] FUNCTION function_name (arguments)
    RETURNS return_datatype AS $variable_name$
        DECLARE
            declaration;
            [...]
        BEGIN
            < function_body >
            [...]
            RETURN { variable_name | value }
        END; LANGUAGE plpgsql;

- function-name specifies the name of the function.
- [OR REPLACE] option allows modifying an existing function.
- The function must contain a return statement.
- RETURN clause specifies that data type you are going to return from the function. The return_datatype can be a base, composite, or domain type, or can reference the type of a table column.
- function-body contains the executable part.
- The AS keyword is used for creating a standalone function.
- plpgsql is the name of the language that the function is implemented in. Here, we use this option for PostgreSQL, it Can be SQL, C, internal, or the name of a user-defined procedural language. For backward compatibility, the name can be enclosed by single quotes.

Sample

    CREATE OR REPLACE FUNCTION totalRecords ()
    RETURNS integer AS $total$
    declare
        total integer;
    BEGIN
        SELECT count(*) into total FROM COMPANY;
        RETURN total;
    END;
    $total$ LANGUAGE plpgsql;

### Built-In Functions

PostgreSQL built-in functions, also called as Aggregate functions, are used for performing processing on string or numeric data.

The following is the list of all general-purpose PostgreSQL built-in functions −

- PostgreSQL COUNT Function − The PostgreSQL COUNT aggregate function is used to count the number of rows in a database table.
- PostgreSQL MAX Function − The PostgreSQL MAX aggregate function allows us to select the highest (maximum) value for a certain column.
- PostgreSQL MIN Function − The PostgreSQL MIN aggregate function allows us to select the lowest (minimum) value for a certain column.
- PostgreSQL AVG Function − The PostgreSQL AVG aggregate function selects the average value for certain table column.
- PostgreSQL SUM Function − The PostgreSQL SUM aggregate function allows selecting the total for a numeric column.
- PostgreSQL ARRAY Functions − The PostgreSQL ARRAY aggregate function puts input values, including nulls, concatenated into an array.
- PostgreSQL Numeric Functions − Complete list of PostgreSQL functions required to manipulate numbers in SQL.
- PostgreSQL String Functions − Complete list of PostgreSQL functions required to manipulate strings in PostgreSQL.

# Other Functions

View all tables in the current PostgreSQL database for the current user,

SELECT table_name
FROM information_schema.tables
WHERE table_schema = current_schema();

## Resetting a sequence

    ALTER SEQUENCE your_sequence_name RESTART WITH your_desired_starting_value;
