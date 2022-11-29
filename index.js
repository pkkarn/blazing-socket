const express = require('express');
const app = express();
const server = require('http').createServer(app);
const welcomHandler = require('./handlers/welcomeHandlers')
const chatHandler = require('./handlers/chatHandlers')
const blazingHandler = require('./handlers/blazingHandler')
const Blaze = require('./Blaze')
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
      }
})

const game = new Blaze.BlazingBoard([]);

function onSocketConnection(client) {
    welcomHandler(io, client);
    chatHandler(io, client);
    blazingHandler(io, client, game)
}

io.on('connection', onSocketConnection)

app.get('/', (req, res) => {res.send({
    msg: 'hello world'
})})

server.listen(4200, () => {
    console.log('listening on port')
})