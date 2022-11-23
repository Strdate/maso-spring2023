import { Routes, Route } from "@solidjs/router"
import Homepage from "./pages/Homepage";

export const App = () => (
  <Routes>
    <Route path="/" component={Homepage} />
  </Routes>
);


