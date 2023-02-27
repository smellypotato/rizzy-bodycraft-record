import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../App";
import { ErrorBox } from "../../components/ErrorBox/ErrorBox";
import { Loading } from "../../components/Loading/Loading";
import { Title } from "../../components/Title/Title";
import Firebase from "../../firebase";
import { SetModalContext } from "../../hooks/contexts";
import { useInput } from "../../hooks/useInput";
import "./Login.css";

export const Login = () => {
    const navigate = useNavigate();
    const setModal = useContext(SetModalContext);

    const [onInputUsername, username] = useInput("");
    const [onInputPassword, password] = useInput("");

    const onLogin = async () => {
        setModal(<Loading msg={ "正在登入..."} />);
        try {
            let res = await Firebase.instance.login({ email: username, password: password });
            if (!res.success) throw new Error(res.message)
        }
        catch (e) { setModal(<ErrorBox msg={ (e as Error).message } />) }
    };

    return (
        <main id="login">
            <Title />
            <section>
                <h3>Login</h3>
                <input type="text" value={ username } placeholder="Username" onChange={ onInputUsername } />
                <input type="text" value={ password } placeholder="Password" onChange={ onInputPassword } />
                <a id="login-forget">Forget password?</a>
                <div id="login-buttons">
                    <button id="user" onClick={ onLogin }>Login</button>
                    <button id="register" onClick={ () => navigate(PATH.REGISTER) }>Sign Up</button>
                </div>
            </section>
        </main>
    )
}
