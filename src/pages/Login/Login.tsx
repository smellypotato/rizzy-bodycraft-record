import { useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../App";
import { Loading } from "../../components/Loading/Loading";
import { Title } from "../../components/Title/Title";
import Firebase from "../../firebase";
import { SetModalContext } from "../../hooks/contexts";
import { useInput } from "../../hooks/useInput";
import "./Login.css";

export const Login = () => {
    const navigate = useNavigate();
    const setModal = useContext(SetModalContext);

    const [username, setUsername] = useInput("hksahenry@yahoo.com.hk");
    const [password, setPassword] = useInput("hksa13968629");

    const onInput = useCallback((set: React.Dispatch<string>, e: React.ChangeEvent<HTMLInputElement>) => {
        set(e.currentTarget.value);
    }, []);

    const onLogin = () => {
        setModal(<Loading msg={ "正在登入..."} />);
        Firebase.instance.login({ email: username, password: password });
    };

    return (
        <main id="login">
            <Title />
            <section>
                <input type="text" value={ username } placeholder="Username" onChange={ (e) => onInput(setUsername, e) } />
                <input type="text" value={ password } placeholder="Password" onChange={ (e) => onInput(setPassword, e) } />
                <a id="login-forget">Forget password?</a>
                <div id="login-buttons">
                    <button id="user" onClick={ onLogin }>Login</button>
                    <button id="register" onClick={ () => navigate(PATH.LOGIN) }>Sign Up</button>
                </div>
            </section>
        </main>
    )
}
