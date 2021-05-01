import React from "react"
import { Container, Grid } from "semantic-ui-react"

function App() {
  return (
    <Container>
      <Grid
        style={{ width: "800px", margin: "0 auto", marginTop: "100px" }}
        columns="equal"
        celled
      >
        <Grid.Row style={{ height: "220px" }}>
          <Grid.Column>
            <div key={1}></div>
          </Grid.Column>
          <Grid.Column>
            <div key={2}></div>
          </Grid.Column>
          <Grid.Column>
            <div key={3}></div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row style={{ height: "220px" }}>
          <Grid.Column>
            <div
              key={4}
              style={{
                backgroundColor: "skyblue",
                height: "100%",
                borderRadius: "4px",
              }}
            ></div>
          </Grid.Column>
          <Grid.Column>
            <div key={5}></div>
          </Grid.Column>
          <Grid.Column>
            <div key={6}></div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row style={{ height: "220px" }}>
          <Grid.Column>
            <div key={7}></div>
          </Grid.Column>
          <Grid.Column>
            <div key={8}></div>
          </Grid.Column>
          <Grid.Column>
            <div key={9}></div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  )
}

export default App
