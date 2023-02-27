import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Loading } from "./components/Loading/Loading";
import { Menu } from "./components/Menu/Menu";
import Firebase from "./firebase";
import { SetModalContext, UserInfoContext } from "./hooks/contexts";
import { Categories } from "./pages/Admin/Categories/Categories";
import { StudentList } from "./pages/Admin/StudentList/StudentList";
import { Login } from "./pages/Login/Login";
import { AccountSetting } from "./pages/User/AccountSetting/AccountSetting";
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
    MY_RECORD = "/rizzy-bodycraft-record/my-record",
    ACCOUNT = "/rizzy-bodycraft-record/account"
}

const App = () => {
    const navigate = useNavigate();
    const [modal, setModal] = useState<JSX.Element>();
    const [userInfo, setUserInfo] = useState<User>();
    const [inited, setInited] = useState(false);

    useEffect(() => {
        const fromEmailLink = Firebase.instance.isAnnoymousAccount();
        if (fromEmailLink) navigate(`${PATH.SIGN_UP}${window.location.search}`);
        const unSubscribeAuthStateChange = Firebase.instance.onAuthStateChanged(async (user) => {
            console.log("auth state changed", user);
            console.log("from email link", fromEmailLink);
            if (user && !fromEmailLink) {
                let userInfo = await Firebase.instance.getUserProfile(user.uid);
                setModal(undefined);
                setUserInfo({
                    id: userInfo.id,
                    email: userInfo.email,
                    name: userInfo.name,
                    admin: user.displayName === "admin"
                })
                navigate(user.displayName === "admin" ? PATH.CATEGORIES : PATH.DASHBOARD, { replace: true });
            }
            else if (!fromEmailLink) {
                console.log("to login");
                setUserInfo(undefined);
                navigate(PATH.LOGIN, { replace: true });
            }
            setInited(true);
        })
        return () => {
            unSubscribeAuthStateChange();
        }
    }, []);

    useEffect(() => {
        !inited ? setModal(<Loading msg={ "正在嘗試登入，請稍候..." } />) : setModal(undefined);
    }, [inited]);

    return (
        <SetModalContext.Provider value={ setModal }>
        { inited &&
            <UserInfoContext.Provider value={ [userInfo, setUserInfo] }>
                <div className="App">
                    { userInfo && <Menu /> }
                    <Routes>
                        <Route path={ PATH.ACCOUNT } element={ <AccountSetting /> } />
                        <Route path={ PATH.MY_RECORD } element={ <MyRecord /> } />
                        <Route path={ PATH.RECORD_NOW } element={ <RecordNow /> } />
                        <Route path={ PATH.STUDENT_LIST } element={ <StudentList /> } />
                        <Route path={ PATH.CATEGORIES } element={ <Categories /> } />
                        <Route path={ PATH.DASHBOARD } element={ <Dashboard /> } />
                        <Route path={ PATH.SIGN_UP } element={ <SignUp /> } />
                        <Route path={ PATH.LOGIN } element={ <Login /> } />
                        <Route path="/rizzy-bodycraft-record/*" element={ <Login /> } />
                    </Routes>
                </div>
            </UserInfoContext.Provider>
        }
        { modal && modal }
        </SetModalContext.Provider>

    );
}

export default App;
