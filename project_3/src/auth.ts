import { PrismaClient, User } from '@prisma/client'
import jsonwebtoken from 'jsonwebtoken'


export async function authenticateUser(prisma: PrismaClient, request: Request): Promise<User | null> {
    const header = request.headers.get('authorization')
    if (header !== null) {
        const token = header.split(' ')[1]
        const tokenPayload = jsonwebtoken.verify(token, process.env.JWT_SECRET) as jsonwebtoken.JwtPayload
        const userId = tokenPayload.userId
        return prisma.user.findUnique({ where: { id: userId } })
    }
    return null
}