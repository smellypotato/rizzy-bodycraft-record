import { useCallback, useState } from "react";
import Firebase from "../../firebase";

export const AddTypePanel = (props: { categoryId: string, close: () => void, types: Array<string> }) => {

    const [types, setTypes] = useState<Array<string>>(props.types);

    const updateTypes = useCallback((e: React.ChangeEvent<HTMLInputElement>, typesArr: typeof types, i: number ) => {
        let clone = typesArr.slice();
        clone[i] = e.currentTarget.value;
        setTypes(clone);
    }, [])

    const addType = useCallback((choicesArr: typeof types, i: number) => {
        let clone = choicesArr.slice();
        clone.splice(i + 1, 0, "");
        setTypes(clone);
    }, []);

    const removeType = useCallback((choicesArr: typeof types, i: number) => {
        if (choicesArr.length === 1) return;
        let clone = choicesArr.slice();
        clone.splice(i, 1);
        setTypes(clone);
    }, [])

    return (
        <dialog id="add_panel" open>
            <section id="panel">
                <h2>新增分類</h2>
                <div>
                </div>
                { types.map((type, i) => (
                    <div key={ i }>
                        <div>分類 {i + 1}</div>
                        <input value={ type } onChange={ (e) => updateTypes(e, types, i) }/>
                        <button className="add_choice" onClick={ () => addType(types, i)}>+</button>
                        <button className="add_choice" onClick={ () => removeType(types, i)}>-</button>
                    </div>
                ))}

                <div>
                    <button onClick={ () => { Firebase.instance.updateTypes(props.categoryId, types.filter(type => type !== "")); props.close(); } }>確定</button>
                    <button onClick={ () => props.close() }>取消</button>
                </div>
            </section>
        </dialog>
    )
}
