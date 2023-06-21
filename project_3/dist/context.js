import { PrismaClient } from '@prisma/client';
import { authenticateUser } from './auth.js';
import { pubSub } from './pubsub.js';
const prisma = new PrismaClient();
export async function createContext(initialContext) {
    return {
        prisma,
        currentUser: await authenticateUser(prisma, initialContext.request),
        pubSub
    };
}
