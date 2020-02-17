import Card from './Card.js'

class Deck {
  constructor(initialDeck=[]) {
    this.deckList = initialDeck

    this.deckHtmlElement = document.createElement('div')
    this.deckHtmlElement.classList.add('deck')
    this.updateDeckHtmlElement()
  }

  getDeckHtmlElement() {
    return this.deckHtmlElement
  }
  
  pushCard(card) {
    this.deckList.push(card)
    this.updateDeckHtmlElement()
  }

  removeCard(card) {
    this.deckList = this.deckList.filter(value => value != card)
    this.updateDeckHtmlElement()
  }

  updateDeckHtmlElement() {
    this.deckHtmlElement.innerHTML = ''
    this.deckList.forEach(card => {
      this.deckHtmlElement.appendChild(card.getHtmlCard(false))
    });
  }

  popCardHtmlElementByIndex(index) {
    let card = this.deckList[index]
    this.removeCard(card)
    return card
  }

  popRandomCard(canBeSpecial=true) {
    if(canBeSpecial) {
      return this.popCardHtmlElementByIndex(Math.floor(Math.random() * this.deckList.length))
    } else {
      let tmp = this.deckList.filter(card => !card.special)
      let card = tmp[Math.floor(Math.random() * tmp.length)]
      this.removeCard(card)
      return card
    }
  }
}

export default Deck
