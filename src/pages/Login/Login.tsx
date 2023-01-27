import { useCallback } from "react";
import { Title } from "../../components/Title/Title";
import Firebase from "../../firebase";
import { useInput } from "../../hooks/useInput";
import "./Login.css";

export const Login = () => {
    const [username, setUsername] = useInput("");
    const [password, setPassword] = useInput("");

    const onInput = useCallback((set: React.Dispatch<string>, e: React.ChangeEvent<HTMLInputElement>) => {
        set(e.currentTarget.value);
    }, []);

    const onLogin = useCallback(() => {
        Firebase.instance.login(username, password);
    }, [username, password]);

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
