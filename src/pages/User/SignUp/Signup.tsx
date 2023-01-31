import { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Title } from "../../../components/Title/Title";
import Firebase from "../../../firebase";
import { SetLoggedInContext } from "../../../hooks/contexts";
import { useInput } from "../../../hooks/useInput";
import "./SignUp.css";

export const SignUp = () => {
    const navigate = useNavigate();
    const setLoggedIn = useContext(SetLoggedInContext);
    const [verifiedEmail, setVerifiedEmail] = useState(false);
    const [email, setEmail] = useInput("hksahenry@gmail.com");
    const [name, setName] = useInput("");
    const [password, setPassword] = useInput("");
    const [confirmPassword, setConfirmPassword] = useInput("");

    const onInput = useCallback((set: React.Dispatch<string>, e: React.ChangeEvent<HTMLInputElement>) => {
        set(e.currentTarget.value);
    }, []);

    const onVerify = useCallback(async () => {
        let verified = await Firebase.instance.login({ email: email });
        if (verified) {
            setLoggedIn(Firebase.instance.auth.currentUser !== null);
            let isNewAccount = await Firebase.instance.checkNewAccount(email)
            if (isNewAccount) setVerifiedEmail(true);
            else navigate("/dashboard");
        }
    }, [email]);

    const onBackToLogin = useCallback(async () => {
        await Firebase.instance.logout();
        navigate("/", { replace: true })
    }, []);

    const onSignup = useCallback(() => {
        Firebase.instance.signup(email, password, name);
    }, [email, password, name]);

    return (
        <main id="signup">
            <Title />
            { !verifiedEmail &&
                <section id="verify_email">
                    <h3>Verify your email</h3>
                    <input type="text" value={ email } placeholder="Email" onChange={ (e) => onInput(setEmail, e) } />
                    <button onClick={ onVerify }>Verify</button>
                    <button onClick={ onBackToLogin }>Back to Login</button>
                </section>
            }
            { verifiedEmail &&
                <section id="signup_details">
                    <h3>Sign up</h3>
                    <div id="signup_row">
                        <div>Email:</div>
                        <div>{ email }</div>
                    </div>
                    <div id="signup_row">
                        <div>Name:</div>
                        <input type="text" value={ name } placeholder="Name" onChange={ (e) => onInput(setName, e) } />
                    </div>
                    <div id="signup_row">
                        <div>Password:</div>
                        <input type="password" value={ password } placeholder="Password" onChange={ (e) => onInput(setPassword, e) } />
                    </div>
                    <div id="signup_row">
                        <div>Confirm Password:</div>
                        <input type="password" value={ confirmPassword } placeholder="Confirm Password" onChange={ (e) => onInput(setConfirmPassword, e) } />
                    </div>
                    <button onClick={ onSignup }>Sign Up</button>
                    <button onClick={ onBackToLogin }>Back to Login</button>
                    <div>If you do not complete the sign up procedure now, you will need to request a new email link to login again</div>
                </section>
            }
        </main>
    )
}
