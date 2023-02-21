import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Loading } from "./components/Loading/Loading";
import { Menu } from "./components/Menu/Menu";
import Firebase from "./firebase";
import { SetModalContext, SetUserInfoContext, UserInfoContext } from "./hooks/contexts";
import { Categories } from "./pages/Admin/Categories/Categories";
import { StudentList } from "./pages/Admin/StudentList/StudentList";
import { Login } from "./pages/Login/Login";
import { Dashboard } from "./pages/User/Dashboard/Dashboard";
import { MyRecord } from "./pages/User/MyRecord/MyRecord";
import { RecordNow } from "./pages/User/RecordNow/RecordNow";
import { SignUp } from "./pages/User/SignUp/Signup";
import { User } from "./type";

export enum PATH {
    LOGIN = "/rizzy-bodycraft-record/login",
    SIGN_UP = "/rizzy-bodycraft-record/signup",
    DASHBOARD = "/rizzy-bodycraft-record/dashboard",
    CATEGORIES = "/rizzy-bodycraft-record/categories",
    STUDENT_LIST = "/rizzy-bodycraft-record/student-list",
    RECORD_NOW = "/rizzy-bodycraft-record/record-now",
    MY_RECORD = "/rizzy-bodycraft-record/my-record"
}

// const path = "dashboard";
// const path = "student-list";
const path = PATH.MY_RECORD;


const App = () => {
    const navigate = useNavigate();
    const [modal, setModal] = useState<JSX.Element>();
    const [userInfo, setUserInfo] = useState<User>();

    useEffect(() => {
        const fromEmailLink = Firebase.instance.isAnnoymousAccount();
        if (fromEmailLink) navigate(`${PATH.SIGN_UP}${window.location.search}`);
        const unSubscribeAuthStateChange = Firebase.instance.onAuthStateChanged(async (user) => {
            console.log("auth state changed", user);
            console.log("from email link", fromEmailLink);
            if (user && !fromEmailLink) {
                setModal(undefined);
                let userInfo = await Firebase.instance.getUserProfile(user.uid);

                setUserInfo({
                    id: userInfo.id,
                    email: userInfo.email,
                    name: userInfo.name,
                    admin: user.displayName === "admin"
                })
                navigate(`${path}`);
            }
            else if (!fromEmailLink) {
                console.log("to login");
                setUserInfo(undefined);
                navigate(PATH.LOGIN);
            }
        })
        return () => {
            unSubscribeAuthStateChange();
        }
    }, []);

    return (
        <SetModalContext.Provider value={ setModal }>
        <UserInfoContext.Provider value={ userInfo }>
        <SetUserInfoContext.Provider value={ setUserInfo }>
            <div className="App">
                { userInfo && <Menu /> }
                <Routes>
                    <Route path={ PATH.MY_RECORD } element={ <MyRecord /> } />
                    <Route path={ PATH.RECORD_NOW } element={ <RecordNow /> } />
                    <Route path={ PATH.STUDENT_LIST } element={ <StudentList /> } />
                    <Route path={ PATH.CATEGORIES } element={ <Categories /> } />
                    <Route path={ PATH.DASHBOARD } element={ <Dashboard /> } />
                    <Route path={ PATH.SIGN_UP } element={ <SignUp /> } />
                    <Route path={ PATH.LOGIN } element={ <Login /> } />
                    <Route path="*" element={ <Login /> } />
                </Routes>
                { modal && modal }
            </div>
        </SetUserInfoContext.Provider>
        </UserInfoContext.Provider>
        </SetModalContext.Provider>

    );
}

export default App;
