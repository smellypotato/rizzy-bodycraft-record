import { useCallback, useContext, useState } from "react";
import { Loading } from "../../../components/Loading/Loading";
import { ErrorBox } from "../../../components/ErrorBox/ErrorBox";
import { Title } from "../../../components/Title/Title";
import Firebase from "../../../firebase";
import { SetModalContext } from "../../../hooks/contexts";
import { useInput } from "../../../hooks/useInput";
import "./AccountSetting.css";

export const AccountSetting = () => {

    const setModal = useContext(SetModalContext);
    const [onInputOldPassword, oldPassword, setOldPassword] = useInput("");
    const [onInputNewPassword, newPassword, setPassword] = useInput("");
    const [onInputConfirmPassword, confirmPassword, setConfirmPassword] = useInput("");

    const onUpdatePassword = useCallback(async (oldPassword: string, newPassword: string, confirmPassword: string) => {
        try {
            if (oldPassword.length === 0 || newPassword.length === 0 || confirmPassword.length === 0) throw Error("Empty password");
            if (newPassword.length < 6) throw Error("auth/weak-password");
            if (newPassword !== confirmPassword) throw Error("Unmatched password");
            setModal(<Loading msg="Updating password..." />);

            let res = await Firebase.instance.updatePassword(oldPassword, newPassword);
            if (!res.success) throw new Error(res.message)
            setOldPassword("");
            setPassword("");
            setConfirmPassword("");
            setModal();
        } catch (e) {
            setModal(<ErrorBox msg={ (e as Error).message } />)
        }
    }, [])

    return (
        <main id="account_setting">
            <Title />
            <section id="personal_info">
                <h3>Personal Info</h3>

                <button>Update</button>
            </section>
            <section id="change_password">
                <h3>Password Setting</h3>
                <div>Old password</div>
                <input value={ oldPassword } onChange={ onInputOldPassword } />
                <div>New password</div>
                <input value={ newPassword } onChange={ onInputNewPassword } />
                <div>Confirm new password</div>
                <input value={ confirmPassword } onChange={ onInputConfirmPassword } />
                <button onClick={ () => onUpdatePassword(oldPassword, newPassword, confirmPassword)}>Update</button>
            </section>
            <section id="linking">
                <h3>Link Account</h3>
            </section>
        </main>
    )
}
