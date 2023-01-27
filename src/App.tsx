import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Menu } from "./components/Menu/Menu";
import Firebase from "./firebase";
import { Categories } from "./pages/Admin/Categories/Categories";
import { StudentList } from "./pages/Admin/StudentList/StudentList";
import { Login } from "./pages/Login/Login";
import { Dashboard } from "./pages/User/Dashboard/Dashboard";

// const path = "dashboard";
const path = "student-list";

const App = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fromEmailLink = Firebase.instance.isAnnoymousAccount();
        const unSubscribeAuthStateChange = Firebase.instance.onAuthStateChanged((user) => {
            console.log("auth state changed", user);
            if (user) {
                if (fromEmailLink) {}
                else navigate(`/${path}`);
            }
            else navigate("/login")
        })
        return () => {
            unSubscribeAuthStateChange();
        }
    }, []);

    return (
        <div className="App">
            <Menu />
            <Routes>
                <Route path="/student-list" element={ <StudentList /> } />
                <Route path="/categories" element={ <Categories /> } />
                <Route path="/dashboard" element={ <Dashboard /> } />
                <Route path="/login" element={ <Login /> } />
                <Route path="*" element={ <Login /> } />
            </Routes>
        </div>
    );
}

export default App;
