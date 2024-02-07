const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
let { graphqlHTTP } = require("express-graphql");
const user = require('./graphql/schema/user');
const resolver = require('./graphql/resolver/resolver');
const User = require('./models/UserSchema');
const Employee = require('./models/EmployeeSchema');

const app = express();

app.use(express.json());



const PORT = process.env.PORT || 3000;
const URI = process.env.URI

mongoose.connect(URI);
const db = mongoose.connection;
db.once('open', () => {console.log('connected to database!')});



app.use(
  "/graphql",
  graphqlHTTP({
    schema: user,
    rootValue: resolver,
    graphiql: true,
    context: {User, Employee}
  })
)
app.listen(PORT, () => {
    console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`)
})

