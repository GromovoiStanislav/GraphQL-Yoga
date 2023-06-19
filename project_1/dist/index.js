import { createSchema, createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
const links = [
    {
        id: 'link-0',
        url: 'https://graphql-yoga.com',
        description: 'The easiest way of setting up a GraphQL server'
    }
];
const yoga = createYoga({
    schema: createSchema({
        typeDefs: `
      type Link {
        id: ID!
        description: String!
        url: String!
      }
      
      type Query {
        hello: String
        feed: [Link!]!
      }
      
      type Mutation {
        postLink(url: String!, description: String!): Link
      }
      
      type Subscription {
        countdown(from: Int!): Int!
      }
    `,
        resolvers: {
            Query: {
                hello: () => 'Hello from Yoga!',
                feed: () => links
            },
            Link: {
                id: (parent) => parent.id,
                description: (parent) => parent.description,
                url: (parent) => parent.url
            },
            Mutation: {
                postLink: (parent, args) => {
                    const link = {
                        id: `link-${links.length}`,
                        description: args.description,
                        url: args.url
                    };
                    links.push(link);
                    return link;
                }
            },
            Subscription: {
                countdown: {
                    // This will return the value on every 1 sec until it reaches 0
                    subscribe: async function* (_, { from }) {
                        for (let i = from; i >= 0; i--) {
                            await new Promise((resolve) => setTimeout(resolve, 1000));
                            yield { countdown: i };
                        }
                    }
                }
            }
        },
    })
});
const server = createServer(yoga);
server.listen(3000, () => {
    console.info('Server is running on http://localhost:3000/graphql');
});
