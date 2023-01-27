import Firebase from "../../firebase";
import "./Menu.css";

export const Menu = () => {
    return (
        <section id="menu">
            <button onClick={ Firebase.instance.logout }>Logout</button>
        </section>
    )
}
