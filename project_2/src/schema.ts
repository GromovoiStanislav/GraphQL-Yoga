//import { makeExecutableSchema } from '@graphql-tools/schema'
import {createSchema} from "graphql-yoga";
import {GraphQLError} from 'graphql'
import type {GraphQLContext} from './context.js'
import type {Comment, Link} from '@prisma/client'
import {Prisma} from "@prisma/client";
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
      
    `


const parseIntSafe = (value: string): number | null => {
    // if (/^(\d+)$/.test(value)) {
    //     return parseInt(value, 10)
    // }

    if (validator.isInt(value)) {
        return validator.toInt(value)
    }

    return null
}


const resolvers = {
    Query: {
        hello: () => 'Hello from Yoga!',

        async links(parent: unknown, args: {}, context: GraphQLContext) {
            return context.prisma.link.findMany();
        },

        async link(parent: unknown, args: { id: string }, context: GraphQLContext) {
            return context.prisma.link.findUnique({
                where: {id: parseInt(args.id)}
            })
        },

        async comments(parent: unknown, args: {}, context: GraphQLContext) {
            return context.prisma.comment.findMany();
        },

        async comment(parent: unknown, args: { id: string }, context: GraphQLContext) {
            return context.prisma.comment.findUnique({
                where: {id: parseInt(args.id)}
            })
        }
    },

    Link: {
        id: (parent: Link) => parent.id,
        description: (parent: Link) => parent.description,
        url: (parent: Link) => parent.url,
        comments: async (parent: Link, args: {}, context: GraphQLContext) => {
            return context.prisma.comment.findMany({
                where: {
                    linkId: parent.id
                }
            })
        },
    },
    Comment: {
        id: (parent: Comment) => parent.id,
        body: (parent: Comment) => parent.body,
        link: async (parent: Comment, args: {}, context: GraphQLContext) => {
            return context.prisma.link.findUnique({
                where: {
                    id: parent.linkId
                }
            })
        },
    },


    Mutation: {
        async postLink(
            parent: unknown,
            args: { description: string; url: string },
            context: GraphQLContext
        ) {
            let {url, description} = args

            description = validator.trim(description)
            url = validator.trim(url)

            if (!validator.isURL(url)) {
                return Promise.reject(
                    new GraphQLError(`Cannot post link on uri format '${url}'.`)
                )
            }

            return context.prisma.link.create({
                data: {
                    url,
                    description
                }
            })
        },


        async postCommentOnLink(
            parent: unknown,
            args: { linkId: string; body: string },
            context: GraphQLContext
        ) {
            let {body} = args

            const linkId = parseIntSafe(args.linkId)
            if (linkId === null) {
                return Promise.reject(
                    new GraphQLError(`Cannot post comment on non-existing link with id '${args.linkId}'.`)
                )
            }

            body = validator.trim(body)
            if (validator.isEmpty(body)){
                return Promise.reject(
                    new GraphQLError(`Cannot post empty comment.`)
                )
            }



            return context.prisma.comment
                .create({
                    data: {
                        linkId,
                        body: args.body
                    }
                })
                .catch((err: unknown) => {
                    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
                        return Promise.reject(
                            new GraphQLError(`Cannot post comment on non-existing link with id '${args.linkId}'.`)
                        )
                    }
                    return Promise.reject(err)
                })
        }
    }
}

// export const schema = makeExecutableSchema({
//     resolvers: [resolvers],
//     typeDefs: [typeDefinitions]
// })

export const schema = createSchema({typeDefs, resolvers})