import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../App";
import Firebase from "../../firebase";
import { UserInfoContext } from "../../hooks/contexts";
import { useCloseDropdown } from "../../hooks/useCloseDropdown";
import "./Menu.css";

export const Menu = () => {
    const [userInfo] = useContext(UserInfoContext);
    const navigate = useNavigate();
    const [opened, setOpened] = useState(false);

    useCloseDropdown(() => setOpened(false), opened);

    return (
        <div id="menu" aria-modal={ opened }>
            <button id="back" className="icon" onClick={ () => navigate(-1) } />
            <section id="panel">    
                <div id="greeting"><button id="back" className="icon" onClick={ () => navigate(-1) } />{ userInfo && `Welcome back, ${userInfo!.name}` }</div>
                <div id="navigations">
                    { userInfo && <button id="home" onClick={ () => navigate(PATH.DASHBOARD) }><div className="icon"/>Dashboard</button> }
                    { userInfo?.admin && <button id="student_list" onClick={ () => navigate(PATH.STUDENT_LIST) }><div className="icon"/>Student List</button> }
                    { userInfo?.admin && <button id="categories" onClick={ () => navigate(PATH.CATEGORIES) }><div className="icon"/>Categories</button> }
                    { userInfo && <button id="account" onClick={ () => navigate(PATH.ACCOUNT) }><div className="icon"/>Account</button> }
                    { userInfo && <button id="logout" onClick={ Firebase.instance.logout }><div className="icon"/>Logout</button> }
                </div>
            </section>
            <button className="icon" id="hamburger" onClick={ (e) => { e.stopPropagation(); setOpened(!opened); } } />
        </div>
    )
}
