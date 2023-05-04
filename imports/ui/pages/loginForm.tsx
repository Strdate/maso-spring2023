import { Show } from 'solid-js';
import { createFindOne } from 'solid-meteor-data';
import FromBase from "../components/formBase"
import useTitle from '../utils/useTitle';
import { useNavigate } from '@solidjs/router';

export default function LoginForm() {
  useTitle("Přihlášení | Maso 2023")
  const [loggedIn, user] = createFindOne(() => Meteor.user())
  const navigate = useNavigate()
  return (
      <FromBase title="Přihlášení" showBackButton onConfirm={(res) => {
          Meteor.loginWithPassword(res.userName, res.accountPassword, (error) => {
            if(error) {
              // @ts-ignore
              if(error.error === 'user.logIn.incorrectServerRedir') {
                if(confirm("Přihlašovací údaje jsou správné, ale nacházíš se na chybném serveru. Přesměrovat?")) {
                  // @ts-ignore
                  window.location.href = error.reason!
                }
              } else {
                alert(error.message)
              }
            } else {
              Meteor.call('server.config', {}, (err: any, res: string | undefined) => {
                if(res) {
                  navigate(`/${res}`)
                }
              })
            }
          })
      }}>
        <Show when={!loggedIn()}>
          <label for="userName">Uživatelské jméno</label>
          <input type="text" id="userName" name="userName" />
          <label for="accountPassword">Heslo</label>
          <input type="password" id="accountPassword" name="accountPassword" />
          <input type="submit" value="Přihlásit" />
        </Show>
        <Show when={loggedIn()}>
          <div style={{'text-align': 'center'}}>{(user as Meteor.User).username}</div>
          <input type="button" id="logoutButton" name="logoutButton" value="Odhlásit" onClick={() => Meteor.logout()} />
        </Show>
      </FromBase>

    )
}