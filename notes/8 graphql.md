# GraphQL Server

In recent years, **GraphQL**, developed by Facebook, has become popular for communication between web applications and servers.

The GraphQL philosophy is very different from REST. **REST is resource-based**. Every resource, for example a user, has its own address which identifies it, for example /users/10. All operations done to the resource are done with HTTP requests to its URL. The action depends on the HTTP method used.

The main principle of GraphQL is that the code on the browser forms a query describing the data wanted, and sends it to the API with an HTTP POST request. Unlike REST, **all GraphQL queries are sent to the same address, and their type is POST**.

The data described in the above scenario could be fetched with (roughly) the following query:

    query FetchBlogsQuery {
      user(username: "mluukkai") {
        followedUsers {
          blogs {
            comments {
              user {
                blogs {
                  title
                }
              }
            }
          }
        }
      }
    }

The content of the FetchBlogsQuerycan be roughly interpreted as: find a `user` named "mluukkai"and for each of his `followedUsers`, find all their `blogs`, and for each `blog`, all its `comments`, and for each `user` who wrote each comment, find their `blogs`, and return the `title` of each of them.

## Schemas and queries

The initial schema for our phonebook is as follows:

    type Person {
      name: String!
      phone: String
      street: String!
      city: String!
      id: ID!
    }

    type Query {
      personCount: Int!
      allPersons: [Person!]!
      findPerson(name: String!): Person
    }

The schema describes two types. The first type, **Person**, determines that persons have five fields. Four of the fields are type `String`, which is one of the scalar types of GraphQL. All of the String fields, except `phone`, must be given a value. This is marked by the _exclamation mark_ on the schema. The type of the field id is ID. **ID fields are strings, but GraphQL ensures they are unique**.

The second type is a **Query**. Practically every GraphQL schema describes a Query, which tells what kind of queries can be made to the API.

The phonebook describes three different queries. `personCount` returns an integer, `allPersons` returns a list of Person objects and `findPerson` is given a string parameter and it returns a Person object.

A query can be made to return any field described in the schema. For example, the following would also be possible:

    query {
      allPersons{
        name
        city
        street
      }
    }

## Apollo Server

    npm install @apollo/server graphql

Installs a GraphQL server with today's leading library: Apollo Server.

## enum

YesNo is a GraphQL `enum`, or an enumerable, with two possible values: YES or NO. In the query allPersons, the parameter phone has the type YesNo, but is nullable

    enum YesNo {
      YES
      NO
    }

    type Query {
      personCount: Int!
      allPersons(phone: YesNo): [Person!]!
      findPerson(name: String!): Person
    }

The query is

    query {
      allPersons(phone: NO) {
        name
      }
    }

## Combined query

    query {
      havePhone: allPersons(phone: YES){
        name
      }
      phoneless: allPersons(phone: NO){
        name
      }
    }

## useQuery

`useQuery` makes the query it receives as a parameter. It returns an object with multiple fields. The `useQuery` hook is well-suited for situations where the query is done when the component is rendered.

## useLazyQuery

Query is done only as required.

## Updating the cache

New persons are added just fine, but the screen is not updated. This is because Apollo Client cannot automatically update the cache of an application, so it still contains the state from before the mutation.

### Poll Interval

One way is to make the query for all persons poll the server, or make the query repeatedly.

    const result = useQuery(ALL_PERSONS, {
        pollInterval: 2000
    })

The bad side of the solution is all the pointless web traffic.

### Refetching queries

Another easy way to keep the cache in sync is to use the useMutation hook's refetchQueries parameter to define that the query fetching all persons is done again whenever a new person is created.

    const [ createPerson ] = useMutation(CREATE_PERSON, {
      refetchQueries: [ { query: ALL_PERSONS } ]
    })

There is no extra web traffic, because queries are not done just in case. However, if one user now updates the state of the server, the changes do not show to other users immediately.

### Mutations

Surprisingly, when a person's number is changed, the new number automatically appears on the list of persons rendered by the Persons component. This happens because each person has an identifying field of type ID, so the person's details saved to the cache update automatically when they are changed with the mutation.

