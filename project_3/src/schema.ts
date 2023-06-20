//import { makeExecutableSchema } from '@graphql-tools/schema'
import {createGraphQLError, createSchema} from "graphql-yoga";
//import {GraphQLError} from 'graphql'
import {GraphQLContext} from './context.js'
import {Prisma, User, Link} from '@prisma/client'
import validator from 'validator';
import bcryptjs from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'


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

        me: (parent: unknown, args: {}, context: GraphQLContext) => {
            if (context.currentUser === null) {
                throw createGraphQLError('Unauthenticated!')
            }
            return context.currentUser
        },


        links: async (parent: unknown, args: {}, context: GraphQLContext) => {
            return context.prisma.link.findMany();
        },

        link: async (parent: unknown, args: { id: string }, context: GraphQLContext) => {
            return context.prisma.link.findUnique({
                where: {id: parseInt(args.id)}
            })
        },
    },

    Link: {
        id: (parent: Link) => parent.id,
        description: (parent: Link) => parent.description,
        url: (parent: Link) => parent.url,
        postedBy: async (parent: Link, args: {}, context: GraphQLContext) => {
            if (!parent.postedById) {
                return null
            }
            // return context.prisma.user.findUnique({
            //     where: {id: parent.postedById}
            // })
            return context.prisma.link.findUnique({
                where: {id: parent.id}
            }).postedBy()
        },
    },
    User: {
        id: (parent: User) => parent.id,
        name: (parent: User) => parent.name,
        email: (parent: User) => parent.email,
        links: async (parent: User, args: {}, context: GraphQLContext) =>
            context.prisma.user.findUnique({
                where: {id: parent.id}
            }).links()
    },


    Mutation: {
        postLink: async (
            parent: unknown,
            args: { description: string, url: string },
            context: GraphQLContext
        ) => {

            if (context.currentUser === null) {
                throw createGraphQLError('Unauthenticated!')
            }

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
                    description,
                    postedBy: {connect: {id: context.currentUser.id}}
                }
            })
        },

        signup: async (
            parent: unknown,
            args: { email: string; password: string; name: string },
            context: GraphQLContext
        ) => {
            const password = await bcryptjs.hash(args.password, 10)

            const user = await context.prisma.user
                .create({
                    data: {...args, password}
                })
                .catch((err: unknown) => {
                    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
                        return Promise.reject(
                            createGraphQLError(`Cannot post user. Email '${args.email}' already exist.`)
                            // new GraphQLError(`Cannot post comment on non-existing link with id '${args.linkId}'.`)
                        )
                    }
                    return Promise.reject(err)
                })

            const token = jsonwebtoken.sign({userId: user.id}, process.env.JWT_SECRET)
            return {token, user}
        },

        async login(
            parent: unknown,
            args: { email: string; password: string },
            context: GraphQLContext
        ) {
            const user = await context.prisma.user.findUnique({
                where: {email: args.email}
            })
            if (!user) {
                throw createGraphQLError('No such user found')
            }

            const valid = await bcryptjs.compare(args.password, user.password)
            if (!valid) {
                throw createGraphQLError('Invalid password')
            }

            const token = jsonwebtoken.sign({userId: user.id}, process.env.JWT_SECRET)
            return {token, user}
        }


    }
}

// export const schema = makeExecutableSchema({
//     resolvers: [resolvers],
//     typeDefs: [typeDefinitions]
// })

export const schema = createSchema({typeDefs, resolvers})