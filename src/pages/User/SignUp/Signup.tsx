import { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../App";
import { ConfirmBox } from "../../../components/ConfirmBox/ConfirmBox";
import { ErrorBox } from "../../../components/ErrorBox/ErrorBox";
import { Loading } from "../../../components/Loading/Loading";
import { Title } from "../../../components/Title/Title";
import Firebase from "../../../firebase";
import { SetModalContext, UserInfoContext } from "../../../hooks/contexts";
import { useInput } from "../../../hooks/useInput";
import { useTryApi } from "../../../hooks/useTryApi";
import "./SignUp.css";

export const SignUp = () => {
    const navigate = useNavigate();
    const setModal = useContext(SetModalContext);
    const [_userInfo, setUserInfo] = useContext(UserInfoContext);
    const [onInputEmail, email] = useInput("");
    const [onInputName, name] = useInput("");
    const [onInputPassword, password] = useInput("");
    const [onInputConfirmPassword, confirmPassword] = useInput("");

    // const onVerify = useCallback(async () => {
    //     setModal(<Loading msg="Verifying email..." />);
    //     try {
    //         if (!res.success) throw new Error(res.message);
    //         let isNewAccount = await Firebase.instance.checkNewAccount(email)
    //         setModal();
    //         if (isNewAccount) setVerifiedEmail(true);
    //         else navigate(PATH.DASHBOARD);
    //     } catch (e) { setModal(<ErrorBox msg={ (e as Error).message } />) }
    // }, [email]);

    const onBackToLogin = useCallback(async () => {
        // await Firebase.instance.logout();
        navigate(PATH.LOGIN, { replace: true })
    }, []);

    const onSignup2 = useCallback(async (email: string, password: string, confirmPassword: string, name: string) => {
        if (password !== confirmPassword) throw new Error("password unmatch");
        setModal(<Loading msg="Verifying email..." />);
        let isNewAccount = await Firebase.instance.checkNewAccount(email)
        if (!isNewAccount) throw new Error("account exists");
        let res = await Firebase.instance.login({ email: email });
        if (!res.success) throw new Error(res.message);
        setModal(<Loading msg="Signing up..." />);
        res = await Firebase.instance.signup(email, password, name);
        if (!res.success) throw new Error(res.message);
        setModal(<ConfirmBox msg={ "Account created successfully."} onConfirm={ async () => window.location.replace(`${window.location.origin}/${PATH.LOGIN}`) } />);
    }, []);

    const onSignup = useCallback(async (email: string, password: string, confirmPassword: string, name: string) => {
        try {
            onSignup2(email, password, confirmPassword, name);
        } catch (e) { setModal(<ErrorBox msg={ (e as Error).message } />) }
    }, []);

    return (
        <main id="signup">
            <Title />
            <section id="verify_email">
                <h3>Verify your email</h3>
                <form onSubmit={ (e) => { e.preventDefault(); onSignup(email, password, confirmPassword, name); } }>
                    <input type="text" value={ email } placeholder="Email" onChange={ onInputEmail } />
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
                    <button>Sign Up</button>
                    <button onClick={ onBackToLogin }>Back to Login</button>
                </form>
            </section>
        </main>
    )
}
