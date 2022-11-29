module.exports = (io, client) => {
    console.log(client.id, 'client connected')
    // Write message channels from client
    client.on('join', (data) => {
        console.log(data)
        client.emit('messages', 'from Server')
    })
}