import { useCallback, useEffect, useState } from "react";
import { DropdownMenu } from "../../../components/DropdownMenu/DropdownMenu";
import { Title } from "../../../components/Title/Title";
import Firebase from "../../../firebase";
import "./Categories.css";
import { Option } from "../../../type";
import { AddInputPanel } from "../../../components/AddPanel/AddInputPanel";
export const Categories = () => {

    const [categories, setCategories] = useState<Array<{ label: string, id: string }>>([]);
    const [categoryId, setCategoryId] = useState<string>();
    const [activeDropdown, setActiveDropdown] = useState<string>();
    const [options, setOptions] = useState<Array<Option>>([]);
    const [addModal, setAddModal] = useState<JSX.Element>();

    useEffect(() => {
        let closeDropdown = () => {
            console.log("close dropdown");
            setActiveDropdown(undefined)
        };
        window.addEventListener("click", closeDropdown);

        return () => window.removeEventListener("click", closeDropdown);
    }, [])

    useEffect(() => {
        Firebase.instance.getCategories().then(categories =>
            setCategories(categories.map(category => {
                return { label: category.title, id: category.id }
            }))
        );
    }, [])

    // useEffect(() => {
    //     if (categoryId) Firebase.instance.getOptions(categoryId).then(options => setOptions(options));
    // }, [categoryId]);

    useEffect(() => {
        if (categoryId) Firebase.instance.onOptionUpdate(categoryId, (options) => setOptions(options));
    }, [categoryId])

    const onInput = useCallback((set: React.Dispatch<string>, e: React.ChangeEvent<HTMLInputElement>) => {
        set(e.currentTarget.value);
    }, []);

    const optionRow = useCallback((details: Option) => {
        return (
            <div className="option" key={ details.id }>
                <button className="delete" onClick={ () => Firebase.instance.deleteOption(categoryId!, details.id)}/>
                <input value={ details.title } onChange={ () => {} } />
                {   details.choices ?
                        <DropdownMenu onSelect={ (_id, e) => e.stopPropagation() } opened={ activeDropdown === details.id } onOpen={ () => setActiveDropdown(details.id) } onClose={ () => setActiveDropdown(undefined) } default={ "顯示所有選項" } current={ "" } choices={ details.choices.map(choice => { return { id: details.id, label: choice, allowRemove: true } }) } /> :
                        <div>輸入</div>
                }
            </div>
        )
    }, [options, activeDropdown]);

    return (
        <main id="categories">
            <Title />
            <section id="content">
                <div id="dropdown_big">
                    <DropdownMenu onSelect={ setCategoryId } opened={ activeDropdown === "category"} onOpen={ () => setActiveDropdown("category") } onClose={ () => setActiveDropdown(undefined) } default={ "選擇分類" } current={ categories.find(cat => cat.id === categoryId)?.label } choices={ categories } />
                </div>
                { options.map(option => optionRow(option)) }
                { categoryId && <button className="add" onClick={ () => {} }>新增選項 ＋</button> }
                { categoryId && <button className="add" onClick={ () => setAddModal(<AddInputPanel categoryId={ categoryId } close={ () => setAddModal(undefined) } />) }>新增輸入 ＋</button> }
            </section>
            { addModal && addModal }
        </main>
    )
}
