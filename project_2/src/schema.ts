//import { makeExecutableSchema } from '@graphql-tools/schema'
import {createGraphQLError, createSchema} from "graphql-yoga";
//import {GraphQLError} from 'graphql'
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
        links(filterNeedle: String, skip: Int, take: Int): [Link!]!
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


const applyTakeConstraints = (params: { min: number, max: number, value: number }) => {
    if (params.value < params.min || params.value > params.max) {
        throw createGraphQLError(
            `'take' argument value '${params.value}' is outside the valid range of '${params.min}' to '${params.max}'.`,
        )
    }
    return params.value
}

const applySkipConstraints = (value: number ) => {
    if (value < 0) {
        throw createGraphQLError(
            `'skip' argument value '${value}' is less of 0.`,
        )
    }
    return value
}


const resolvers = {
    Query: {
        hello: () => 'Hello from Yoga!',

        links: async (parent: unknown, args: { filterNeedle?: string, skip?: number, take?: number }, context: GraphQLContext) => {
            const where = args.filterNeedle
                ? {
                    OR: [
                        {description: {contains: args.filterNeedle}},
                        {url: {contains: args.filterNeedle}}
                    ]
                }
                : {}

            const take = applyTakeConstraints({
                min: 1,
                max: 50,
                value: args.take ?? 30
            })
            const skip = applySkipConstraints(args.skip ?? 0)


            return context.prisma.link.findMany({
                where,
                skip: args.skip,
                take
            });
        },

        link: async (parent: unknown, args: { id: string }, context: GraphQLContext) => {
            return context.prisma.link.findUnique({
                where: {id: parseInt(args.id)}
            })
        },

        comments: async (parent: unknown, args: {}, context: GraphQLContext) => {
            return context.prisma.comment.findMany();
        },

        comment: async (parent: unknown, args: { id: string }, context: GraphQLContext) => {
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
        postLink: async (
            parent: unknown,
            args: { description: string, url: string },
            context: GraphQLContext
        ) => {
            let {url, description} = args

            description = validator.trim(description)
            url = validator.trim(url)

            if (!validator.isURL(url)) {
                return Promise.reject(
                    createGraphQLError(`Cannot post link on uri format '${url}'.`)
                    // new GraphQLError(`Cannot post link on uri format '${url}'.`)
                )
            }

            return context.prisma.link.create({
                data: {
                    url,
                    description
                }
            })
        },


        postCommentOnLink: async (
            parent: unknown,
            args: { linkId: string, body: string },
            context: GraphQLContext
        ) => {
            let {body} = args

            const linkId = parseIntSafe(args.linkId)
            if (linkId === null) {
                return Promise.reject(
                    createGraphQLError(`Cannot post comment on non-existing link with id '${args.linkId}'.`)
                    // new GraphQLError(`Cannot post comment on non-existing link with id '${args.linkId}'.`)
                )
            }

            body = validator.trim(body)
            if (validator.isEmpty(body)) {
                return Promise.reject(
                    createGraphQLError(`Cannot post empty comment.`)
                    // new GraphQLError(`Cannot post empty comment.`)
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
                            createGraphQLError(`Cannot post comment on non-existing link with id '${args.linkId}'.`)
                            // new GraphQLError(`Cannot post comment on non-existing link with id '${args.linkId}'.`)
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