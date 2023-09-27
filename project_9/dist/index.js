import { createSchema, createYoga, createPubSub } from 'graphql-yoga';
import { createServer } from 'node:http';
const CHAT_CHANNEL = 'CHAT_CHANNEL';
const pubSub = createPubSub();
const messages = [];
const typeDefs = `
  type Message {
    id: ID!
    from: String!
    text: String!
  }
  type Query {
    messages: [Message]!
  }
  type Mutation {
    add(text: String!, from: String!): Message
  }
  type Subscription {
    messages: [Message]!
  }
`;
const resolvers = {
    Query: {
        messages: () => {
            return messages;
        },
    },
    Mutation: {
        add: (_parent, { text, from }, context) => {
            const newMessage = {
                id: String(messages.length + 1),
                text,
                from,
            };
            messages.push(newMessage);
            context.pubSub.publish(CHAT_CHANNEL, { messages });
            return newMessage;
        },
    },
    Subscription: {
        messages: {
            subscribe: (_parent, _args, context) => context.pubSub.subscribe(CHAT_CHANNEL),
        },
    },
};
const yoga = createYoga({
    context: async () => ({ pubSub }),
    schema: createSchema({
        typeDefs,
        resolvers,
    }),
});
const server = createServer(yoga);
server.listen(3000, () => {
    console.info('Server is running on http://localhost:3000/graphql');
});
