import { createSchema, createYoga, createPubSub } from 'graphql-yoga';
import { createServer } from 'node:http';
const TODOS_CHANNEL = 'TODOS_CHANNEL';
const pubSub = createPubSub();
let todos = [
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
        addTodo: (_, { text }, context) => {
            const newTodo = {
                id: String(todos.length + 1),
                text,
                done: false,
            };
            todos.push(newTodo);
            context.pubSub.publish(TODOS_CHANNEL, { todos });
            return newTodo;
        },
        setDone: (_, { id, done }, context) => {
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
            subscribe: (_parent, _args, context) => context.pubSub.subscribe(TODOS_CHANNEL),
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
