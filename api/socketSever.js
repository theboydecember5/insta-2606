

let users = []

const SocketSever = (socket) => {

    socket.on('joinUser', id => {
        users.push({ id, socketId: socket.id })
        console.log(users)
    })


    //Likes 
    socket.on('likePost', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id]


        const clients = users.filter(user => ids.includes(user.id))
        console.log(clients)

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('likeToClient', newPost)
            })
        }
    })


    //Unlikes
    socket.on('unLikePost', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('unLikeToClient', newPost)
            })
        }
    })


    //Comment
    socket.on('createComment', newPost => {

        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))
        console.log(clients)

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('createCommentToClient', newPost)
            })
        }
    })

    // Delete Comment
    socket.on('deleteComment', newPost => {

        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))
        console.log(clients)

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('deleteCommentToClient', newPost)
            })
        }
    })

    // Follow
    socket.on('follow', newUser => {
        const user = users.find(user => user.id === newUser._id)
        user && socket.to(`${user.socketId}`).emit('followToClient', newUser)
    })

    //UnFollow
    socket.on('unFollow', newUser => {
        const user = users.find(user => user.id === newUser._id)
        user && socket.to(`${user.socketId}`).emit('unFollowToClient', newUser)
    })

    //Notification
    socket.on('createNotify', msg => {
        const clients = users.filter(user => msg.recipients.includes(user.id))
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('createNotifyToClient', msg)
            })
        }
    })

    socket.on('removeNotify', msg => {
        const clients = users.filter(user => msg.recipients.includes(user.id))

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('removeNotifyToClient', msg)
            })
        }
    })

    socket.on('addMessage', msg => {
        const user = users.find(user => user.id === msg.recipients)
        console.log(user)
        user && socket.to(`${user.socketId}`).emit('addMessageToClient', msg)
    })



    socket.on('disconnect', () => {
        users.filter(user => user.socketId !== socket.id)
    })
}

module.exports = SocketSever