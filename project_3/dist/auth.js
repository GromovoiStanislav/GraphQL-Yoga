import jsonwebtoken from 'jsonwebtoken';
export async function authenticateUser(prisma, request) {
    const header = request.headers.get('authorization');
    if (header !== null) {
        const token = header.split(' ')[1];
        const tokenPayload = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        const userId = tokenPayload.userId;
        return await prisma.user.findUnique({ where: { id: userId } });
    }
    return null;
}
