import Header from "./Header"
import Grid from "@suid/material/Grid"
import TextField from "@suid/material/TextField"
import Title from "../../utils/title"
import { useNavigate } from "@solidjs/router"

export default function Homepage() {
  const navigate = useNavigate()
    return (
        <Grid container justifyContent="center">
          <Title name="Maso 2023" />
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
                    ev.preventDefault()
                    const code = (ev.target as HTMLTextAreaElement).value
                    if(code) {
                      navigate(`/${code}`)
                    }
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