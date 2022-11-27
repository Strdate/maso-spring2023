import { Routes, Route } from "@solidjs/router"
import Homepage from "./pages/Homepage";
import CreateGame from "./pages/createGame";
import LoginForm from "./pages/loginForm";
import GameOverview from "./pages/gameOverview";

export const App = () => {
  return (
    <Routes>
      <Route path="/create" component={CreateGame} />
      <Route path="/login" component={LoginForm} />
      <Route path="/:code" component={GameOverview} />
      <Route path="*" component={Homepage} />
    </Routes>
  )
};