//import { makeExecutableSchema } from '@graphql-tools/schema'
import { createSchema } from "graphql-yoga";
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
            const newLink = await context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description
                }
            });
            return newLink;
        },
        async postCommentOnLink(parent, args, context) {
            const newComment = await context.prisma.comment.create({
                data: {
                    linkId: parseInt(args.linkId),
                    body: args.body
                }
            });
            return newComment;
        }
    }
};
// export const schema = makeExecutableSchema({
//     resolvers: [resolvers],
//     typeDefs: [typeDefinitions]
// })
export const schema = createSchema({ typeDefs, resolvers });
