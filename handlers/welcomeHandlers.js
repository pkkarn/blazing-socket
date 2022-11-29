module.exports = (io, client) => {
    client.on('group', (data) => {
        console.log(data)

        client.emit('broad', data) // to send current client this message
        client.broadcast.emit('broad', data) // to send All other connected clients
    })

    client.on('typing', () => {
        client.broadcast.emit('typingUser');
    })
}