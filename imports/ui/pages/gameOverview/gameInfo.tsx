import { Avatar, Button, List, ListItem, ListItemAvatar, ListItemText, Paper } from '@suid/material'
import { Game } from '/imports/api/collections/games'
import StopIcon from '@suid/icons-material/Stop'
import AccessTimeIcon from '@suid/icons-material/AccessTime'
import StatusIcon from '@suid/icons-material/Flag'
import { GameStatus, GameStatusLabels } from '/imports/core/enums'
import { Show } from 'solid-js'
import { A } from '@solidjs/router'

function getRunTime(game: Game) {
  return `${game.startAt.toLocaleTimeString('cs-CZ')} - ${game.endAt.toLocaleTimeString('cs-CZ')} ${game.startAt.toDateString()}`
}

function getGameState(game: Game) {
  return GameStatusLabels[game.statusId]
}

interface Props {
    game: Game,
    isOwner: boolean
}

function GameInfo(props: Props) {
  const showFinishButton = () => props.game.statusId === GameStatus.OutOfTime && props.isOwner
  return (
    <Paper style={{ "margin-bottom": '8px' }}>
      <List>
      <Show when={showFinishButton()}>
        <ListItem>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => Meteor.call('games.finish',{ gameId: props.game._id }, alertError)}
              startIcon={<StopIcon />}
            >
              Ukončit hru
            </Button>
          </ListItem>
        </Show>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <StatusIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Stav hry" secondary={getGameState(props.game)} />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
              <AccessTimeIcon />
          </ListItemAvatar>
          <ListItemText primary="Čas konání" secondary={(
            <>
              {getRunTime(props.game)}
              <Show when={props.game.statusId === GameStatus.Created && props.isOwner}>
                &nbsp;<A href='upravit'>Upravit</A>
              </Show>
            </>
          )} />
        </ListItem>
      </List>
    </Paper>
  )
}

function alertError(err: any) {
  if (err) {
    alert(err.message)
  }
}

export default GameInfo
