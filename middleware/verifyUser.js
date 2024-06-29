import { io } from "../app.js";



export const verifySocketUser = async function (socket, next) {
    try {
        const usernameFrom = socket.handshake.auth.usernameFrom;
        if (!usernameFrom) {
            return next(new Error("invalid username"));
        } else {
            const sockets = await io.fetchSockets();
            if (sockets.some(item => item.usernameFrom === usernameFrom)) {
                console.log('error')
                throw new Error('Username already taken');
            }
        }
        socket.usernameFrom = usernameFrom;
        next();

    } catch (error) {
        console.log(error, '***e');
        socket.emit('error', 'An error occurred while processing your request.');
    }
}