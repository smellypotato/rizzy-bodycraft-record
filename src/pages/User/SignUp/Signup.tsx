import { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../App";
import { ErrorBox } from "../../../components/ErrorBox/ErrorBox";
import { Loading } from "../../../components/Loading/Loading";
import { Title } from "../../../components/Title/Title";
import Firebase from "../../../firebase";
import { SetModalContext, UserInfoContext } from "../../../hooks/contexts";
import { useInput } from "../../../hooks/useInput";
import "./SignUp.css";

export const SignUp = () => {
    const navigate = useNavigate();
    const setModal = useContext(SetModalContext);
    const [_userInfo, setUserInfo] = useContext(UserInfoContext);
    const [verifiedEmail, setVerifiedEmail] = useState(false);
    const [onInputEmail, email] = useInput("hksahenry@gmail.com");
    const [onInputName, name] = useInput("");
    const [onInputPassword, password] = useInput("");
    const [onInputConfirmPassword, confirmPassword] = useInput("");

    const onVerify = useCallback(async () => {
        setModal(<Loading msg="Verifying email..." />);
        try {
            let res = await Firebase.instance.login({ email: email });
            if (!res.success) throw new Error(res.message);
            let isNewAccount = await Firebase.instance.checkNewAccount(email)
            setModal();
            if (isNewAccount) setVerifiedEmail(true);
            else navigate(PATH.DASHBOARD);
        } catch (e) { setModal(<ErrorBox msg={ (e as Error).message } />) }
    }, [email]);

    const onBackToLogin = useCallback(async () => {
        await Firebase.instance.logout();
        navigate(PATH.LOGIN, { replace: true })
    }, []);

    const onSignup = useCallback(async () => {
        setModal(<Loading msg="Signing up..." />);
        let id = await Firebase.instance.signup(email, password, name);
        setModal();
        setUserInfo({
            id: id,
            email: email,
            name: name,
            admin: false
        })
        navigate(PATH.DASHBOARD);
    }, [email, password, name]);

    return (
        <main id="signup">
            <Title />
            { !verifiedEmail &&
                <section id="verify_email">
                    <h3>Verify your email</h3>
                    <input type="text" value={ email } placeholder="Email" onChange={ onInputEmail } />
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
                        <input type="text" value={ name } placeholder="Name" onChange={ onInputName } />
                    </div>
                    <div id="signup_row">
                        <div>Password:</div>
                        <input type="password" value={ password } placeholder="Password" onChange={ onInputPassword } />
                    </div>
                    <div id="signup_row">
                        <div>Confirm Password:</div>
                        <input type="password" value={ confirmPassword } placeholder="Confirm Password" onChange={ onInputConfirmPassword } />
                    </div>
                    <button onClick={ onSignup }>Sign Up</button>
                    <button onClick={ onBackToLogin }>Back to Login</button>
                    <div>If you do not complete the sign up procedure now, you will need to request a new email link to login again</div>
                </section>
            }
        </main>
    )
}
