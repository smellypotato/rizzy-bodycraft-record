import { Route, Routes } from "react-router-dom";
import { Categories } from "./pages/Admin/Categories/Categories";
import { Login } from "./pages/Login/Login";
import { Dashboard } from "./pages/User/Dashboard/Dashboard";

const App = () => {
    return (
        <div className="App">
            <Routes>
                <Route path="*" element={ <Categories /> } />
                <Route path="*" element={ <Dashboard /> } />
                <Route path="*" element={ <Login /> } />
            </Routes>
        </div>
    );
}

export default App;
