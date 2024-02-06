const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
var { graphqlHTTP } = require("express-graphql")
var { buildSchema } = require("graphql")

const app = express();

app.use(express.json());



const PORT = process.env.PORT || 3000;
const URI = process.env.URI

mongoose.connect(URI);
const db = mongoose.connection;
db.once('open', () => {console.log('connected to database!')});



var schema = buildSchema(`
  type Query {
    hello: String
    signup: String
  }

  type Mutation {
    signup: String
  }
`)




var root = {
  hello: () => {
    return "Hello world"
  },
  signup: () => {
    return "signup endpoint"
  }
}

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
)
app.listen(PORT, () => {
    console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`)
})

