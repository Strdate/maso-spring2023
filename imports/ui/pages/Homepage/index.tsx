import Header from "./Header"
import Grid from "@suid/material/Grid"
import TextField from "@suid/material/TextField"
import { useNavigate } from "@solidjs/router"
import useTitle from "../../utils/useTitle"

export default function Homepage() {
  useTitle("MaSo 2023")
  const navigate = useNavigate()
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