import { Avatar, Button, List, ListItem, ListItemAvatar, ListItemText, Paper } from '@suid/material'
import { Game } from '/imports/api/collections/games'
import { isGameOwner } from '/imports/core/authorization'
import StopIcon from '@suid/icons-material/Stop'
import AccessTimeIcon from '@suid/icons-material/AccessTime'
import StatusIcon from '@suid/icons-material/Flag'
import { GameStatusLabels } from '/imports/core/enums'

function getRunTime(game: Game) {
  return `${game.startAt.toLocaleTimeString()} - ${game.endAt.toLocaleTimeString()} ${game.startAt.toDateString()}`
}

function getGameState(game: Game) {
  return GameStatusLabels[game.statusId]
}

interface Props {
    game: Game,
    user: Meteor.User | {}
}

function GameInfo(props: Props) {
  /*const isOwner = props.user && isGameOwner(props.user._id, props.game)
  const showFinishButton = game.statusId === enums.GAME_STATUS.OUT_OF_TIME.id*/
  return (
    <Paper style={{ "margin-bottom": '8px' }}>
      <List>
        {/*isOwner &&
        <ListItem>
          {showFinishButton &&
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => FinishGame.call({ gameId: game._id }, alertError)}
              startIcon={<StopIcon />}
            >
              Vyhodnotit poslední hod a ukončit hru
            </Button>}
          </ListItem>*/}
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
          <ListItemText primary="Čas konání" secondary={getRunTime(props.game)} />
        </ListItem>
      </List>
    </Paper>
  )
}

export default GameInfo
