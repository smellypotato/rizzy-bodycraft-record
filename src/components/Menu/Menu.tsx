import { useNavigate } from "react-router-dom";
import { PATH } from "../../App";
import Firebase from "../../firebase";
import "./Menu.css";

export const Menu = () => {
    const navigate = useNavigate();

    return (
        <section id="menu">
            <button onClick={ () => navigate(PATH.DASHBOARD) }>Dashboard</button>
            <button onClick={ () => navigate(PATH.CATEGORIES) }>Categories</button>
            <button onClick={ Firebase.instance.logout }>Logout</button>
        </section>
    )
}
