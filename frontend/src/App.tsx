import './App.css'
import Lobby from "./Lobby.tsx";
import {Route, BrowserRouter as Router, Routes, Navigate} from "react-router-dom";
import Game from "./Game/Game.tsx";
import {QueryClient, QueryClientProvider} from "react-query";

function App() {
    const queryClient = new QueryClient()
  return (
    <div>
        <QueryClientProvider client={queryClient}>
        <Router>
            <Routes>
                <Route
                    path={"/"}
                        element={<Lobby/>}
                />
                <Route
                    path={"/play"}
                    element={<Game/>}
                />
                <Route
                    path={"*"}
                    element={<Navigate to={"/"}/> }
                />
            </Routes>
        </Router>
        </QueryClientProvider>
    </div>
  )
}

export default App
