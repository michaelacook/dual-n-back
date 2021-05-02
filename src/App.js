import React, { Component } from "react"
import { Button, Container, Dropdown, Grid, Progress } from "semantic-ui-react"
import GameSpaceCollection from "./lib/GameSpaceCollection"
import GameSoundCollection from "./lib/GameSoundCollection"
import GameSpace from "./lib/GameSpace"
import GameSound from "./lib/GameSound"
import Game from "./lib/Game"
import nBackDropDownOptions from "./nBackDropDownOptions"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      game: new Game(2),
      iteration: -1,
      currentVisualScore: 0,
      currentAudioScore: 0,
      currentMissedVisualMatches: 0,
      currentMissedAudioMatches: 0,
      currentGameSpaces: [],
      gameSoundCollection: [],
      gameSpaceTrialHistory: [],
      gameSoundTrialHistory: [],
      trialProgress: -4.35,
      0: null,
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
      6: null,
      7: null,
      8: null,
    }
  }

  incrementNBack = () => {
    const game = this.state.game
    game.nBack = game.nBack + 1
    this.setState({
      game: game,
    })
  }

  decrementNBack = () => {
    const game = this.state.game
    if (game.nBack > 1) {
      game.nBack = game.nBack - 1
      this.setState({
        game: game,
      })
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.start)
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.start)
  }

  /**
   * On completion of game trial create instances of GameSpaceCollection and GameSoundCollection
   * For calculation of scores
   */
  completeGameTrial() {
    setTimeout(() => {
      console.log("Trial complete")
      const game = this.state.game
      game.active = false
      const currentGameSpaces = this.state.currentGameSpaces
      const gameSoundCollection = this.state.gameSoundCollection
      const gameSpaceTrialHistory = this.state.gameSpaceTrialHistory
      const gameSoundTrialHistory = this.state.gameSoundTrialHistory
      this.setState(
        {
          game: game,
          gameSpaceTrialHistory: [
            ...gameSpaceTrialHistory,
            new GameSpaceCollection(currentGameSpaces),
          ],
          gameSoundTrialHistory: [
            ...gameSoundTrialHistory,
            new GameSoundCollection(gameSoundCollection),
          ],
        },
        () => {
          this.calculateCurrentScores()
        }
      )
    }, 2000)
  }

  /**
   * Calculate visual and audio scores from most recent game trial and set to state
   */
  calculateCurrentScores = () => {
    const nBack = this.state.game.nBack
    const spaceCollection = [...this.state.gameSpaceTrialHistory].pop()
    const soundCollection = [...this.state.gameSoundTrialHistory].pop()

    const possibleVisualMatches = spaceCollection.possibleMatches(nBack)
    const possibleAudioMatches = soundCollection.possibleMatches(nBack)

    const visualScore = spaceCollection.matches(nBack)
    const audioScore = soundCollection.matches(nBack)

    const missedVisualMatches = spaceCollection.missedMatches(nBack)
    const missedAudioMatches = soundCollection.missedMatches(nBack)

    this.setState({
      currentVisualScore:
        visualScore > 0
          ? `${Math.floor((visualScore / possibleVisualMatches) * 100)}%`
          : 0,
      currentAudioScore:
        audioScore > 0
          ? `${Math.floor((audioScore / possibleAudioMatches) * 100)}%`
          : 0,
      currentMissedVisualMatches: missedVisualMatches,
      currentMissedAudioMatches: missedAudioMatches,
    })
  }

  /**
   * Run a single trial iteration
   * Makes a random space visible and plays a random game sound, then adds both to a collection
   * One game iteration actually consists of a space iteration and a sound iteration
   * A space becomes visible for 1 second, and a sound is played
   */
  runTrialIteration = () => {
    const space = GameSpace.createRandomGameSpace()
    const sound = GameSound.createRandomGameSound()
    const key = space.key
    const currentGameSpaces = this.state.currentGameSpaces
    const gameSoundCollection = this.state.gameSoundCollection
    gameSoundCollection.push(sound)
    currentGameSpaces.push(space)
    this.setState(
      {
        [key]: space,
        currentGameSpaces: currentGameSpaces,
        gameSoundCollection: gameSoundCollection,
      },
      () => {
        sound.play()
      }
    )
    setTimeout(() => {
      this.setState(
        {
          [key]: null,
        },
        () => true
      )
    }, 1000)
  }

  /**
   * Run a series of 24 game trials
   * Each iteration updates the iteration state and increments the progress bar
   */
  runGameTrial = () => {
    const id = setInterval(() => {
      this.setState(
        (prevState) => ({
          iteration: prevState.iteration + 1,
          trialProgress: prevState.trialProgress + 4.35,
        }),
        this.runTrialIteration
      )
      if (this.state.iteration === 23) {
        clearInterval(id)
        this.completeGameTrial()
      }
    }, 3000)
  }

  /**
   * Set game state to active, start the game trial
   * @param {Object} e - SyntheticEvent
   */
  start = (e) => {
    const game = this.state.game
    game.active = true
    this.setState(
      {
        game: game,
      },
      () => {
        if (e.key === " " || e.key === 32) {
          this.runGameTrial()
        }
      }
    )
  }

  assertSpaceMatch = () => {
    const currentGameSpaces = this.state.currentGameSpaces
    currentGameSpaces[currentGameSpaces.length - 1].matchAsserted = true
    this.setState({
      currentGameSpaces: currentGameSpaces,
    })
  }

  assertSoundMatch = () => {
    const gameSoundCollection = this.state.gameSoundCollection
    gameSoundCollection[gameSoundCollection.length - 1].matchAsserted = true
    this.setState({
      gameSoundCollection: gameSoundCollection,
    })
  }

  render() {
    return (
      <Container>
        <Grid columns={3} style={{ width: "600px", margin: "0 auto" }}>
          <Grid.Column textAlign="left">
            <p>Visual Score: {this.state.currentVisualScore}</p>
            <p>Audio Score: {this.state.currentAudioScore}</p>
          </Grid.Column>
          <Grid.Column textAlign="left">
            <p>
              Missed Visual Matches: {this.state.currentMissedVisualMatches}
            </p>
            <p>Missed Audio Matches: {this.state.currentMissedAudioMatches}</p>
          </Grid.Column>
          <Grid.Column textAlign="right">
            <Dropdown
              simple
              placeholder="N Back"
              options={nBackDropDownOptions}
              value={this.state.game.nBack + 1}
            />
          </Grid.Column>
        </Grid>
        <Grid
          id="grid"
          style={{ width: "600px", margin: "0 auto", marginTop: "30px" }}
          columns="equal"
          celled
        >
          <Grid.Row style={{ height: "175px" }}>
            <Grid.Column>
              <div
                style={{ height: "100%" }}
                className={this.state[0] ? "visible-space" : null}
                key={0}
              ></div>
            </Grid.Column>
            <Grid.Column>
              <div
                style={{ height: "100%" }}
                className={this.state[1] ? "visible-space" : null}
                key={1}
              ></div>
            </Grid.Column>
            <Grid.Column>
              <div
                style={{ height: "100%" }}
                className={this.state[2] ? "visible-space" : null}
                key={2}
              ></div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row style={{ height: "175px" }}>
            <Grid.Column>
              <div
                style={{ height: "100%" }}
                className={this.state[3] ? "visible-space" : null}
                key={3}
              ></div>
            </Grid.Column>
            <Grid.Column>
              <div
                style={{ height: "100%" }}
                className={this.state[4] ? "visible-space" : null}
                key={4}
              ></div>
            </Grid.Column>
            <Grid.Column>
              <div
                style={{ height: "100%" }}
                className={this.state[5] ? "visible-space" : null}
                key={5}
              ></div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row style={{ height: "175px" }}>
            <Grid.Column>
              <div
                style={{ height: "100%" }}
                className={this.state[6] ? "visible-space" : null}
                key={6}
              ></div>
            </Grid.Column>
            <Grid.Column>
              <div
                style={{ height: "100%" }}
                className={this.state[7] ? "visible-space" : null}
                key={7}
              ></div>
            </Grid.Column>
            <Grid.Column>
              <div
                style={{ height: "100%" }}
                className={this.state[8] ? "visible-space" : null}
                key={8}
              ></div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div style={{ width: "600px", margin: "0 auto", marginTop: "30px" }}>
          <Grid columns={3}>
            <Grid.Column>
              <Button onClick={this.assertSoundMatch} fluid size="huge">
                Audio Match
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button
                onClick={() => {
                  this.assertSoundMatch()
                  this.assertSpaceMatch()
                }}
                fluid
                size="huge"
              >
                Dual
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button onClick={this.assertSpaceMatch} fluid size="huge">
                Space Match
              </Button>
            </Grid.Column>
          </Grid>
        </div>
        <div style={{ width: "650px", margin: "0 auto", marginTop: "30px" }}>
          <Progress
            color="green"
            percent={this.state.trialProgress}
            style={{ marginTop: "25px" }}
          />
        </div>
      </Container>
    )
  }
}

export default App
