import { Show } from 'solid-js';
import { createFindOne } from 'solid-meteor-data';
import FromBase from "../components/formBase"
import useTitle from '../utils/useTitle';

export default function LoginForm() {
  useTitle("Přihlášení | Maso 2023")
  const [loggedIn, user] = createFindOne(() => Meteor.user())
  return (
      <FromBase title="Přihlášení" onConfirm={(res) => {
          Meteor.loginWithPassword(res.userName, res.accountPassword, (error) => {
            if(error) {
              alert(error.message)
            } else {
              //window.location.href='/podzim2022'
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