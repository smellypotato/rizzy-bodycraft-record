import { useCallback, useState } from "react";
import Firebase from "../../firebase";
import "./AddPanel.css";

export const AddInputPanel = (props: { categoryId: string, close: () => void }) => {
    const [label, setLabel] = useState("");

    const onInput = useCallback((set: React.Dispatch<string>, e: React.ChangeEvent<HTMLInputElement>) => {
        set(e.currentTarget.value);
    }, []);

    const addOption = useCallback((label: string) => {
        Firebase.instance.addOption(props.categoryId, label);
    }, []);

    return (
        <dialog id="add_panel" open>
            <section id="panel">
                <h2>新增輸入</h2>
                <div>
                    <div>項目標籤</div>
                    <input value={ label } onChange={ (e) => onInput(setLabel, e) }/>
                </div>
                <div>
                    <button onClick={ () => { addOption(label); props.close(); } }>確定</button>
                    <button onClick={ () => props.close() }>取消</button>
                </div>
            </section>
        </dialog>
    )
}
