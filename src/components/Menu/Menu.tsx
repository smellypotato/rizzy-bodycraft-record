import { useNavigate } from "react-router-dom";
import { PATH } from "../../App";
import Firebase from "../../firebase";
import "./Menu.css";

export const Menu = () => {
    const navigate = useNavigate();

    return (
        <section id="menu">
            <button id="home" onClick={ () => navigate(PATH.DASHBOARD) }><div className="icon"/>Dashboard</button>
            <button id="categories" onClick={ () => navigate(PATH.CATEGORIES) }><div className="icon"/>Categories</button>
            <button id="logout" onClick={ Firebase.instance.logout }><div className="icon"/>Logout</button>
        </section>
    )
}
