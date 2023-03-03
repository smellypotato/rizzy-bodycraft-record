import { useContext } from "react";
import { SetModalContext } from "../../hooks/contexts";
import "./ConfirmBox.css";

export const ConfirmBox = (props: { msg: string, onConfirm: () => void }) => {
    const setModal = useContext(SetModalContext);

    return (
        <dialog id="confirm" open>
            <section id="panel">
                <div>{ props.msg }</div>
                <button onClick={ () => { props.onConfirm(); setModal(); } }>OK</button>
            </section>
        </dialog>
    )
}
