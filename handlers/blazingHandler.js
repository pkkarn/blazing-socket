const Blaze = require('../Blaze')

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

// players_detail
let players = {};

module.exports = (io, client, game) => {
    console.log(client.id, responseBoard(game),'Blazing client added')
    
    // whent client starts_game
    client.on('start_game', ({ username }) => {
        game.addPlayer(username)
        players[client.id] = username

        io.emit('add_player', {
            game: responseBoard(game),
            username
        });
    })
    client.on('disconnect', () => {
        game.removePlayer(players[client.id])
        io.emit('remove_player', {
            game: responseBoard(game),
        });
    })

    client.on('set_card', (data) => {
        game.setCard(data.card, data.pos, data?.color)
        io.emit('update_board', responseBoard(game))
    })

    client.on('get_card', () => {
        game.fetchCard();
        io.emit('update_board', responseBoard(game))
    })
    client.on('pass_card', () => {
        game.pass();
        io.emit('update_board', responseBoard(game))
    })
}