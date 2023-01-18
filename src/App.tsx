import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login/Login";

const App = () => {
    return (
        <div className="App">
            <Routes>
                <Route path="*" element={ <Login /> } />
            </Routes>
        </div>
    );
}

export default App;
