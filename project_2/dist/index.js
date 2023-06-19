import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import { schema } from './schema.js';
import { createContext } from './context.js';
function main() {
    const yoga = createYoga({ schema, context: createContext });
    const server = createServer(yoga);
    server.listen(3000, () => {
        console.info('Server is running on http://localhost:3000/graphql');
    });
}
main();
