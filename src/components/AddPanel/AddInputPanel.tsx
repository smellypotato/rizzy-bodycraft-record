import { useAddPanel } from "../../hooks/useAddPanel";
import "./AddPanel.css";

export const AddInputPanel = (props: { categoryId: string, close: () => void, label?: string }) => {

    const [label, setLabel, onInput, addOption] = useAddPanel(props.label);

    return (
        <dialog id="add_panel" open>
            <section id="panel">
                <h2>新增輸入</h2>
                <div>
                    <div>項目標籤</div>
                    <input value={ label } onChange={ (e) => onInput(setLabel, e) }/>
                </div>
                <div>
                    <button onClick={ () => { addOption(props.categoryId, label); props.close(); } }>確定</button>
                    <button onClick={ () => props.close() }>取消</button>
                </div>
            </section>
        </dialog>
    )
}
