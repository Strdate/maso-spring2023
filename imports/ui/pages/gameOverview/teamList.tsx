import { Button, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@suid/material"
import { createEffect, For, Show } from "solid-js"
import { Game } from "/imports/api/collections/games"
import { GameStatus } from "/imports/core/enums"
import FromBase from "/imports/ui/components/formBase";
import CreateTeamMethod from '../../../api/methods/teams/create'
import {TeamInput, TeamsCollection} from "/imports/api/collections/teams";
import { createFind, createSubscribe } from "solid-meteor-data";

interface Props {
    game: Game
}

function TeamList(props: Props) {
  const loadingTeams = createSubscribe('teams', () => props.game.code)
  const teams = createFind(() => loadingTeams() ? null : TeamsCollection.find({gameId: props.game._id}))
  const hasTeams = () => Boolean(teams() && teams().length > 0)
  const addingTeamsAllowed = () => props.game.statusId === GameStatus.Created
  const sortedTeams = () => teams().sort((t1, t2) => parseInt(t1.number) - parseInt(t2.number))
  const highestTeamIdPlus1 = () => teams().reduce((prevVal: number | undefined, curTeam) => {
    if (prevVal === undefined) return undefined;  // If there is some non numeric value, ignore.
    try {
      const curVal = Number(curTeam.number);
      if (isNaN(curVal)) return undefined;
      return (curVal >= prevVal ? curVal : prevVal) + 1;
    } catch (e) {
      return undefined;
    }
  }, 1);
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
            <For each={sortedTeams()}>{(team) =>
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
        {/*<Typography variant="h6" align="center">*/}
        {/*    Přidat nový tým*/}
        {/*</Typography>*/}
        <FromBase title="Přidat nový tým" onConfirm={(res) => {
          const mapped: TeamInput = {
            name: res.teamName,
            number: res.teamNumber,
            gameId: props.game._id,
            isBot: !!res.isBot,
          };
          console.log(mapped);
          CreateTeamMethod.call(mapped, err => {
            if (err) alert(err)
            if (!err) { }
          });
        }}>
          <input type="number" id="teamNumber" name="teamNumber" value={highestTeamIdPlus1()} placeholder={"Číslo týmu *"} />
          <input type="text" id="teamName" name="teamName" placeholder={"Jméno týmu *"} />
          <span>
            <input type="checkbox" id="isBot" name="isBot" style={{"min-width": "min-content"}} />
            <label for="isBot">Je to bot?</label>
          </span>
          <input type="submit" value="Vytvořit" />
        </FromBase>
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

function deleteTeam(teamId: string) {
  if( confirm('Opravdu si přejete odebrat tým?') )
  {
    Meteor.call('teams.delete',{teamId}/*, function(error,result){}*/) 
  }
}

export default TeamList
