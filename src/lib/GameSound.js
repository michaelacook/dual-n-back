import GameObject from "./GameObject"

class GameSound extends GameObject {
  constructor(file, key) {
    super(key)
    this._sound = new Audio(file)
  }

  /**
   * Run sound file
   */
  play() {
    this._sound.play()
  }

  /**
   * Generate a random GameSound object
   * @returns {Object} GameSound
   */
  static createRandomGameSound() {
    const files = [
      { path: "../audio/A.wav", key: "A" },
      { path: "../audio/B.wav", key: "B" },
      { path: "../audio/C.wav", key: "C" },
      { path: "../audio/D.wav", key: "D" },
      { path: "../audio/E.wav", key: "E" },
      { path: "../audio/F.wav", key: "F" },
      { path: "../audio/G.wav", key: "G" },
      { path: "../audio/H.wav", key: "H" },
      { path: "../audio/I.wav", key: "I" },
    ]

    const file = files[Math.floor(Math.random() * 9)]

    return new GameSound(file.path, file.key)
  }
}

export default GameSound
