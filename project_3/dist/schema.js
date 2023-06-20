//import { makeExecutableSchema } from '@graphql-tools/schema'
import { createGraphQLError, createSchema } from "graphql-yoga";
import { Prisma } from '@prisma/client';
import validator from 'validator';
import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
const typeDefs = /* GraphQL */ `
      type Query {
          hello: String!
          links: [Link!]!
          link(id: ID!): Link
          me: User!
        }
         
      type Mutation {
          postLink(url: String!, description: String!): Link!
          signup(email: String!, password: String!, name: String!): AuthPayload
          login(email: String!, password: String!): AuthPayload
      }
         
      type Link {
          id: ID!
          description: String!
          url: String!
          postedBy: User
      }
         
      type AuthPayload {
          token: String
          user: User
      }
         
      type User {
          id: ID!
          name: String!
          email: String!
          links: [Link!]!
      }
`;
const parseIntSafe = (value) => {
    // if (/^(\d+)$/.test(value)) {
    //     return parseInt(value, 10)
    // }
    if (validator.isInt(value)) {
        return validator.toInt(value);
    }
    return null;
};
const resolvers = {
    Query: {
        hello: () => 'Hello from Yoga!',
        me: (parent, args, context) => {
            if (context.currentUser === null) {
                throw createGraphQLError('Unauthenticated!');
            }
            return context.currentUser;
        },
        links: async (parent, args, context) => {
            return context.prisma.link.findMany();
        },
        link: async (parent, args, context) => {
            return context.prisma.link.findUnique({
                where: { id: parseInt(args.id) }
            });
        },
    },
    Link: {
        id: (parent) => parent.id,
        description: (parent) => parent.description,
        url: (parent) => parent.url,
        postedBy: async (parent, args, context) => {
            if (!parent.postedById) {
                return null;
            }
            // return context.prisma.user.findUnique({
            //     where: {id: parent.postedById}
            // })
            return context.prisma.link.findUnique({
                where: { id: parent.id }
            }).postedBy();
        },
    },
    User: {
        id: (parent) => parent.id,
        name: (parent) => parent.name,
        email: (parent) => parent.email,
        links: async (parent, args, context) => context.prisma.user.findUnique({
            where: { id: parent.id }
        }).links()
    },
    Mutation: {
        postLink: async (parent, args, context) => {
            if (context.currentUser === null) {
                throw createGraphQLError('Unauthenticated!');
            }
            let { url, description } = args;
            description = validator.trim(description);
            url = validator.trim(url);
            if (!validator.isURL(url)) {
                return Promise.reject(createGraphQLError(`Cannot post link on uri format '${url}'.`)
                // new GraphQLError(`Cannot post link on uri format '${url}'.`)
                );
            }
            return context.prisma.link.create({
                data: {
                    url,
                    description,
                    postedBy: { connect: { id: context.currentUser.id } }
                }
            });
        },
        signup: async (parent, args, context) => {
            const password = await bcryptjs.hash(args.password, 10);
            const user = await context.prisma.user
                .create({
                data: { ...args, password }
            })
                .catch((err) => {
                if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
                    return Promise.reject(createGraphQLError(`Cannot post user. Email '${args.email}' already exist.`)
                    // new GraphQLError(`Cannot post comment on non-existing link with id '${args.linkId}'.`)
                    );
                }
                return Promise.reject(err);
            });
            const token = jsonwebtoken.sign({ userId: user.id }, process.env.JWT_SECRET);
            return { token, user };
        },
        async login(parent, args, context) {
            const user = await context.prisma.user.findUnique({
                where: { email: args.email }
            });
            if (!user) {
                throw createGraphQLError('No such user found');
            }
            const valid = await bcryptjs.compare(args.password, user.password);
            if (!valid) {
                throw createGraphQLError('Invalid password');
            }
            const token = jsonwebtoken.sign({ userId: user.id }, process.env.JWT_SECRET);
            return { token, user };
        }
    }
};
// export const schema = makeExecutableSchema({
//     resolvers: [resolvers],
//     typeDefs: [typeDefinitions]
// })
export const schema = createSchema({ typeDefs, resolvers });
