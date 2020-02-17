import Deck from './Deck.js'
import Card from './Card.js'

const numCardsPerDeck = 7

class Game {
  constructor(num_players=2, playersNames=['Player1', 'Player2'], rootElement=document.querySelector('main')||document.body) {
    this.num_players = num_players
    this.root = rootElement

    this.stackOfCards = new Deck()
    this.playersDecks = Object.fromEntries(playersNames.map(name => [name, new Deck()]))

    this.clickCallbackHandler = this.clickCallbackHandler.bind(this)
    this._init()
  }

  _init() {
    this.populateStackOfCards()
    this.populatePlayersDecks()
    this.updateBoard()
  }

  populateStackOfCards() {
    for (let color of ['red', 'green', 'blue', 'yellow']) {
      for (let number=0; number < 10; number++) {
        this.stackOfCards.pushCard(new Card(number, color, false, this.clickCallbackHandler))
        this.stackOfCards.pushCard(new Card(number, color, false, this.clickCallbackHandler))
      }
      this.stackOfCards.pushCard(new Card('+2', color, true, this.clickCallbackHandler))
      this.stackOfCards.pushCard(new Card('+2', color, true, this.clickCallbackHandler))
      
      this.stackOfCards.pushCard(new Card('C', 'black', true, this.clickCallbackHandler))
      this.stackOfCards.pushCard(new Card('C', 'black', true, this.clickCallbackHandler))
    }

    this.actualCard = this.stackOfCards.popRandomCard(false)
    this.actualInfo = {
      color: this.actualCard.color,
      symbol: this.actualCard.symbol
    }
  }

  populatePlayersDecks() {
    for(let playerName of Object.keys(this.playersDecks)) {
      this.playersDecks[playerName] = new Deck()
      for(let i=0; i<numCardsPerDeck; i++) {
        this.playersDecks[playerName].pushCard(this.stackOfCards.popRandomCard())
      }
    }
    this.actualPlayerIndex = Math.floor(Math.random() * Object.keys(this.playersDecks).length)
  }

  updateBoard() {
    this.playerNameContainer = this.playerNameContainer || document.createElement('div')
    this.playerNameContainer.classList.add('playerName')
    this.playerNameContainer.innerText = Object.keys(this.playersDecks)[this.actualPlayerIndex]

    this.actualCardContainerHtml = this.actualCardContainerHtml || document.createElement('div')
    this.actualCardContainerHtml.classList.add('actualCard')
    this.actualCardContainerHtml.appendChild(this.actualCard.getHtmlCard(false))

    this.actualDeckContainerHtml = this.actualDeckContainerHtml || document.createElement('div')
    this.actualDeckContainerHtml.classList.add('actualPlayerDeck')
    this.actualDeckContainerHtml.appendChild(this.getPlayerDeck(this.actualPlayerIndex).getDeckHtmlElement())

    this.root.appendChild(this.playerNameContainer)
    this.root.appendChild(this.actualCardContainerHtml)
    this.root.appendChild(this.actualDeckContainerHtml)
  }

  getPlayerDeck(playerIndex) {
    let playerName = Object.keys(this.playersDecks)[playerIndex]
    return this.playersDecks[playerName]
  }

  clickCallbackHandler(event, clickedCard) {
    if(this.verifyCorrectCard(clickedCard)) {
      this.getPlayerDeck(this.actualPlayerIndex).removeCard(clickedCard)
      this.updateActualCard(clickedCard)
      this.nextTurn()
    }
  }

  nextTurn(){
    console.log(this)
    this.nextPlayer()
  }

  updateActualCard(card, info={}) {
    this.stackOfCards.pushCard(this.actualCard)
    this.actualCard = card
    this.updateBoard()
    this.actualInfo = {
      color: card.color,
      symbol: card.symbol
    }
  }

  verifyCorrectCard(card) {
    return card.color == 'black' || card.color == this.actualInfo.color || card.symbol == this.actualInfo.symbol
  }

  nextPlayer() {

  }
}

export default Game
