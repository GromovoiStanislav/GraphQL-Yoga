import {createSchema, createYoga} from 'graphql-yoga'
import {createServer} from 'node:http'
import path from "node:path"
import { fileURLToPath } from 'node:url';
import fs from "node:fs"
import resolvers from "./graphql/resolvers/index.js"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const yoga = createYoga({
    schema: createSchema({
        typeDefs: fs.readFileSync(path.join(__dirname, "graphql/schema.graphql"), 'utf8'),
        resolvers
    })
});

export const server = createServer(yoga)
