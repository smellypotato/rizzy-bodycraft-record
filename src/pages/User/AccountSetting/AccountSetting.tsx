import { useCallback, useContext, useState } from "react";
import { Loading } from "../../../components/Loading/Loading";
import { ErrorBox } from "../../../components/ErrorBox/ErrorBox";
import { Title } from "../../../components/Title/Title";
import Firebase from "../../../firebase";
import { SetModalContext } from "../../../hooks/contexts";
import { useInput } from "../../../hooks/useInput";
import "./AccountSetting.css";
import { FirebaseError } from "@firebase/util";

export const AccountSetting = () => {

    const setModal = useContext(SetModalContext);
    const [onInputOldPassword, oldPassword] = useInput("");
    const [onInputNewdPassword, newPassword] = useInput("");
    const [onInputConfirmPassword, confirmPassword] = useInput("");

    const onUpdatePassword = useCallback(async (oldPassword: string, newPassword: string, confirmPassword: string) => {
        setModal(<Loading msg="Updating password..." />);
        try {
            await Firebase.instance.updatePassword(newPassword);
            setModal();
        } catch (e) {
            console.log(e);
            setModal(<ErrorBox msg={ (e as FirebaseError).code } />)
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
                <input value={ newPassword } onChange={ onInputNewdPassword } />
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
