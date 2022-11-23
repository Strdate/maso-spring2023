import Header from "./Header"
import Grid from "@suid/material/Grid"
import TextField from "@suid/material/TextField"

export default function Homepage() {
    return (
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <Header/>
          </Grid>
          <Grid item container xs={12} justifyContent="center" spacing={2}>
            <Grid item xs={3} md={2}>
              <TextField
                fullWidth
                id="gameCode"
                label="Kód hry"
                onKeyPress={(ev) => {
                  if (ev.key === 'Enter') {
                    //this.onGameSelect(ev.target.value)
                    ev.preventDefault()
                  } else {
                    //this.setState({ showNewGamePopup: false })
                  }
                }}
                margin="normal"
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Grid>
      )
}