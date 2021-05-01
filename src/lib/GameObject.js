class GameObject {
  constructor(key) {
    this._matchAsserted = null
    this._key = key
  }

  set matchAsserted(bool) {
    if (typeof bool !== "boolean") {
      throw new Error("Must be a boolean type")
    }
    this._matchAsserted = bool
  }

  get matchAsserted() {
    return this._matchAsserted
  }

  get key() {
    return this._key
  }
}

export default GameObject
