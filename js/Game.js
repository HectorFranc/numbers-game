import Card from './Card.js'

class Game {
  constructor(num_players=2, playersNames=[], rootElement=document.body) {
    this.num_players = num_players
    this.root = rootElement
    this.stackOfCards = []
    this.playersNames = playersNames
    this.playersDecks = []
    

    this._init(num_players)
  }

  _init(num_players) {
    this.populateStackOfCards()
    this.populateDecks(num_players)
    this.setBoard()
  }

  populateStackOfCards() {
    for (let color of ['red', 'green', 'blue', 'yellow']) {
      for (let number=0; number < 10; number++) {
        this.stackOfCards.push(new Card(number, color))
        this.stackOfCards.push(new Card(number, color))
      }
      this.stackOfCards.push(new Card('+2', color, true))
      this.stackOfCards.push(new Card('+2', color, true))
      
      this.stackOfCards.push(new Card('C', 'black', true))
      this.stackOfCards.push(new Card('C', 'black', true))
    }
    this.sortStackOfCards()
    this.actualCard = this.getCardFromGameStack(false)
  }

  populateDecks(num_players) {
    for (let i=0; i<this.num_players; i++) {
      this.playersDecks.push([])
      for (let j=0; j<7; j++){
        this.playersDecks[i].push(this.getCardFromGameStack())
      }
    }
    this.actualPlayer = 0
  }

  setBoard() {
    this.deckHtmlElement = document.createElement('div')
    this.deckHtmlElement.classList.add('playerDeck')

    this.actualCardHtmlElement = document.createElement('div')
    this.actualCardHtmlElement.classList.add('actualCard')

    this.root.appendChild(this.actualCardHtmlElement)
    this.root.appendChild(this.deckHtmlElement)

    this.actualCardHtmlElement.appendChild(this.actualCard.getHtmlCard())
    this.showPlayerDeck(this.actualPlayer)
  }

  getCardFromGameStack(canReturnSpecial=true) {
    // return card and remove from stack and can return special
    return this.stackOfCards[Math.floor(Math.random() * this.stackOfCards.length)]
  }

  sortStackOfCards() {
    // Sorts the actual stack of cards
  }

  showPlayerDeck(num_actual_player) {
    this.playersDecks[num_actual_player].forEach(card => {
      this.deckHtmlElement.append(card.getHtmlCard(false))
    })
  }
}

export default Game