# Database and user admin

## Promises

The changes are pretty straightforward. However, there are a few noteworthy things. As we remember, in Mongo, the identifying field of an object is called \_id and we previously had to parse the name of the field to id ourselves. Now GraphQL can do this automatically.

Another noteworthy thing is that the resolver functions now return a promise, when they previously returned normal objects. When a resolver returns a promise, Apollo server sends back the value which the promise resolves to.

For example, if the following resolver function is executed,

    allPersons: async (root, args) => {
      return Person.find({})
    },

Apollo server waits for the promise to resolve, and returns the result. So Apollo works roughly like this:

    allPersons: async (root, args) => {
      const result = await Person.find({})
      return result
    }

## Validation

As well as in GraphQL, the input is now validated using the validations defined in the mongoose schema.

## User and log in

The object returned by context is given to all resolvers as their third parameter. Context is the right place to do things which are shared by multiple resolvers, like user identification.

    mutation {
      createUser (
        username: "mluukkai"
      ) {
        username
        id
      }
    }

    mutation {
      login (
        username: "mluukkai"
        password: "secret"
      ) {
        value
      }
    }

    query {
      me {
        username
        id
        friends {
          name
        }
      }
    }

# Login and cache in the frontend

We can reset the cache using the `resetStore` method of an Apollo `client` object. The client can be accessed with the `useApolloClient` hook

    const client = useApolloClient()

    client.resetStore()

## Updating cache

We have to update the cache of the Apollo client on creating new persons. We can update it using the mutation's refetchQueries option to define that the ALL_PERSONS query is done again.

    const PersonForm = ({ setError }) => {
      const [ createPerson ] = useMutation(CREATE_PERSON, {
        refetchQueries: [  {query: ALL_PERSONS} ],
        onError: (error) => {
          const errors = error.graphQLErrors[0].extensions.error.errors
          const messages = Object.values(errors).map(e => e.message).join('\n')
          setError(messages)
        }
    })

This approach is pretty good, the drawback being that the query is always rerun with any updates.

It is possible to optimize the solution by handling updating the cache ourselves. This is done by defining a suitable update callback for the mutation, which Apollo runs after the mutation:

    const [ createPerson ] = useMutation(CREATE_PERSON, {
      onError: (error) => {
        setError(error.graphQLErrors[0].message)
      },
      update: (cache, response) => {
        cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) => {
          return {
            allPersons: allPersons.concat(response.data.addPerson),
          }
        })
      },
    })

# Fragements and Subscriptions

## Fragments

When choosing the fields to return, both queries have to define exactly the same fields. These kinds of situations can be simplified with the use of **fragments**.

    fragment PersonDetails on Person {
      name
      phone
      address {
        street
        city
      }
    }

With the fragment, we can do the queries in a compact form:

    query {
      allPersons {
        ...PersonDetails
      }
    }

    query {
      findPerson(name: "Pekka Mikkola") {
        ...PersonDetails
      }
    }

The fragments are **not defined in the GraphQL schema**, but in the client.

## Subscriptions

With subscriptions, clients can _subscribe_ to updates about changes in the server.

### Server subscriptions

`ApolloServerPluginDrainHttpServer` has now been added to the configuration of the GraphQL server according to the recommendations of the documentation:

    We highly recommend using this plugin to ensure your server shuts down gracefully.

The schema changes like so:

    type Subscription {
      personAdded: Person!
    }

So when a new person is added, all of its details are sent to all subscribers.

First, we have to install two packages for adding subscriptions to GraphQL and a Node.js WebSocket library:

    npm install graphql-ws ws @graphql-tools/schema

When queries and mutations are used, GraphQL uses the HTTP protocol in the communication. In case of subscriptions, the communication between client and server happens with WebSockets.

The following library needs to be installed:

    npm install graphql-subscriptions

### Client subscriptions

In order to use subscriptions in our React application, we have to do some changes, especially to its configuration.

For this to work, we have to install a dependency:

    npm install graphql-ws

The subscriptions are done using the `useSubscription` hook function.
