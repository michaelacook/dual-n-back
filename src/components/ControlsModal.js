import React from "react"
import { Button, Header, Modal, Icon } from "semantic-ui-react"

export default function ControlsModal() {
  const [open, setOpen] = React.useState(false)

  return (
    <Modal
      // basic
      closeIcon
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="small"
      trigger={
        <p style={{ textDecoration: "underline", cursor: "pointer" }}>
          How to play
        </p>
      }
    >
      <Modal.Header>How To Play</Modal.Header>
      <Modal.Content>
        <Header as="h2">Controls</Header>
        <p>Press Spacebar to start the game</p>
        <p>Press ESC to stop</p>

        <Header style={{ marginTop: "40px" }} as="h2">
          How To Play
        </Header>
        <p style={{ lineHeight: "1.4" }}>
          The game requires the player to watch a series of flashing spaces on a
          grid, while simultaneously listening to a series of sounds. The player
          must match the last shown grid space and the last played sound with
          the grid space and sound N iterations back in the sequence. For
          instance, if the last sound played was "B" and the current N-back
          level is 2, then you must try to remember if the sound played two
          backward in the sequence was also "B" and if so, assert a match. The
          game tests and builds working memory.
        </p>
        <p>
          For more information about working memory and a useful tutorial, view{" "}
          <a href="https://www.youtube.com/watch?v=uOncXapT-j4&ab_channel=MarkAshtonSmith%2CPh.D.">
            this YouTube video.
          </a>
        </p>
      </Modal.Content>
    </Modal>
  )
}
