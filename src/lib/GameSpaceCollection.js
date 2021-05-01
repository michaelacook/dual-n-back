import GameCollection from "./GameCollection"
import GameSpace from "./GameSpace"

class GameSpaceCollection extends GameCollection {
  constructor(collection = []) {
    super(collection)
  }

  /**
   * Generate a random collection of GameSpace objects
   * @returns {Object|Array}
   */
  static createGameSpaceCollection() {
    const collection = []
    while (collection.length <= 9) {
      collection.push(GameSpace.createRandomGameSpace())
    }
    return new GameSpaceCollection(collection)
  }
}

export default GameSpaceCollection
