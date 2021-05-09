import React from "react"
import { Header, Modal, Icon } from "semantic-ui-react"

export default function SessionStatsModal({
  open,
  closeSessionStats,
  calculateSessionStats,
}) {
  const stats = calculateSessionStats()

  return (
    <Modal
      closeIcon
      onClose={() => closeSessionStats()}
      open={open}
      size="small"
      centered={false}
    >
      <Modal.Header>
        <Icon name="check circle" color="green" size="big" />
        <Header style={{ display: "inline-block" }} as="h2">
          Session Complete!
        </Header>
      </Modal.Header>
      <Modal.Content>
        <p>
          Great work! You have completed 20 sessions. Give your brain and rest
          and come back tomorrow for your next memory workout.
        </p>

        <Header as="h3">Session Breakdown:</Header>
        <ul>
          <li>
            {" "}
            <p>
              <span style={{ fontWeight: "Bold" }}>Average N-Back level</span>:{" "}
              {stats.averageNBack}
            </p>
          </li>
          <li>
            {" "}
            <p>
              <span style={{ fontWeight: "Bold" }}>Average visual score</span>:{" "}
              {stats.visualAverage}
            </p>
          </li>
          <li>
            <p>
              <span style={{ fontWeight: "Bold" }}>Average audio score</span>:{" "}
              {stats.audioAverage}
            </p>
          </li>
        </ul>
      </Modal.Content>
    </Modal>
  )
}
