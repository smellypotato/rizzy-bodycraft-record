import { useCallback, useState } from "react";
import Firebase from "../../firebase";
import "./AddPanel.css";

export const AddCategoryPanel = (props: { close: () => void }) => {

    const [label, setLabel] = useState("");

    const onInput = useCallback((set: React.Dispatch<string>, e: React.ChangeEvent<HTMLInputElement>) => {
        set(e.currentTarget.value);
    }, []);

    const addCategory = useCallback((category: string) => {
        Firebase.instance.addCategory(category);
    }, [])

    return (
        <dialog id="add_panel" open>
            <section id="panel">
                <h2>新增分類</h2>
                <div>
                    <div>分類標籤</div>
                    <input value={ label } onChange={ (e) => onInput(setLabel, e) }/>
                </div>
                <div>
                    <button onClick={ () => { addCategory(label); props.close(); } }>確定</button>
                    <button onClick={ () => props.close() }>取消</button>
                </div>
            </section>
        </dialog>
    )
}
