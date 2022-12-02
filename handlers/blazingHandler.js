const Blaze = require('../Blaze')
const rooms = require('../room')

function responseBoard (game) {
    let boardCopy = {}
    let curr = game.firstPlayer;
      while (curr) {
        // console.log(curr);
        let temp = {};
        temp.username = curr.username;
        temp.cards = curr.cards;
        temp.status = curr.status;

        boardCopy[temp.username] = temp;
        curr = curr.next;
    }
    return { 
        board: boardCopy, 
        detail: {
            activeCard: game.activeCard,
            activePlayer: {
                username: game.activePlayer?.username
            }
        }
    };
}

function resolveGame(room) {
    if(games[room]) {
        return games[room]
    }
    games[room] = new Blaze.BlazingBoard([])
    return games[room];
}

// players_detail
let players = {};
let games = {};

module.exports = (io, client) => {
    // whent client starts_game
    client.on('start_game', ({username, room}) => {
        console.log(username, room)
        client.join(room)
        // Resolve Game if already available
        let game = resolveGame(room);

        console.log(game)

        game.addPlayer(username)
        players[client.id] = {username, room}
        io.to(room).emit('add_player', {
            game: responseBoard(game),
            username
        });

        rooms[room].members.push(username)

        console.log(games)
    })

    client.on('disconnect', () => {
        console.log('pkkarn', client.id)
        if(!players[client.id]) return; 
        let room = players[client.id].room
        let username = players[client.id].username
        let game = resolveGame(room);
        if(game) {
            game.removePlayer(username)
            io.to(room).emit('remove_player', {
                game: responseBoard(game),
            });
        }
    })

    client.on('set_card', ({ data, room }) => {
        let game = resolveGame(room);
        game.setCard(data.card, data.pos, data?.color)
        io.to(room).emit('update_board', responseBoard(game))
    })

    client.on('get_card', (room) => {
        let game = resolveGame(room);
        game.fetchCard();
        io.to(room).emit('update_board', responseBoard(game))
    })
    client.on('pass_card', (room) => {
        let game = resolveGame(room);
        game.pass();
        io.to(room).emit('update_board', responseBoard(game))
    })
}