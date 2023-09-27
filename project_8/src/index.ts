import { createSchema, createYoga, createPubSub } from 'graphql-yoga';
import { createServer } from 'node:http';

const TODOS_CHANNEL = 'TODOS_CHANNEL';

type Todo = {
  id: string;
  done: boolean;
  text: string;
};

type PubSubChannels = {
  TODOS_CHANNEL: [{ todos: Todo[] }];
};

const pubSub = createPubSub<PubSubChannels>();

type GraphQLContext = {
  pubSub: typeof pubSub;
};

const todos: Todo[] = [
  {
    id: '1',
    text: 'Learn GraphQL + Soild',
    done: false,
  },
];

const typeDefs = `
  type Todo {
    id: ID!
    done: Boolean!
    text: String!
  }
  type Query {
    getTodos: [Todo]!
  }
  type Mutation {
    addTodo(text: String!): Todo
    setDone(id: ID!, done: Boolean!): Todo
  }
  type Subscription {
    todos: [Todo]!
  }
`;

const resolvers = {
  Query: {
    getTodos: () => {
      return todos;
    },
  },
  Mutation: {
    addTodo: (
      _: unknown,
      { text }: { text: string },
      context: GraphQLContext
    ) => {
      const newTodo = {
        id: String(todos.length + 1),
        text,
        done: false,
      };
      todos.push(newTodo);
      context.pubSub.publish(TODOS_CHANNEL, { todos });
      return newTodo;
    },
    setDone: (
      _: unknown,
      { id, done }: { id: string; done: boolean },
      context: GraphQLContext
    ) => {
      const todo = todos.find((todo) => todo.id === id);
      if (!todo) {
        throw new Error('Todo not found');
      }
      todo.done = done;
      context.pubSub.publish(TODOS_CHANNEL, { todos });
      return todo;
    },
  },
  Subscription: {
    todos: {
      subscribe: (_parent: unknown, _args: {}, context: GraphQLContext) =>
        context.pubSub.subscribe(TODOS_CHANNEL),
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
