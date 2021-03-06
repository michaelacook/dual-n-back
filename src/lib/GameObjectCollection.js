/*
The GameObjectCollection provides a set of methods 
for calculating scores from an array of either GameSounds or GameSpaces 
*/

class GameObjectCollection {
  constructor(collection = []) {
    this._collection = collection
  }

  get collection() {
    return this._collection
  }

  /**
   * Calculate matches from game data
   * @param {Number} nback - number back from current game iteration to check for matches
   * @returns {Number}
   */
  matches(nback) {
    let matches = 0
    for (let i = nback; i < this._collection.length; i++) {
      const cur = this._collection[i]
      if (cur.matchAsserted) {
        const prev = this._collection[i - nback]
        if (prev.key === cur.key) {
          matches += 1
        }
      }
    }
    return matches
  }

  /**
   * Calculate all possible matches contained in the collection
   * @param {Number} nback - number back from current game iteration to check for matches
   * @returns {Number}
   */
  possibleMatches(nback) {
    let possible = 0
    for (let i = nback; i < this._collection.length; i++) {
      const cur = this._collection[i]
      const prev = this._collection[i - nback]
      if (cur.key === prev.key) {
        possible += 1
      }
    }
    return possible
  }

  /**
   * Calculate all missed matches in the collection
   * @param {Number} nback - number back from current game iteration to check for matches
   */
  missedMatches(nback) {
    let missed = 0
    for (let i = nback; i < this._collection.length; i++) {
      const cur = this._collection[i]
      if (!cur.matchAsserted) {
        const prev = this._collection[i - nback]
        if (cur.key === prev.key) {
          missed += 1
        }
      }
    }
    return missed
  }

  /**
   * Calculate wrongly asserted matches
   * @param {Number} nBack - number back from current game iteration to check for false matches
   * @returns {Number}
   */
  falseMatches(nback) {
    let _false = 0
    for (let i = nback; i < this._collection.length; i++) {
      const cur = this._collection[i]
      if (cur.matchAsserted) {
        const prev = this._collection[i - nback]
        if (prev.key !== cur.key) {
          _false += 1
        }
      }
    }
    return _false
  }
}

export default GameObjectCollection
