import { createSchema, createYoga, createPubSub } from 'graphql-yoga';
import { createServer } from 'node:http';

const CHAT_CHANNEL = 'CHAT_CHANNEL';

type Message = {
  id: string;
  user: string;
  content: string;
};

type PubSubChannels = {
  CHAT_CHANNEL: [{ messages: Message[] }];
};

const pubSub = createPubSub<PubSubChannels>();

type GraphQLContext = {
  pubSub: typeof pubSub;
};

const messages: Message[] = [];

const typeDefs = `
  type Message {
    id: ID!
    user: String!
    content: String!
  }

  type Query {
    messages: [Message!]
  }

  type Mutation {
    postMessage(user: String!, content: String!): ID!
  }

  type Subscription {
    messages: [Message!]
  }
`;

const resolvers = {
  Query: {
    messages: () => {
      return messages;
    },
  },
  Mutation: {
    postMessage: (
      _parent: unknown,
      { user, content }: { user: string; content: string },
      context: GraphQLContext
    ) => {
      const id = String(messages.length + 1);

      const newMessage: Message = {
        id: String(messages.length + 1),
        user,
        content,
      };

      messages.push(newMessage);

      context.pubSub.publish(CHAT_CHANNEL, { messages });

      return id;
    },
  },
  Subscription: {
    messages: {
      subscribe: (_parent: unknown, _args: {}, context: GraphQLContext) => {
        return context.pubSub.subscribe(CHAT_CHANNEL);
      },
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
