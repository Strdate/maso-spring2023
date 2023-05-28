import { Routes, Route } from "@solidjs/router"
import Homepage from "./pages/Homepage";
import CreateGame from "./pages/createGame";
import LoginForm from "./pages/loginForm";
import GameOverview from "./pages/gameOverview";
import Projector from "./pages/projector";
import GameControls from "./pages/gameControls";
import ScannerQR from "./pages/ScannerQR";
import ResultsPage from "./pages/results";
import { CurTimeProvider } from "./utils/curTimeProvider";

export const App = () => {
  return (
    <CurTimeProvider>
      <Routes>
        <Route path="/create" component={() => CreateGame({ editing: false })} />
        <Route path="/login" component={LoginForm} />
        <Route path="/:code" component={GameOverview} />
        <Route path="/:code/upravit" component={() => CreateGame({ editing: true })} />
        <Route path="/:code/projektor" component={Projector} />
        <Route path="/:code/input" component={GameControls} />
        <Route path="/:code/scanner" component={ScannerQR} />
        <Route path="/:code/vysledky" component={ResultsPage} />
        <Route path="*" component={Homepage} />
      </Routes>
    </CurTimeProvider>
  )
};