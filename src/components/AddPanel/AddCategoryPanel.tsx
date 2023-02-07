import { useCallback, useState } from "react";
import Firebase from "../../firebase";
import { useAddPanel } from "../../hooks/useAddPanel";
import "./AddPanel.css";

export const AddCategoryPanel = (props: { close: () => void }) => {

    const [label, setLabel, onInput] = useAddPanel();
    const [subCategories, setSubCategories] = useState<Array<string>>([""]);

    const addCategory = useCallback((category: string, subCategories: Array<string>) => {
        Firebase.instance.addCategory(category, subCategories);
    }, [])

    const updateSubCategories = useCallback((e: React.ChangeEvent<HTMLInputElement>,choicesArr: typeof subCategories, i: number ) => {
        let clone = choicesArr.slice();
        clone[i] = e.currentTarget.value;
        setSubCategories(clone);
    }, [])

    const addSubCategory = useCallback((choicesArr: typeof subCategories, i: number) => {
        let clone = choicesArr.slice();
        clone.splice(i + 1, 0, "");
        setSubCategories(clone);
    }, []);

    const removeSubCategory = useCallback((choicesArr: typeof subCategories, i: number) => {
        if (choicesArr.length === 1) return;
        let clone = choicesArr.slice();
        clone.splice(i, 1);
        setSubCategories(clone);
    }, [])

    return (
        <dialog id="add_panel" open>
            <section id="panel">
                <h2>新增項目</h2>
                <div>
                    <div>項目標籤</div>
                    <input value={ label } onChange={ (e) => onInput(setLabel, e) }/>
                </div>
                { subCategories.map((subCategory, i) => (
                    <div key={ i }>
                        <div>分類 {i + 1}</div>
                        <input value={ subCategory } onChange={ (e) => updateSubCategories(e, subCategories, i) }/>
                        <button className="add_choice" onClick={ () => addSubCategory(subCategories, i)}>+</button>
                        <button className="add_choice" onClick={ () => removeSubCategory(subCategories, i)}>-</button>
                    </div>
                ))}
                <div>
                    <button onClick={ () => { addCategory(label, subCategories); props.close(); } }>確定</button>
                    <button onClick={ () => props.close() }>取消</button>
                </div>
            </section>
        </dialog>
    )
}
