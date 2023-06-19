//import { makeExecutableSchema } from '@graphql-tools/schema'
import { createSchema } from "graphql-yoga";
import { GraphQLError } from 'graphql';
import { Prisma } from "@prisma/client";
import validator from 'validator';
const typeDefs = `
      type Link {
        id: ID!
        description: String!
        url: String!
        comments: [Comment!]!
      }
      
      type Comment {
          id: ID!
          body: String!
          link: Link
      }
      
      type Query {
        hello: String!
        links: [Link!]!
        link(id: ID): Link
        comments: [Comment!]!
        comment(id: ID!): Comment
      }
      
      type Mutation {
        postLink(url: String!, description: String!): Link
        postCommentOnLink(linkId: ID!, body: String!): Comment!
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
        async links(parent, args, context) {
            return context.prisma.link.findMany();
        },
        async link(parent, args, context) {
            return context.prisma.link.findUnique({
                where: { id: parseInt(args.id) }
            });
        },
        async comments(parent, args, context) {
            return context.prisma.comment.findMany();
        },
        async comment(parent, args, context) {
            return context.prisma.comment.findUnique({
                where: { id: parseInt(args.id) }
            });
        }
    },
    Link: {
        id: (parent) => parent.id,
        description: (parent) => parent.description,
        url: (parent) => parent.url,
        comments: async (parent, args, context) => {
            return context.prisma.comment.findMany({
                where: {
                    linkId: parent.id
                }
            });
        },
    },
    Comment: {
        id: (parent) => parent.id,
        body: (parent) => parent.body,
        link: async (parent, args, context) => {
            return context.prisma.link.findUnique({
                where: {
                    id: parent.linkId
                }
            });
        },
    },
    Mutation: {
        async postLink(parent, args, context) {
            let { url, description } = args;
            description = validator.trim(description);
            url = validator.trim(url);
            if (!validator.isURL(url)) {
                return Promise.reject(new GraphQLError(`Cannot post link on uri format '${url}'.`));
            }
            return context.prisma.link.create({
                data: {
                    url,
                    description
                }
            });
        },
        async postCommentOnLink(parent, args, context) {
            let { body } = args;
            const linkId = parseIntSafe(args.linkId);
            if (linkId === null) {
                return Promise.reject(new GraphQLError(`Cannot post comment on non-existing link with id '${args.linkId}'.`));
            }
            body = validator.trim(body);
            if (validator.isEmpty(body)) {
                return Promise.reject(new GraphQLError(`Cannot post empty comment.`));
            }
            return context.prisma.comment
                .create({
                data: {
                    linkId,
                    body: args.body
                }
            })
                .catch((err) => {
                if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
                    return Promise.reject(new GraphQLError(`Cannot post comment on non-existing link with id '${args.linkId}'.`));
                }
                return Promise.reject(err);
            });
        }
    }
};
// export const schema = makeExecutableSchema({
//     resolvers: [resolvers],
//     typeDefs: [typeDefinitions]
// })
export const schema = createSchema({ typeDefs, resolvers });
