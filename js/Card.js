// TODO: Validate colors and symbols are correct

class Card {
  constructor(symbol='0', color='red', special=false, clickCallback=()=>{}) {
    this.special = special
    this.color = color
    this.symbol = symbol
    this.clickCallback = ((event) => {
      clickCallback(event, this)
    }).bind(this)

    this._createHtmlCard()
  }

  _createHtmlCard() {
    let cardCorner = document.createElement('div')
    cardCorner.classList.add('card__corner')
    cardCorner.innerText = this.symbol
    
    let cardNumber = document.createElement('div')
    cardNumber.classList.add('card__number')
    cardNumber.innerText = this.symbol
    
    let card = document.createElement('div')
    card.classList.add('card', `card--${this.color}`)
    card.appendChild(cardCorner)
    card.appendChild(cardNumber)
    card.addEventListener('click', this.clickCallback)
    
    this.htmlElement = card
  }

  getHtmlCard(large=true) {
    if(large) {
      this.htmlElement.classList.remove('card--small')
      this.htmlElement.classList.add('card--large')
    } else {
      this.htmlElement.classList.remove('card--large')
      this.htmlElement.classList.add('card--small')
    }

    return this.htmlElement
  }
}

export default Card
