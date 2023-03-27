import {Button, Grid, TextField} from "@suid/material";
import FromBase from "/imports/ui/components/formBase";


export default function ManualForm(props: { onTaskSubmit: (data: { teamNumber: number, taskNumber: number }) => void }) {
  return (
    <div style={{margin: '80px 10px 10px 10px', padding: '10px', border: '1px solid #000000'}}>
      <FromBase title="" onConfirm={(res) => {
        console.log(res);
        const mapped = {
          teamNumber: parseInt(res.teamId),
          taskNumber: parseInt(res.taskId),
        };
        props.onTaskSubmit(mapped);
      }}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <TextField
              type="number"
              placeholder="Tým"
              fullWidth
              name="teamId"
              id="team"
              variant="outlined"
              required
              autoFocus
            />
          </Grid>
          <Grid item>
            <TextField
              type="number"
              placeholder="Příklad"
              fullWidth
              name="taskId"
              id="task"
              variant="outlined"
              required
            />
          </Grid>
          <Grid item>
            {/* @ts-ignore - These suid elements does not have normal html attributes in its types. :/ */}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="button-block"
              style={{backgroundColor: '#ffd42d', color: '#000000', width: "100%", height: "2wh"}}
            >
              Potvrdit
            </Button>
          </Grid>
        </Grid>
      </FromBase>
    </div>
  )
}
