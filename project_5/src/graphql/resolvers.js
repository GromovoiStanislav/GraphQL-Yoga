import User from "./models/User.js";

export const resolvers = {
    Query: {
        getUsers: () => User.find(),
        getUser: async (_, {id}) => {
            return User.findById(id)
        }
    },
    Mutation: {
        createUser: async (_, {nickname, fullname, phone, city}) => {
            const user = new User({nickname, fullname, phone, city});
            return user.save();
        },
        deleteUser: async (_, {id}) => {
            return User.findByIdAndDelete(id);
        }
    }
}