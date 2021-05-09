import React from "react"
import { Button, Grid } from "semantic-ui-react"

export default function Controls({ assertAudioMatch, assertVisualMatch }) {
  return (
    <Grid columns={3} centered>
      <Grid.Column>
        <Button
          textAlign="center"
          onClick={(e) => {
            assertAudioMatch()
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
            assertAudioMatch()
            assertVisualMatch()
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
            assertVisualMatch()
            e.target.blur()
          }}
          fluid
          size="big"
        >
          Visual Match
        </Button>
      </Grid.Column>
    </Grid>
  )
}
