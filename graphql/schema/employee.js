const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLEnumType, GraphQLFloat } = require('graphql');
const bcrypt = require('bcryptjs')


const GenderEnumType = new GraphQLEnumType({
    name: 'Gender',
    values: {
      MALE: { value: 'Male' },
      FEMALE: { value: 'Female' },
      OTHER: { value: 'Other' }
    }
  });

const EmployeeType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstname: { type: GraphQLString },
    lastname: { type: GraphQLString },
    email: { type: GraphQLString },
    gender: {type: GenderEnumType},
    salary: {type: GraphQLFloat}
  }),
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'Hello World!',
    },
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { email, password }, { User }) => {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('Invalid login');
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          throw new Error('Invalid login');
        }
        return user;
      },
    },
  },
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    register: {
      type: UserType,
      args: {
        username: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { username, email, password }, { User }) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        return user;
      },
    },
    
  },
});

const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

module.exports = schema;
