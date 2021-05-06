import React, { Component } from "react"
import { Button, Modal, Header } from "semantic-ui-react"

export default function SessionStatsModalextends({ open, closeSessionStats }) {
  return (
    <Modal
      closeIcon
      onClose={() => closeSessionStats()}
      open={open}
      size="small"
    >
      <Modal.Content>
        <p>Content coming soon</p>
      </Modal.Content>
    </Modal>
  )
}
