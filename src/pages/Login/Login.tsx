import { useCallback } from "react";
import { Title } from "../../components/Title/Title";
import Firebase from "../../firebase";
import { useInput } from "../../hooks/useInput";
import "./Login.css";

export const Login = () => {
    const [username, setUsername] = useInput("hksahenry@yahoo.com.hk");
    const [password, setPassword] = useInput("hksa13968629");

    const onInput = useCallback((set: React.Dispatch<string>, e: React.ChangeEvent<HTMLInputElement>) => {
        set(e.currentTarget.value);
    }, []);

    const onLogin = () => {
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
                    <button id="user" onClick={ onLogin }>Login</button><button id="admin" onClick={ onLogin }>Admin Login</button>
                </div>
            </section>
        </main>
    )
}
