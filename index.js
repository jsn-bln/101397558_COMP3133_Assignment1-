const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { graphqlHTTP } = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { mergeSchemas } = require('graphql-tools');

const userSchema = require('./graphql/schema/user');
const employeeSchema = require('./graphql/schema/employee');
const resolver = require('./graphql/resolver/resolver');
const User = require('./models/UserSchema');
const Employee = require('./models/EmployeeSchema');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
const URI = process.env.URI;

mongoose.connect(URI);
const db = mongoose.connection;
db.once('open', () => {
  console.log('connected to database!');
});


const executableUserSchema = makeExecutableSchema({
  typeDefs: userSchema,
  resolvers: resolver
});

const executableEmployeeSchema = makeExecutableSchema({
  typeDefs: employeeSchema,
  resolvers: resolver
});


const mergedSchema = mergeSchemas({
  schemas: [executableUserSchema, executableEmployeeSchema]
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: mergedSchema,
    rootValue: resolver,
    graphiql: true,
    context: { User, Employee }
  })
);

app.listen(PORT, () => {
  console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`);
});
