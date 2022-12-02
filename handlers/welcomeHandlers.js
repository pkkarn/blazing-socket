const room = require('../room')

module.exports = (io, client) => {
    client.emit('load_room', Object.keys(room).map(i => ({id: i, name: room[i].name, members: []})))
    client.on('group', (data) => {
        console.log(data)

        client.emit('broad', data) // to send current client this message
        client.broadcast.emit('broad', data) // to send All other connected clients
    })

    client.on('typing', () => {
        client.broadcast.emit('typingUser');
    })
}