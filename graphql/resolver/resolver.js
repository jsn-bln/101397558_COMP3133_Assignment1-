const bcrypt = require('bcryptjs');

const resolvers = {
  Mutation: {
    register: async (_, { username, email, password }, { User }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
      return user;
    },
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
