import { Show } from 'solid-js';
import { createFindOne } from 'solid-meteor-data';
import FromBase from "../components/formBase"
import readFormData from "../utils/readFormData"

export default function LoginForm() {
  const [loggedIn] = createFindOne(() => Meteor.user())
  return (
      <FromBase title="Přihlášení" onSubmit={(e) => {
          e.preventDefault()
          const res = readFormData(e.target)
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
          <input type="button" id="logoutButton" name="logoutButton" value="Odhlásit" onClick={() => Meteor.logout()} />
        </Show>
      </FromBase>

    )
}