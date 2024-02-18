const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLEnumType, GraphQLFloat } = require('graphql');

const GenderEnumType = new GraphQLEnumType({
  name: 'Gender',
  values: {
    MALE: { value: 'Male' },
    FEMALE: { value: 'Female' },
    OTHER: { value: 'Other' }
  }
});

const EmployeeType = new GraphQLObjectType({
  name: 'Employee',
  fields: () => ({
    id: { type: GraphQLString },
    firstname: { type: GraphQLString },
    lastname: { type: GraphQLString },
    email: { type: GraphQLString },
    gender: { type: GenderEnumType },
    salary: { type: GraphQLFloat }
  }),
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addEmployee: {
      type: EmployeeType,
      args: {
        firstname: { type: GraphQLNonNull(GraphQLString) },
        lastname: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        gender: { type: GraphQLNonNull(GenderEnumType) },
        salary: { type: GraphQLNonNull(GraphQLFloat) }
      },
      resolve: async (_, { firstname, lastname, email, gender, salary }) => {
        const newEmployee = new Employee({ firstname, lastname, email, gender, salary });
        return await newEmployee.save();
      }
    }
  },
});

const schema = new GraphQLSchema({
  mutation: MutationType,
});

module.exports = schema;
