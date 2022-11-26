import { Routes, Route } from "@solidjs/router"
import Homepage from "./pages/Homepage";
import CreateGame from "./pages/createGame";
import LoginForm from "./pages/loginForm";

export const App = () => {
  return (
    <Routes>
      <Route path="/" component={Homepage} />
      <Route path="/create" component={CreateGame} />
      <Route path="/login" component={LoginForm} />
    </Routes>
  )
};