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
    this.eatACard = this.eatACard.bind(this)
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
    this.actualDeckContainerHtml.innerHTML = ''
    this.actualDeckContainerHtml.appendChild(this.getPlayerDeck(this.actualPlayerIndex).getDeckHtmlElement())

    this.eatCardButton = this.eatCardButton || document.createElement('div')
    this.eatCardButton.innerHTML = '<p>Eat a card</p>'
    this.eatCardButton.classList.add('eatCardButton')
    this.eatCardButton.addEventListener('click', this.eatACard)

    this.root.appendChild(this.playerNameContainer)
    this.root.appendChild(this.actualCardContainerHtml)
    this.root.appendChild(this.actualDeckContainerHtml)
    this.root.appendChild(this.eatCardButton)
  }

  getPlayerDeck(playerIndex) {
    let playerName = Object.keys(this.playersDecks)[playerIndex]
    return this.playersDecks[playerName]
  }

  clickCallbackHandler(event, clickedCard) {
    if(this.verifyCorrectCard(clickedCard)) {
      let normalDisplay = this.root.style.display || 'flex'
      this.root.style.display = 'none'
      setTimeout((() => {
        this.getPlayerDeck(this.actualPlayerIndex).removeCard(clickedCard)
        this.updateActualCard(clickedCard)
        this.nextTurn(clickedCard)
        this.root.style.display = normalDisplay
      }).bind(this), 500)
    }
  }

  updateActualCard(card, info={}) {
    this.stackOfCards.pushCard(this.actualCard)
    this.actualCard = card
    this.actualInfo = {
      color: card.color,
      symbol: card.symbol
    }
  }

  verifyCorrectCard(card) {
    return card.color == 'black' || card.color == this.actualInfo.color || card.symbol == this.actualInfo.symbol
  }

  nextTurn(clickedCard){
    if(clickedCard.special) {
      this.specialCardHandler(clickedCard)
    } else {
      this.nextPlayer()
    }
    this.updateBoard()
  }
  
  nextPlayer(clickedCard) {
    if(this.actualPlayerIndex + 1 < Object.keys(this.playersDecks).length) {
      this.actualPlayerIndex += 1
    } else {
      this.actualPlayerIndex = 0
    }
  }

  specialCardHandler(card) {
    switch (card.symbol) {
      case '+2':
        this.nextPlayer()
        this.eatACard()
        this.eatACard()
        this.nextPlayer()
        break;
      
      case 'C':
        let color
        do {
          color = prompt('Select a color: \n red | blue | yellow | green')
          color = color.toLowerCase()
        } while(!['green', 'red', 'blue', 'yellow'].includes(color))
        this.actualInfo.color = color
        this.nextPlayer()
        break;
    }
  }

  eatACard() {
    if(this.stackOfCards.deckList.length > 0) {
      let card = this.stackOfCards.popRandomCard(true)
      this.getPlayerDeck(this.actualPlayerIndex).pushCard(card)
    } else {
      alert('There aren\'t any cards')
    }
  }
}

export default Game
