import React from "react"
import { Grid } from "semantic-ui-react"

export default function GameGrid({ state }) {
  return (
    <Grid columns="3" celled style={{ borderRadius: "3px" }}>
      <Grid.Row style={{ height: "160px" }}>
        <Grid.Column>
          <div
            style={{ height: "100%" }}
            className={state[0] ? "visible-space" : null}
            key={0}
          ></div>
        </Grid.Column>
        <Grid.Column>
          <div
            style={{ height: "100%" }}
            className={state[1] ? "visible-space" : null}
            key={1}
          ></div>
        </Grid.Column>
        <Grid.Column>
          <div
            style={{ height: "100%" }}
            className={state[2] ? "visible-space" : null}
            key={2}
          ></div>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row style={{ height: "160px" }}>
        <Grid.Column>
          <div
            style={{ height: "100%" }}
            className={state[3] ? "visible-space" : null}
            key={3}
          ></div>
        </Grid.Column>
        <Grid.Column>
          <div
            style={{ height: "100%" }}
            className={state[4] ? "visible-space" : null}
            key={4}
          ></div>
        </Grid.Column>
        <Grid.Column>
          <div
            style={{ height: "100%" }}
            className={state[5] ? "visible-space" : null}
            key={5}
          ></div>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row style={{ height: "160px" }}>
        <Grid.Column>
          <div
            style={{ height: "100%" }}
            className={state[6] ? "visible-space" : null}
            key={6}
          ></div>
        </Grid.Column>
        <Grid.Column>
          <div
            style={{ height: "100%" }}
            className={state[7] ? "visible-space" : null}
            key={7}
          ></div>
        </Grid.Column>
        <Grid.Column>
          <div
            style={{ height: "100%" }}
            className={state[8] ? "visible-space" : null}
            key={8}
          ></div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}
