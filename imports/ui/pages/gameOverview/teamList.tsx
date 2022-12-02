import { Button, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@suid/material"
import { For, Show } from "solid-js"
import { Game } from "/imports/api/collections/games"
import { Results } from "/imports/api/collections/results"
import { GameStatus } from "/imports/core/enums"

interface Props {
    game: Game,
    results: Results
}

function TeamList(props: Props) {
  const teams = () => props.results.teams
  const hasTeams = () => Boolean(teams() && teams().length > 0)
  const addingTeamsAllowed = () => props.game.statusId === GameStatus.Created
  const sortedTeams = () => teams().sort((t1, t2) => t1.number - t2.number)
  return (
    <Grid item xs={11} sm={6}>     
    <Paper style={{ padding: '15px' }}>
      <Typography variant="h5" align="center" gutterBottom>
        Týmy
      </Typography>
      <Show when={!hasTeams()}>
        <Typography variant="body1" gutterBottom>
          Hra zatím nemá žádné týmy.
        </Typography>
      </Show>
      <Show when={hasTeams()}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{width: "50px"}}>
                Číslo
              </TableCell>
              <TableCell>
                Název
              </TableCell>
              <TableCell style={{width: "50px"}}>
                Typ
              </TableCell>
              <Show when={addingTeamsAllowed()}>
                <TableCell style={{width: "50px"}}>
                    Odebrat
                </TableCell>
              </Show>
            </TableRow>
          </TableHead>
          <TableBody>
            <For each={teams()}>{(team) => 
                <TableRow>
                    <TableCell component="th" scope="row">
                    {team.number}
                    </TableCell>
                    <TableCell>
                    {team.name}
                    </TableCell>
                    <TableCell>
                    {team.isBot ? /*<AndroidIcon />*/ 'n' : /*<GroupIcon />*/ 'y'}
                    </TableCell>
                    <Show when={addingTeamsAllowed()}>
                        <TableCell>
                            <Button
                            onClick={() => deleteTeam(team._id)}
                            color="secondary"
                            >
                            X
                            </Button>
                        </TableCell>
                    </Show>
                </TableRow>
            }         
            </For>
          </TableBody>
        </Table>
      </Show>
      <br />
      <Show when={addingTeamsAllowed()}>
        <Typography variant="h6" align="center">
            Přidat nový tým
        </Typography>
        
      </Show>
      {/*addingTeamsAllowed &&
        <Fragment>
          <Typography variant="h6" align="center">
            Přidat nový tým
          </Typography>
          <AutoForm
            schema={NewTeamSchema}
            onSubmit={(data) => CreateTeam.call({ ...data, gameId: game._id }, alertError)} />
                </Fragment>*/}
    </Paper>
    </Grid>
  )
}

function deleteTeam(teamId) {
  if( confirm('Opravdu si přejete odebrat tým?') )
  {
    Meteor.call('teams.delete',{teamId}/*, function(error,result){}*/) 
  }
}

export default TeamList
