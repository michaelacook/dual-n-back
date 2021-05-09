import React from "react"
import { Header, Modal, Icon } from "semantic-ui-react"

export default function ControlsModal() {
  const [open, setOpen] = React.useState(false)

  return (
    <Modal
      closeIcon
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      centered={false}
      size="large"
      trigger={
        <span>
          <p
            style={{
              textDecoration: "underline",
              cursor: "pointer",
              display: "inline-block",
            }}
          >
            How to play
          </p>
          <Icon name="question circle" />
        </span>
      }
    >
      <Modal.Header>
        <Header style={{ display: "inline-block" }} as="h1">
          How To Play
        </Header>
      </Modal.Header>
      <Modal.Content style={{ padding: "25px" }}>
        <Header as="h2">Controls</Header>
        <ul>
          <li>Press Spacebar to start the game</li>
          <li>Press ESC to stop before trial is complete</li>
        </ul>

        <Header style={{ marginTop: "20px" }} as="h2">
          How To Play
        </Header>
        <ul>
          <li>
            <p style={{ lineHeight: "1.5" }}>
              The game requires the player to watch a series of flashing spaces
              on a grid, while simultaneously listening to a series of sounds.
              The player must match the last shown grid space and the last
              played sound with the grid space and sound N iterations back in
              the sequence. For instance, if the last sound played was "B" and
              the current N-back level is 2, then you must try to remember if
              the sound played two backward in the sequence was also "B" and if
              so, assert a match.
            </p>
          </li>
          <li>
            <p style={{ lineHeight: "1.5" }}>
              Each game trial consists of twenty-five random sounds and random
              grid space flashes and lasts approximately 75 seconds. A full game
              session consists of twenty game trials and takes approximately 25
              minutes to complete. At the end of each session, the player's
              average visual and audio scores as well as average n-back level
              are calculated. For best results, complete one full game session
              each day.
            </p>
          </li>
          <li>
            <p style={{ lineHeight: "1.5" }}>
              For more information about working memory and a useful tutorial,
              view{" "}
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.youtube.com/watch?v=uOncXapT-j4&ab_channel=MarkAshtonSmith%2CPh.D."
              >
                this YouTube video.
              </a>
            </p>
          </li>
        </ul>
      </Modal.Content>
    </Modal>
  )
}
