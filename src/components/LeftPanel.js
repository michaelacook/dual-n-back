import React from "react"
import { Divider, Icon } from "semantic-ui-react"
import ControlsModal from "./ControlsModal"

export default function LeftPanel({
  currentVisualScore,
  currentAudioScore,
  currentWrongVisualMatches,
  currentWrongAudioMatches,
  currentMissedAudioMatches,
  currentMissedVisualMatches,
}) {
  return (
    <React.Fragment>
      <p>
        Visual Score:{" "}
        <span style={{ fontWeight: "bold" }}>{currentVisualScore}</span>
      </p>
      <p>
        Audio Score:{" "}
        <span style={{ fontWeight: "bold" }}>{currentAudioScore}</span>
      </p>
      <p>
        Wrong Visual:{" "}
        <span style={{ fontWeight: "bold" }}>{currentWrongVisualMatches}</span>
      </p>
      <p>
        Missed Visual:{" "}
        <span style={{ fontWeight: "bold" }}>{currentMissedVisualMatches}</span>
      </p>
      <p>
        Wrong Audio:{" "}
        <span style={{ fontWeight: "bold" }}>{currentWrongAudioMatches}</span>
      </p>
      <p>
        Missed Audio:{" "}
        <span style={{ fontWeight: "bold" }}>{currentMissedAudioMatches}</span>
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
      </p>{" "}
    </React.Fragment>
  )
}
