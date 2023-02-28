import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../App";
import { ErrorBox } from "../../../components/ErrorBox/ErrorBox";
import { Loading } from "../../../components/Loading/Loading";
import { Title } from "../../../components/Title/Title";
import Firebase from "../../../firebase";
import { SetModalContext } from "../../../hooks/contexts";
import { useInput } from "../../../hooks/useInput";
import "./Register.css";

export const Register = () => {
    const navigate = useNavigate();
    const setModal = useContext(SetModalContext);

    const [onInputName, name] = useInput("");
    const [onInputEmail, email] = useInput("");

    const onSubmit = async () => {
        setModal(<Loading msg="Submitting application" />);
        try {
            let res = await Firebase.instance.register(name, email);
            if (!res.success) throw new Error(res.message)
            setModal();
            navigate(PATH.LOGIN)
        }
        catch (e) { setModal(<ErrorBox msg={ (e as Error).message } />) }
    }

    return (
        <main id="register">
            <Title />
            <section>
                <h3>Register</h3>
                <form onSubmit={ (e) => { e.preventDefault(); onSubmit(); } }>
                    <input type="text" value={ name } placeholder="Name" onChange={ onInputName } />
                    <input type="text" value={ email } placeholder="Email" onChange={ onInputEmail } />
                    <div id="buttons">
                        <button type="submit" id="submit">Register</button>
                        <button type="button" id="back" onClick={ () => navigate(-1) }>Back</button>
                    </div>
                </form>
            </section>
        </main>
    )
}
