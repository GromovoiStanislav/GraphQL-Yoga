import { createSchema, createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import axios from 'axios';
const typeDefs = `
  type Geo {
    lat: String
    lng: String
  }
  
  type Address {
    street: String
    suite: String
    city: String
    zipcode: String
    geo: Geo
  }
  
  type User {
    id: ID
    name: String
    username: String
    email: String
    address: Address
    posts: [Post]
    todos: [Todo]
  }
  
  type Todo {
    id: ID!
    userId: Int
    title: String
    completed: Boolean
    user: User
  }

  type Post {
    id: ID!
    userId: Int!
    title: String!
    body: String!
    comments: [Comment]
    user: User
  }

  type Comment {
    id: ID!
    postId: Int!
    name: String!
    email: String!
    body: String!
  }

  type Query {
    posts: [Post]
    post(id:ID!): Post
    users: [User]
    user(id: ID!): User
    todos: [Todo]
    todo(id: ID!): Todo
  }
`;
const API_URL_Users = 'https://jsonplaceholder.typicode.com/users';
const API_URL_Posts = 'https://jsonplaceholder.typicode.com/posts';
const API_URL_Comments = 'https://jsonplaceholder.typicode.com/comments';
const API_URL_Todos = 'https://jsonplaceholder.typicode.com/todos';
const resolvers = {
    Query: {
        users: async () => {
            const response = await axios.get(API_URL_Users);
            return response.data;
        },
        user: async (_, { id }) => {
            const response = await axios.get(`${API_URL_Users}/${id}`);
            return response.data;
        },
        posts: async () => {
            const response = await axios.get(API_URL_Posts);
            return response.data;
        },
        post: async (_, { id }) => {
            const response = await axios.get(`${API_URL_Posts}/${id}`);
            return response.data;
        },
        todos: async () => {
            const response = await axios.get(API_URL_Todos);
            return response.data;
        },
        todo: async (_parent, { id }) => {
            const response = await axios.get(`${API_URL_Todos}/${id}`);
            return response.data;
        },
    },
    Post: {
        comments: async (parent) => {
            const response = await axios.get(
            //`${API_URL_Comments}?postId=${parent.id}`
            `${API_URL_Posts}/${parent.id}/comments`);
            return response.data;
        },
        user: async (parent) => {
            const response = await axios.get(`${API_URL_Users}/${parent.userId}`);
            return response.data;
        },
    },
    User: {
        posts: async (parent) => {
            const response = await axios.get(`${API_URL_Users}/${parent.id}/posts`);
            return response.data;
        },
        todos: async (parent) => {
            const response = await axios.get(`${API_URL_Users}/${parent.id}/todos`);
            return response.data;
        },
    },
    Todo: {
        user: async (parent) => {
            const response = await axios.get(`${API_URL_Users}/${parent.userId}`);
            return response.data;
        },
    },
};
const yoga = createYoga({
    schema: createSchema({
        typeDefs,
        resolvers,
    }),
});
const server = createServer(yoga);
server.listen(3000, () => {
    console.info('Server is running on http://localhost:3000/graphql');
});
