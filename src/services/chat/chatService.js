import { io } from "../../app.js";
import { verifySocketUser } from "../../middleware/verifyUser.js";

export function setupChat() {
    io.use(verifySocketUser);

    io.on('connection', socket => {
        console.log('User connected');
        console.log('Id', socket.id);


        socket.on('getUserId', async userName => {
            try {
                const sockets = await io.fetchSockets();
                if (sockets.length > 0) {
                    const toData = sockets.filter(item => {
                        return item.usernameFrom === userName
                    })
                    if (!toData[0]?.id) {
                        throw new Error("User not found")
                    } else {
                        if (toData[0]?.id !== socket.id) {
                            socket.emit('receiveUserId', toData[0]?.id || null)
                        } else {
                            throw new Error("invalid receiver")
                        }

                        console.log(toData[0]?.id, socket.id, '***r,s');
                    }
                }
            } catch (error) {
                console.log(error, '***e');
                socket.emit('error', 'An error occurred while processing your request.');
            }
        })


        socket.on('c2s-message', async ({ content, to, from }) => {
            console.log(content, to);
            if (to) {
                socket.to(to).emit('s2c-message', { message: content, from: from });
            }

        });

    });
}

