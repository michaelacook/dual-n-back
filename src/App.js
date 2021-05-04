import React, { Component } from "react"
import {
  Button,
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Progress,
} from "semantic-ui-react"
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
      level: 0,
      trials: 20,
      currentVisualScore: 0,
      currentAudioScore: 0,
      currentMissedVisualMatches: 0,
      currentMissedAudioMatches: 0,
      currentGameSpaces: [],
      currentGameSounds: [],
      gameSpaceTrialHistory: [],
      gameSoundTrialHistory: [],
      trialProgress: 0,
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

  componentDidMount() {
    document.addEventListener("keydown", this.start)
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.start)
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

  updateNBack = (e, data) => {
    const game = this.state.game
    game.nBack = data.value
    this.setState({
      game: game,
    })
  }

  incrementProgressBar = () => {
    this.setState((prevState) => ({
      trialProgress: prevState.trialProgress + 4,
    }))
  }

  incrementLevel = () => {
    this.setState((prevState) => ({
      level: prevState.level + 1,
    }))
  }

  decrementTrials = () => {
    if (this.state.trials > 0) {
      this.setState((prevState) => ({
        trials: prevState.trials - 1,
      }))
    }
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
      const currentGameSounds = this.state.currentGameSounds
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
            new GameSoundCollection(currentGameSounds),
          ],
        },
        () => {
          this.calculateCurrentScores()
        }
      )
    }, 3000)
  }

  /**
   * Calculate visual and audio scores from most recent game trial and set to state
   * Increment or decrement nBack based on calculated scores
   */
  calculateCurrentScores = () => {
    const nBack = this.state.game.nBack
    const spaceCollection = [...this.state.gameSpaceTrialHistory].pop()
    const soundCollection = [...this.state.gameSoundTrialHistory].pop()

    const possibleVisualMatches = spaceCollection.possibleMatches(nBack)
    const possibleAudioMatches = soundCollection.possibleMatches(nBack)

    const visualScore = Math.floor(
      (spaceCollection.matches(nBack) / possibleVisualMatches) * 100
    )
    const audioScore = Math.floor(
      (soundCollection.matches(nBack) / possibleAudioMatches) * 100
    )

    const missedVisualMatches = spaceCollection.missedMatches(nBack)
    const missedAudioMatches = soundCollection.missedMatches(nBack)

    this.setState({
      currentVisualScore: visualScore > 0 ? `${visualScore}%` : 0,
      currentAudioScore: audioScore > 0 ? `${audioScore}%` : 0,
      currentMissedVisualMatches: missedVisualMatches,
      currentMissedAudioMatches: missedAudioMatches,
    })

    if (visualScore >= 70 && audioScore >= 70) {
      this.incrementNBack()
    }

    if (visualScore < 40 && audioScore < 40 && this.state.game.nBack > 2) {
      this.decrementNBack()
    }
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
    const currentGameSounds = this.state.currentGameSounds
    currentGameSounds.push(sound)
    currentGameSpaces.push(space)
    this.setState(
      {
        [key]: space,
        currentGameSpaces: currentGameSpaces,
        currentGameSounds: currentGameSounds,
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
        () => {
          this.incrementProgressBar()
        }
      )
    }, 1200)
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
        }),
        this.runTrialIteration
      )
      if (this.state.iteration === 24) {
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
    if (e.key === " " || e.key === 32) {
      const game = this.state.game
      game.active = true
      this.setState(
        {
          game: game,
          iteration: -1,
          currentVisualScore: 0,
          currentAudioScore: 0,
          currentMissedVisualMatches: 0,
          currentMissedAudioMatches: 0,
          currentGameSpaces: [],
          currentGameSounds: [],
          trialProgress: 0,
        },
        () => {
          this.incrementLevel()
          this.decrementTrials()
          this.runGameTrial()
        }
      )
    }
  }

  assertSpaceMatch = () => {
    const currentGameSpaces = this.state.currentGameSpaces
    currentGameSpaces[currentGameSpaces.length - 1].matchAsserted = true
    this.setState({
      currentGameSpaces: currentGameSpaces,
    })
  }

  assertSoundMatch = () => {
    const currentGameSounds = this.state.currentGameSounds
    currentGameSounds[currentGameSounds.length - 1].matchAsserted = true
    this.setState({
      currentGameSounds: currentGameSounds,
    })
  }

  render() {
    return (
      <Container>
        <span>
          <img src="logo.png" alt="logo"></img>
          <Header
            style={{
              marginTop: "35px",
              display: "inline-block",
            }}
            as="h1"
          >
            Dual N-Back
          </Header>
        </span>
        <Grid relaxed>
          <Grid.Column
            width={3}
            textAlign="left"
            style={{
              marginTop: "27px",
              backgroundColor: "#E5E5E5",
              borderRadius: "3px",
              padding: "28px",
            }}
          >
            <p>
              Visual Score:{" "}
              <span style={{ fontWeight: "bold" }}>
                {this.state.currentVisualScore}
              </span>
            </p>
            <p>
              Audio Score:{" "}
              <span style={{ fontWeight: "bold" }}>
                {this.state.currentAudioScore}
              </span>
            </p>
            <p>
              Missed Visual Matches:{" "}
              <span style={{ fontWeight: "bold" }}>
                {this.state.currentMissedVisualMatches}
              </span>
            </p>
            <p>
              Missed Audio Matches:{" "}
              <span style={{ fontWeight: "bold" }}>
                {this.state.currentMissedAudioMatches}
              </span>
            </p>
            <Divider />
            <p>What Is Dual N-Back?</p>
            <p>How To Play</p>
          </Grid.Column>
          <Grid.Column width={9}>
            <Grid id="grid" columns="3" celled style={{ borderRadius: "3px" }}>
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
            <Grid columns={3} centered>
              <Grid.Column>
                <Button
                  textAlign="center"
                  onClick={this.assertSoundMatch}
                  fluid
                  size="big"
                >
                  Audio Match
                </Button>
              </Grid.Column>
              <Grid.Column>
                <Button
                  textAlign="center"
                  onClick={() => {
                    this.assertSoundMatch()
                    this.assertSpaceMatch()
                  }}
                  fluid
                  size="big"
                >
                  Dual
                </Button>
              </Grid.Column>
              <Grid.Column>
                <Button
                  textAlign="center"
                  onClick={this.assertSpaceMatch}
                  fluid
                  size="big"
                >
                  Visual Match
                </Button>
              </Grid.Column>
            </Grid>
            <Progress
              color="green"
              percent={this.state.trialProgress}
              style={{ marginTop: "25px" }}
              content={`${this.state.trialProgress}%`}
            />
          </Grid.Column>
          <Grid.Column
            width={3}
            style={{
              marginTop: "27px",
              backgroundColor: "#E5E5E5",
              borderRadius: "3px",
              padding: "28px",
            }}
          >
            <p>
              Level:{" "}
              <span style={{ fontWeight: "bold" }}>{this.state.level}</span>
            </p>
            <p>
              Number of trails:{" "}
              <span style={{ fontWeight: "bold" }}>{this.state.trials}</span>
            </p>
            <Dropdown
              simple
              placeholder="N Back"
              options={nBackDropDownOptions}
              value={this.state.game.nBack}
              onChange={this.updateNBack}
            />
          </Grid.Column>
        </Grid>
      </Container>
    )
  }
}

export default App
