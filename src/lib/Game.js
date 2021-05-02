class Game {
  constructor(nBack) {
    this._scores = []
    this._nBack = nBack
    this._trial = 1
    this._interval = 3000
    this._active = false
  }

  get interval() {
    return this._interval
  }

  set nBack(num) {
    if (!Number.isInteger(num)) {
      throw new Error("num must be a number")
    }
    this._nBack = num
  }

  get nBack() {
    return this._nBack
  }

  get active() {
    return this._active
  }

  set active(bool) {
    if (typeof bool !== "boolean") {
      throw new Error("Boolean value required")
    }
    this._active = bool
  }
}

export default Game
