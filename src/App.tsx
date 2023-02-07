import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Menu } from "./components/Menu/Menu";
import Firebase from "./firebase";
import { SetLoggedInContext } from "./hooks/contexts";
import { Categories } from "./pages/Admin/Categories/Categories";
import { StudentList } from "./pages/Admin/StudentList/StudentList";
import { Login } from "./pages/Login/Login";
import { Dashboard } from "./pages/User/Dashboard/Dashboard";
import { RecordNow } from "./pages/User/RecordNow/RecordNow";
import { SignUp } from "./pages/User/SignUp/Signup";

// const path = "dashboard";
// const path = "student-list";
const path = "record-now";


const App = () => {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false); // temp

    useEffect(() => {
        const fromEmailLink = Firebase.instance.isAnnoymousAccount();
        if (fromEmailLink) navigate(`/signup${window.location.search}`);
        const unSubscribeAuthStateChange = Firebase.instance.onAuthStateChanged((user) => {
            console.log("auth state changed", user);
            console.log("from email link", fromEmailLink);
            if (user && !fromEmailLink) {
                setLoggedIn(true);

                navigate(`/${path}`);
            }
            else if (!fromEmailLink) {
                setLoggedIn(false);

                console.log("to login");
                navigate("/login");
            }
        })
        return () => {
            unSubscribeAuthStateChange();
        }
    }, []);

    return (
        <div className="App">
            { loggedIn && <Menu /> }
            <SetLoggedInContext.Provider value={ setLoggedIn }>
                <Routes>
                    <Route path="/record-now" element={ <RecordNow /> } />
                    <Route path="/student-list" element={ <StudentList /> } />
                    <Route path="/categories" element={ <Categories /> } />
                    <Route path="/dashboard" element={ <Dashboard /> } />
                    <Route path="/signup" element={ <SignUp /> } />
                    <Route path="/login" element={ <Login /> } />
                    <Route path="*" element={ <Login /> } />
                </Routes>
            </SetLoggedInContext.Provider>
        </div>
    );
}

export default App;
