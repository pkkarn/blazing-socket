const Player = require( './Player.js')
const Card = require( './Card.js')
class BlazingBoard {
    constructor(players) {
        this.firstPlayer = null; // 0 <-> 1 -> 2 - 3 next = null
        this.lastPlayer = null;
        this.activePlayer = null;
        this.moveType = 'next'
        this.activeCard = new Card(this.randomInt(1,14), this.randomInt(0,4));
        this.initPlayers(players);
    }

    randomInt(min, max) {
        return Math.floor(Math.random(min)*max) + min
    }

    swapCards(firstPlayer, secondPlayer) {
        let cardFirst = firstPlayer.cards;
        let cardSecond = secondPlayer.cards;
        secondPlayer.cards = cardFirst
        firstPlayer.cards = cardSecond
    }

    addOneCardToOthers() {
        let currPlayer = this.firstPlayer

        while(currPlayer) {
            if(currPlayer.username !== this.activePlayer.username) {
                let code = this.randomInt(1,13)
                let color = this.randomInt(0,4)
                currPlayer.cardPush(code, color)
            }
            currPlayer = currPlayer.next;
        }
    }

    pass() {
        this.nextMove()
    }

    fetchCard() {
        let code = this.randomInt(1,14)
        let color = this.randomInt(0,4)
        this.activePlayer.cardPush(code, color)
    }

    setCard(card, pos, choice) {
        // reverse Card
        if(card.code === 14) {
            this.activeCard = card;
            // reverse and swap card with next person
            this.activePlayer.removedCard(pos)
            this.swapCards(this.activePlayer, this.nextPlayer())
            this.nextMove()
            return;
        }

        if(card.code === 8) {
            this.activePlayer.removedCard(pos)
            let card = new Card(8, choice)
            this.activeCard = card;
            this.nextMove()
            return;
        }

        // if(card.code === 8) {
        //     this.activeCard = card;
        //     return;
        // } // define card to choose
        // if card color is same or code is same;
        if((card.color === this.activeCard.color) || (card.code === this.activeCard.code)) {
            this.activeCard = card;
            // Remove card if its shuffled
            this.activePlayer.removedCard(pos)

            // Skip one player in current direction
            if(card.code === 11) {
                this.nextMove()
            }

            // change direction
            if(card.code === 12) {
                this.moveType = 'prev'
            }


            if(card.code === 13) {
                this.addOneCardToOthers()
                // this.pushCardInsideEveryoneExceptActive Player
            } 

            this.nextMove()
        }
    }

    initPlayers(players) {
        players.forEach(player => {
            this.addPlayer(player);
        })
    }

    addPlayer(player) {
        let newPlayer = new Player(player);
        if(!this.firstPlayer) {
            this.firstPlayer = newPlayer;
            this.lastPlayer = newPlayer;

            this.status = 1

            this.activePlayer = this.firstPlayer
        } else {
            newPlayer.prev = this.lastPlayer
            this.lastPlayer.next = newPlayer;
            this.lastPlayer = newPlayer;
        }
    }

    getPlayer(username) {
        if(this.firstPlayer === null) return
        if(this.firstPlayer.username === username) return this.firstPlayer
        if(this.lastPlayer.username === username) return this.lastPlayer

        let curr = this.firstPlayer;

        while(curr.next) {
            if(curr.username === username) return curr;
            curr = curr.next
        }

        return null
    }

    removePlayer(username) {
        const player = this.getPlayer(username);
        if(player) {
            if((player.next === null) && (player.prev === null)) {
                this.firstPlayer, this.lastPlayer, this.activePlayer = null;
                return;
            }
            if(player.next === null) {
                let temp = player.prev;
                temp.next = null;
                this.lastPlayer = temp;
                this.activePlayer = this.lastPlayer
                return;
            }
            if(player.prev === null) {
                let temp = player.next;
                this.firstPlayer = temp
                temp.prev = null;
                this.activePlayer = this.firstPlayer
                return;
            }
            
            // 1 <-> 2<-> 2

            let prev = player.prev
            let next = player.next;
            next.prev = prev;
            prev.next = next;
            this.activePlayer = next;
            return;
        }
    }

    nextPlayer() {
        let nextPlayer = null
        if(this.moveType === 'next') {
            if(this.activePlayer.next) {
                nextPlayer = this.activePlayer.next
            } else {
                nextPlayer = this.firstPlayer
            }
        } else if(this.moveType === 'prev') {
            if(this.activePlayer.prev) {
                nextPlayer = this.activePlayer.prev;
            } else {
                nextPlayer = this.lastPlayer
            }
        }

        return nextPlayer
    }

    nextMove() {
        this.activePlayer.status = 0;
        this.activePlayer = this.nextPlayer()
        this.activePlayer.status = 1
    }


    /**
     * - deckFetch Card;
     * - cardRemove from Player List
     * - Special Card Handling
     * - Reverse move enable
     */
}

module.exports = BlazingBoard