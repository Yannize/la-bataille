import ch from 'chalk'


/**
 * permet de créer un jeux de carte tout beau tout neuf ranger dans l'ordre
 */
const cardCreator = () => {
  const colors = ['♥️', '♣️', '♠️', '♦️']
  const names = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Valet", "Dame", "Roi", 'As']
  const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
  const deck = []

  for (const color of colors) {
    for (const value of values) {
      deck.push({
        color,
        value,
      })
    }
  }

  deck.forEach((card, i) => card.name = names[i % 13])
  return deck
}

// on crée un jeux de carte
const deck = cardCreator()

// warDeck contriendra les cartes en suspend lors d'une bataille
const warDeck = []

let isGameOver = false


// fonction pour mélanger un deck
const shuffledDeck = (deck) => {
  return deck
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}






// on coupe le jeux de carte créé plus haut en 2 part égale (toujours bien ordonnées)
let deckP1 = [...deck.slice(0, deck.length / 2)]
let deckP2 = [...deck.slice(deck.length / 2)]


// on mélange le deck de chaque joueur
deckP1 = shuffledDeck(deckP1)
deckP2 = shuffledDeck(deckP2)


/**
 * Fonction qui permettra de check si un jour n'a plus de carte dans sa main
 */
const checkIfGameOver = () => {
  if (deckP1.length === 0 || deckP2.length === 0) {
    isGameOver = true

    if (deckP1[0]) {
      deckP1.push(...warDeck)
    }

    if (deckP2[0]) {
      deckP2.push(...warDeck)
    }

    return true
  }

  return false
}


/**
 * fonction qui permet de lancer tout le jeux 
 */
const play = () => {
  // check si une des mains est vide
  if (checkIfGameOver()) return

  // chaque joueur pose une carte sur la table
  const cardP1 = deckP1.shift()
  const cardP2 = deckP2.shift()

  console.log(`${ch.blue(`Joueur1 : ${cardP1.name} ${cardP1.color}`)} VS ${ch.magenta(`Joueur2 : ${cardP2.name} ${cardP2.color}`)}`)
  console.log('')


  // si joueur1 gagne
  if (cardP1.value > cardP2.value) {
    console.log(`Le ${ch.blue('joueur 1')} remporte la manche !`)
    console.log('-----------------------------------')

    // on ajoute les 2 cartes jouers à la fin du deck du joueur 1
    deckP1.push(cardP1, cardP2)

    // s'il y'avait eu une bataille auparavant, joueur 1 remporte TOUTE les cartes en suspends
    if (warDeck.length > 0) {
      deckP1.push(...warDeck)

      // on vide warDeck
      warDeck.length = 0
    }

  }

  // si joueur 2 gagne (tout pareil que joueur 1, mais pour joueur 2 !)
  if (cardP1.value < cardP2.value) {
    console.log(`Le ${ch.magenta('joueur 2')} remporte la manche !`)
    console.log('-----------------------------------')

    deckP2.push(cardP1, cardP2)

    if (warDeck.length > 0) {
      deckP2.push(...warDeck)

      warDeck.length = 0
    }

  }

  // s'il y'a égalité, on lance une BATAILLE ! 
  if (cardP1.value === cardP2.value) {
    console.log(`⚔️   ${ch.bgRed('BATAILLE')} ⚔️`)

    // si un des joueurs se retrouve sans carte en main pendant la bataille il perd.
    if (checkIfGameOver()) return

    /**
     * on ajoute dans warDeck les cartes qui viennent d'être jouées (celle qui on provoquées la bataille)
     * et chaque joueur se défausse d'une autre carte.
     * 
     * le tout se trouve dans warDeck qui sera la mise à gagner quand la batailler sera terminée.
     */
    warDeck.push(cardP1, cardP2, deckP1.shift(), deckP2.shift())

    // puis on relance le jeux pour savoir qui sortira vainqueur de la bataille !
    play()
  }


}

// un compteur
let countRound = 0

// une boucle while qui tourne tant que isGameOver est TRUE
while (!isGameOver) {
  /**
   * Certaines parties duraient vraiment... vraiment... mais vraiment trop longtemps.. ^^'
   * Alors j'ai ajouté un p'tit code qui permet qui si au bout de 100 tours rien ne se passe vraiment,
   * chaque joueurs vont remélanger leur cartes actuels puis continuer à jouer
   */
  if (countRound === 100) {
    // chaques joueurs mélangent leur main.
    deckP1 = shuffledDeck(deckP1)
    deckP2 = shuffledDeck(deckP2)

    console.log('')
    console.log('*************************************************')
    console.log(ch.bgRed('On tourne en Rond !'))
    console.log(ch.bgRed('Alors on va remélanger chacun son jeux de carte !'))
    console.log('*************************************************')
    console.log('')

    // on remet le compteur à 0
    countRound = 0
  }

  // et on recommence à jouer !
  play()

  countRound++
}

// si on sort de la fonction play grâce à la fonction isGameOver, c'est qu'il y'a un gagnant
if (deckP1[0]) {
  console.log('')
  console.log(ch.bgRed('!!!!!!!!!!!!!!!!'))
  console.log(ch.blue('PLAYER 1 WIN !!!'))
  console.log(ch.bgRed('!!!!!!!!!!!!!!!!'))
  console.log('')
} else {
  console.log('')
  console.log(ch.bgRed('!!!!!!!!!!!!!!!!'))
  console.log(ch.magenta('PLAYER 2 WIN !!!'))
  console.log(ch.bgRed('!!!!!!!!!!!!!!!!'))
  console.log('')
}