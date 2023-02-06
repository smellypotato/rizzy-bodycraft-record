import { useCallback, useState } from "react";
import { useAddPanel } from "../../hooks/useAddPanel";
import "./AddPanel.css";

export const AddChoicePanel = (props: { categoryId: string, close: () => void, label?: string, choices?: Array<string> }) => {

    const [label, setLabel, onInput, addOption] = useAddPanel(props.label);
    const [choices, setChoices] = useState<Array<string>>(props.choices || [""]);

    const updateChoices = useCallback((e: React.ChangeEvent<HTMLInputElement>,choicesArr: typeof choices, i: number ) => {
        let clone = choicesArr.slice();
        clone[i] = e.currentTarget.value;
        setChoices(clone);
    }, [])

    const addChoice = useCallback((choicesArr: typeof choices, i: number) => {
        let clone = choicesArr.slice();
        clone.splice(i + 1, 0, "");
        setChoices(clone);
    }, []);

    const removeChoice = useCallback((choicesArr: typeof choices, i: number) => {
        if (choicesArr.length === 1) return;
        let clone = choicesArr.slice();
        clone.splice(i, 1);
        setChoices(clone);
    }, [])

    return (
        <dialog id="add_panel" open>
            <section id="panel">
                <h2>新增選項</h2>
                <div>
                    <div>項目標籤</div>
                    <input value={ label } onChange={ (e) => !props.label && onInput(setLabel, e) }/>
                </div>
                { choices.map((choice, i) => (
                    <div key={ i }>
                        <div>選項 {i + 1}</div>
                        <input value={ choice } onChange={ (e) => updateChoices(e, choices, i) }/>
                        <button className="add_choice" onClick={ () => addChoice(choices, i)}>+</button>
                        <button className="add_choice" onClick={ () => removeChoice(choices, i)}>-</button>
                    </div>
                ))}

                <div>
                    <button onClick={ () => { addOption(props.categoryId, label, choices); props.close(); } }>確定</button>
                    <button onClick={ () => props.close() }>取消</button>
                </div>
            </section>
        </dialog>
    )
}
