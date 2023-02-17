import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../App";
import Firebase from "../../firebase";
import { UserInfoContext } from "../../hooks/contexts";
import "./Menu.css";

export const Menu = () => {
    const userInfo = useContext(UserInfoContext);
    const navigate = useNavigate();

    return (
        <section id="menu">
            <div id="greeting">{ userInfo && `Welcome back, ${userInfo!.name}` }</div>
            <div id="navigations">
                { userInfo && <button id="home" onClick={ () => navigate(PATH.DASHBOARD) }><div className="icon"/>Dashboard</button> }
                { userInfo?.admin && <button id="student_list" onClick={ () => navigate(PATH.STUDENT_LIST) }><div className="icon"/>Student List</button> }
                { userInfo?.admin && <button id="categories" onClick={ () => navigate(PATH.CATEGORIES) }><div className="icon"/>Categories</button> }
                { userInfo && <button id="logout" onClick={ Firebase.instance.logout }><div className="icon"/>Logout</button> }
            </div>
        </section>
    )
}
