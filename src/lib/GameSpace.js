import GameObject from "./GameObject"

class GameSpace extends GameObject {
  /**
   * Constructor
   * @param {Number} key - identifier for game object
   */
  constructor(key) {
    super(key)
    this._visible = false
  }

  get index() {
    return this._key
  }

  set visible(bool) {
    if (typeof bool !== "boolean") {
      throw new Error("Must pass a boolean")
    }
    this._visible = bool
  }

  get visible() {
    return this._visible
  }

  /**
   * Generate a GameSpace object with a random key
   * @returns {Object} created random GameSpace
   */
  static createRandomGameSpace() {
    const key = Math.floor(Math.random() * 9)
    return new GameSpace(key)
  }
}

export default GameSpace
