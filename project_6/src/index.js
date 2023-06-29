import { server } from "./server.js";
import "./database.js";

server.listen(3000, () => {
    console.info('Server is running on http://localhost:3000/graphql')
})