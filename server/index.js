const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");

var pg = require("pg");
const creds = require("./creds");

var client = new pg.Client(creds);

client.connect(function(err) {
  if (err) {
    return console.error("could not connect to postgres", err);
  }
  client.query('SELECT NOW() AS "theTime"', function(err, result) {
    if (err) {
      return console.error("error running query", err);
    }
    console.log(result.rows[0].theTime);
  });
});

// The GraphQL schema in string form
const typeDefs = `
  type Query { todos: [Todo], todo(id: Int!): Todo }
  type Todo { id: Int!, todo: String!, done: Boolean! }
  type Mutation {  
      addTodo(todo: String!): [Todo], 
      removeTodo(id: Int!): [Todo], 
      editTodo(id: Int!, todo: String, done: Boolean): [Todo] 
    }
`;

// The resolvers
const resolvers = {
  Query: {
    todos: async () => {
      const res = await client.query("SELECT * FROM todos");
      return res.rows;
    },
    todo: async (_, { id }) => {
      const res = await client.query(`SELECT * FROM todos WHERE id = ${id}`);
      return res.rows[0];
    }
  },
  Mutation: {
    addTodo: async (_, { todo }) => {
      const max = await client.query(`SELECT MAX(id) FROM todos`);
      await client.query(
        `INSERT INTO todos(id, todo, done) VALUES (${max.rows[0].max +
          1}, '${todo}', false) `
      );
      const final = await client.query(`SELECT * FROM todos`);
      return final.rows;
    },
    removeTodo: async (_, { id }) => {
      await client.query(`DELETE FROM todos WHERE id=${id}`);
      const final = await client.query(`SELECT * FROM todos`);
      return final.rows;
    },
    editTodo: async (_, { id, todo, done }) => {
      let queryString;
      if (todo && done !== undefined) {
        queryString = `UPDATE todos SET todo='${todo}', done=${
          done ? "true" : "false"
        } WHERE id=${id}`;
      }

      if (queryString) {
        await client.query(queryString);
      }
      const final = await client.query(`SELECT * FROM todos`);
      return final.rows;
    }
  }
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// Initialize the app
const app = express();
app.use(cors());

// The GraphQL endpoint
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress({
    schema
  })
);

// GraphiQL, a visual editor for queries
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

// Start the server
app.listen(3000, () => {
  console.log("Go to http://localhost:3000/graphiql to run queries!");
});
