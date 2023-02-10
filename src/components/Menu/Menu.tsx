import { useNavigate } from "react-router-dom";
import Firebase from "../../firebase";
import "./Menu.css";

export const Menu = () => {
    const navigate = useNavigate();

    return (
        <section id="menu">
            <button onClick={ () => navigate("/dashboard") }>Dashboard</button>     
            <button onClick={ () => navigate("/categories") }>Categories</button>
            <button onClick={ Firebase.instance.logout }>Logout</button>
        </section>
    )
}
