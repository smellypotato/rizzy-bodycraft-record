import { useContext } from "react";
import { SetModalContext } from "../../hooks/contexts";
import "./ErrorBox.css";

export const ErrorBox = (props: { msg: string }) => {
    const setModal = useContext(SetModalContext);

    return (
        <dialog id="error" open>
            <section id="panel">
                <h3>Error</h3>
                <div>{ props.msg }</div>
                <button onClick={ () => setModal() }>OK</button>
            </section>
        </dialog>
    )
}
