import A from "../audio/A.wav"
import B from "../audio/B.wav"
import C from "../audio/C.wav"
import D from "../audio/D.wav"
import E from "../audio/E.wav"
import F from "../audio/F.wav"
import G from "../audio/G.wav"
import H from "../audio/H.wav"
import I from "../audio/I.wav"
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
      { sound: A, key: "A" },
      { sound: B, key: "B" },
      { sound: C, key: "C" },
      { sound: D, key: "D" },
      { sound: E, key: "E" },
      { sound: F, key: "F" },
      { sound: G, key: "G" },
      { sound: H, key: "H" },
      { sound: I, key: "I" },
    ]

    const file = files[Math.floor(Math.random() * 9)]

    return new GameSound(file.sound, file.key)
  }
}

export default GameSound
