import {createSchema, createYoga} from 'graphql-yoga'
import {createServer} from 'node:http'
import "./database.js";

import {typeDefs} from "./typeDefs.js";
import {resolvers} from "./resolvers.js";

const yoga = createYoga({
    schema: createSchema({
        typeDefs,
        resolvers
    })
});


const server = createServer(yoga)
server.listen(3000, () => {
    console.info('Server is running on http://localhost:3000/graphql')
})