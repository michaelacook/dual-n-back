import React, { Component } from "react"
import {
  Button,
  Checkbox,
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Icon,
  Progress,
} from "semantic-ui-react"
import GameObjectCollection from "./lib/GameObjectCollection"
import GameSpace from "./lib/GameSpace"
import GameSound from "./lib/GameSound"
import nBackDropDownOptions from "./nBackDropDownOptions"
import Cookies from "js-cookie"
import ControlsModal from "./components/ControlsModal"
import SessionStatsModal from "./components/SessionStatsModal"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showControlsDimmer: true,
      showSessionStats: true,
      active: false,
      nBack: Number(Cookies.get("nBack")) || 2,
      iteration: -1,
      level: Number(Cookies.get("level")) || 0,
      trials: Number(Cookies.get("trials")) || 20,
      currentVisualScore: 0,
      currentAudioScore: 0,
      currentMissedVisualMatches: 0,
      currentMissedAudioMatches: 0,
      currentWrongVisualMatches: 0,
      currentWrongAudioMatches: 0,
      currentGameSpaces: [],
      currentGameSounds: [],
      trialProgress: 0,
      sessionScores: [],
      options: Cookies.get("options")
        ? JSON.parse(Cookies.get("options"))
        : {
            autoUpdateNBack: true,
            saveHistory: false,
          },
      0: false,
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.start)
    document.addEventListener("keydown", this.stop)
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.start)
    document.removeEventListener("keydown", this.stop)
  }

  saveOptions = () => {
    Cookies.set("options", JSON.stringify(this.state.options), { expires: 365 })
  }

  saveLevel = () => {
    Cookies.set("level", this.state.level)
  }

  saveTrials = () => {
    Cookies.set("trials", this.state.trials)
  }

  saveNBack = () => {
    Cookies.set("nBack", this.state.nBack)
  }

  /**
   * Save session scores and current date to a cookie
   */
  saveHistory = () => {
    Cookies.set(
      "sessionHistory",
      {
        scores: this.calculateSessionStats(),
        date: new Date(),
      },
      { expires: 365 }
    )
  }

  incrementNBack = () => {
    this.setState((prevState) => ({
      nBack: prevState.nBack + 1,
    }))
  }

  decrementNBack = () => {
    if (this.state.nBack > 1) {
      this.setState((prevState) => ({
        nBack: prevState.nBack - 1,
      }))
    }
  }

  updateNBack = (e, data) => {
    this.setState({
      nBack: data.value,
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
   * Reset game back to initial state
   * To be run when user completes game session
   */
  resetGame = () => {
    this.setState(
      {
        level: 0,
        trails: 0,
        nBack: 2,
      },
      () => {
        this.saveLevel()
        this.saveTrials()
        this.saveNBack()
      }
    )
  }

  /**
   * Set game state to active, start the game trial
   * @param {Object} e - SyntheticEvent
   */
  start = (e) => {
    if (!this.state.active) {
      if (e.key === " " || e.key === 32) {
        this.setState(
          {
            active: true,
            iteration: -1,
            currentVisualScore: 0,
            currentAudioScore: 0,
            currentMissedVisualMatches: 0,
            currentMissedAudioMatches: 0,
            currentWrongAudioMatches: 0,
            currentWrongVisualMatches: 0,
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
  }

  /**
   * Set active state to false to prevent next game trail iteration
   * @param {Object} e - SyntheticEvent
   */
  stop = (e) => {
    if (this.state.active) {
      if (e.key === "Escape" || e.key === 27) {
        this.setState({
          active: false,
        })
      }
    }
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
      if (this.state.iteration === 24 || !this.state.active) {
        clearInterval(id)
        this.completeGameTrial()
      }
    }, 3000)
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
        [key]: true,
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
          [key]: false,
        },
        () => {
          this.incrementProgressBar()
        }
      )
    }, 1200)
  }

  /**
   * Save current trial scores to state
   * @param {Number} nBack
   * @param {Number} visualScore
   * @param {Number} audioScore
   */
  addSessionScore = (nBack, visualScore, audioScore) => {
    this.setState((prevState) => ({
      sessionScores: [
        ...prevState.sessionScores,
        { nBack, visualScore, audioScore },
      ],
    }))
  }

  /**
   * Calculate visual and audio scores from most recent game trial and set to state
   * Increment or decrement nBack based on calculated scores
   * Each wrongly asserted match results in a 5% reduction in score
   */
  calculateCurrentScores = () => {
    const nBack = this.state.nBack
    const spaceCollection = new GameObjectCollection(
      this.state.currentGameSpaces
    )
    const soundCollection = new GameObjectCollection(
      this.state.currentGameSounds
    )

    const possibleVisualMatches = spaceCollection.possibleMatches(nBack)
    const possibleAudioMatches = soundCollection.possibleMatches(nBack)

    const wrongVisualMatches = spaceCollection.falseMatches(nBack)
    const wrongAudioMatches = soundCollection.falseMatches(nBack)

    const visualScore =
      Math.floor(
        (spaceCollection.matches(nBack) / possibleVisualMatches) * 100
      ) -
        wrongVisualMatches * 5 || 0
    const audioScore =
      Math.floor(
        (soundCollection.matches(nBack) / possibleAudioMatches) * 100
      ) -
        wrongAudioMatches * 5 || 0

    const missedVisualMatches = spaceCollection.missedMatches(nBack)
    const missedAudioMatches = soundCollection.missedMatches(nBack)

    this.addSessionScore(nBack, visualScore, audioScore)

    this.setState({
      currentVisualScore: visualScore > 0 ? `${visualScore}%` : 0,
      currentAudioScore: audioScore > 0 ? `${audioScore}%` : 0,
      currentMissedVisualMatches: missedVisualMatches,
      currentMissedAudioMatches: missedAudioMatches,
      currentWrongVisualMatches: wrongVisualMatches,
      currentWrongAudioMatches: wrongAudioMatches,
    })

    if (this.state.options.autoUpdateNBack) {
      if (visualScore >= 70 && audioScore >= 70) {
        this.incrementNBack()
      }

      if (visualScore < 40 && audioScore < 40 && this.state.nBack > 2) {
        this.decrementNBack()
      }
    }
  }

  /**
   * On completion of game trial create instances of GameSpaceCollection and GameSoundCollection
   * For calculation of scores
   */
  completeGameTrial() {
    setTimeout(() => {
      this.setState(
        {
          active: false,
        },
        () => {
          console.log("Trial complete")
          this.calculateCurrentScores()
          this.saveLevel()
          this.saveTrials()
          this.saveNBack()
          if (this.state.level === 20) {
            this.openSessionStats()
            this.resetGame()
            if (this.state.options.saveHistory) {
              this.saveHistory()
            }
          }
        }
      )
    }, 3000)
  }

  assertVisualMatch = () => {
    if (this.state.active) {
      const currentGameSpaces = this.state.currentGameSpaces
      currentGameSpaces[currentGameSpaces.length - 1].matchAsserted = true
      this.setState({
        currentGameSpaces: currentGameSpaces,
      })
    }
  }

  assertAudioMatch = () => {
    if (this.state.active) {
      const currentGameSounds = this.state.currentGameSounds
      currentGameSounds[currentGameSounds.length - 1].matchAsserted = true
      this.setState({
        currentGameSounds: currentGameSounds,
      })
    }
  }

  openSessionStats = () => {
    this.setState({
      showSessionStats: true,
    })
  }

  closeSessionStats = () => {
    this.setState({
      showSessionStats: false,
    })
  }

  /**
   * Calculate average audio score for all session trials
   * Calculate average visual score for all session trials
   * Calculate max Nback level for all session trials
   * @returns {Object} session states
   */
  calculateSessionStats = () => {
    const audioScores = this.state.sessionScores.map((obj) => obj.audioScore)
    const visualScores = this.state.sessionScores.map((obj) => obj.visualScore)
    const nBackLevels = this.state.sessionScores.map((obj) => obj.nBack)

    const audioAverage =
      audioScores.reduce((acc, curr) => acc + curr, 0) / audioScores.length || 0
    const visualAverage =
      visualScores.reduce((acc, curr) => acc + curr, 0) / visualScores.length ||
      0
    const averageNBack =
      nBackLevels.reduce((acc, curr) => acc + curr, 0) / nBackLevels.length || 2

    return {
      averageNBack,
      visualAverage,
      audioAverage,
    }
  }

  render() {
    return (
      <Container>
        <SessionStatsModal
          closeSessionStats={this.closeSessionStats}
          open={this.state.showSessionStats}
          calculateSessionStats={this.calculateSessionStats}
        />
        <Header
          style={{
            marginLeft: "18px",
            marginTop: "30px",
            display: "inline-block",
          }}
          as="h1"
        >
          Dual N-Back
        </Header>
        <Grid relaxed centered style={{ minWidth: "800px" }}>
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
              Wrong Visual:{" "}
              <span style={{ fontWeight: "bold" }}>
                {this.state.currentWrongVisualMatches}
              </span>
            </p>
            <p>
              Missed Visual:{" "}
              <span style={{ fontWeight: "bold" }}>
                {this.state.currentMissedVisualMatches}
              </span>
            </p>
            <p>
              Wrong Audio:{" "}
              <span style={{ fontWeight: "bold" }}>
                {this.state.currentWrongAudioMatches}
              </span>
            </p>
            <p>
              Missed Audio:{" "}
              <span style={{ fontWeight: "bold" }}>
                {this.state.currentMissedAudioMatches}
              </span>
            </p>
            <Divider />
            <ControlsModal />
            <p>
              <a
                style={{ textDecoration: "underline" }}
                target="_blank"
                rel="noreferrer"
                href="https://en.wikipedia.org/wiki/N-back"
              >
                What Is Dual N-Back
              </a>
              <Icon name="question circle" />
            </p>
          </Grid.Column>
          <Grid.Column width={8}>
            <Grid columns="3" celled style={{ borderRadius: "3px" }}>
              <Grid.Row style={{ height: "160px" }}>
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
              <Grid.Row style={{ height: "160px" }}>
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
              <Grid.Row style={{ height: "160px" }}>
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
                  onClick={(e) => {
                    this.assertAudioMatch()
                    e.target.blur()
                  }}
                  fluid
                  size="big"
                >
                  Audio Match
                </Button>
              </Grid.Column>
              <Grid.Column>
                <Button
                  textAlign="center"
                  onClick={(e) => {
                    this.assertAudioMatch()
                    this.assertVisualMatch()
                    e.target.blur()
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
                  onClick={(e) => {
                    this.assertVisualMatch()
                    e.target.blur()
                  }}
                  fluid
                  size="big"
                >
                  Visual Match
                </Button>
              </Grid.Column>
            </Grid>
            <Progress
              size="large"
              color="green"
              percent={this.state.trialProgress}
              style={{ marginTop: "25px" }}
              content={`${this.state.trialProgress}%`}
            />
          </Grid.Column>
          <Grid.Column
            width={4}
            mobile={4}
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
              value={this.state.nBack}
              onChange={this.updateNBack}
            />
            <Divider />
            <p>Options</p>
            <Checkbox
              key={this.state.options}
              label="Auto-update n-back"
              toggle
              checked={this.state.options.autoUpdateNBack}
              onChange={(e) => {
                const { options } = this.state
                options.autoUpdateNBack = !options.autoUpdateNBack
                this.setState(
                  {
                    options: options,
                  },
                  this.saveOptions
                )
              }}
            />
            <Checkbox
              label="Save history"
              toggle
              style={{ marginTop: "15px" }}
              checked={this.state.options.saveHistory}
              onChange={(e) => {
                const { options } = this.state
                options.saveHistory = !options.saveHistory
                this.setState(
                  {
                    options: options,
                  },
                  this.saveOptions
                )
              }}
            />
          </Grid.Column>
        </Grid>
      </Container>
    )
  }
}

export default App
