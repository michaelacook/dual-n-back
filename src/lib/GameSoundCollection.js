import GameCollection from "./GameCollection"
import GameSound from "./GameSound"

class GameSoundCollection extends GameCollection {
  constructor(collection = []) {
    super(collection)
  }

  /**
   * Generates a random collection of GameSound objects
   * @returns {Object|Array}
   */
  static createGameSoundCollection() {
    const collection = []
    while (collection.length <= 9) {
      collection.push(GameSound.createRandomGameSound())
    }
    return new GameSoundCollection(collection)
  }
}

export default GameSoundCollection
