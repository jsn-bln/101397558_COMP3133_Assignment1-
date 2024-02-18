const bcrypt = require('bcryptjs');

const resolvers = {
  Mutation: {
    register: async (_, { username, email, password }, { User }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
      return user;
    },
    addEmployee: async (_, { firstname, lastname, email, gender, salary }, {Employee}) => {
      try {
        const newEmployee = new Employee({ firstname, lastname, email, gender, salary });
        await newEmployee.save();
        return newEmployee;
      } catch (error) {
        throw new Error('Failed to add employee: ' + error.message);
      }
    }
  },
  Query: {
    login: async (_, { email, password }, { User }) => {
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
  }
};

module.exports = resolvers;
