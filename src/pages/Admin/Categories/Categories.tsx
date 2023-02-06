import { useCallback, useEffect, useRef, useState } from "react";
import { DropdownMenu } from "../../../components/DropdownMenu/DropdownMenu";
import { Title } from "../../../components/Title/Title";
import Firebase from "../../../firebase";
import "./Categories.css";
import { Category, Option } from "../../../type";
import { AddInputPanel } from "../../../components/AddPanel/AddInputPanel";
import { AddChoicePanel } from "../../../components/AddPanel/AddChoicePanel";
import { AddCategoryPanel } from "../../../components/AddPanel/AddCategoryPanel";
import { Unsubscribe } from "@firebase/firestore";
export const Categories = () => {
    const initted = useRef(false); // for first time listener add does not change category id
    const [categories, setCategories] = useState<Array<Category>>([]);
    const categoryIdRef = useRef<string>();
    const [categoryId, setCategoryId] = useState<string>();
    const [activeDropdown, setActiveDropdown] = useState<string>();
    const [options, setOptions] = useState<Array<Option>>([]);
    const [addModal, setAddModal] = useState<JSX.Element>();

    useEffect(() => {
        let closeDropdown = () => {
            console.log("close dropdown");
            setActiveDropdown(undefined)
        };
        if (activeDropdown) window.addEventListener("click", closeDropdown);

        return () => window.removeEventListener("click", closeDropdown);
    }, [activeDropdown])

    useEffect(() => {

        let unSubscribeCategoryUpdate = Firebase.instance.onCategoryUpdate((categories, update) => {
            setCategories(categories);
            if (initted.current) {
                console.log(categories, update);

                let removedCategory = update.find(upt => upt.type === "removed");
                if (removedCategory?.doc.data().id === categoryIdRef.current) categoryIdRef.current = undefined;

                let addedCategory = update.find(upt => upt.type === "added");
                if (addedCategory) categoryIdRef.current = addedCategory.doc.id;
            }
            else initted.current = true;
        })
        return () => unSubscribeCategoryUpdate();
    }, []);

    useEffect(() => {
        let unSubscribeOptionUpdate: Unsubscribe;
        if (categoryId) unSubscribeOptionUpdate = Firebase.instance.onOptionUpdate(categoryId, (options) => setOptions(options));

        return () => unSubscribeOptionUpdate && unSubscribeOptionUpdate();
    }, [categoryId])


    useEffect(() => {
        console.log(categoryIdRef.current);
        setCategoryId(categoryIdRef.current)
    }, [categoryIdRef.current]);

    // const onInput = useCallback((set: React.Dispatch<string>, e: React.ChangeEvent<HTMLInputElement>) => {
    //     set(e.currentTarget.value);
    // }, []);

    const optionRow = useCallback((details: Option) => {
        return (
            <div className="option" key={ details.id }>
                <button className="delete" onClick={ () => Firebase.instance.deleteOption(categoryId!, details.id)}/>
                <input value={ details.title } onChange={ () => {} } />
                {   details.choices ?
                        <DropdownMenu
                            onSelect={ (_id, e) => e.stopPropagation() }
                            opened={ activeDropdown === details.id }
                            onOpen={ () => setActiveDropdown(details.id) }
                            onClose={ () => setActiveDropdown(undefined) }
                            onAdd={ () => setAddModal(<AddChoicePanel categoryId={ categoryId! } close={ () => setAddModal(undefined) } label={ details.title } choices={ details.choices!.map(choice => choice) } />) }
                            default={ "顯示所有選項" }
                            current={ "" }
                            choices={ details.choices.map((choice, i) => { return {
                                id: `${i}`,
                                label: choice,
                                onRemove: () => { if (details.choices!.length > 1) Firebase.instance.updateChoices(categoryId!, details.id, details.choices!.filter((_choice, j) => i !== j)) } } })
                            }
                        /> :
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
                    <DropdownMenu onSelect={ (id) => categoryIdRef.current = id } onAdd={ () => setAddModal(<AddCategoryPanel close={ () => setAddModal(undefined)} />) } opened={ activeDropdown === "category"} onOpen={ () => setActiveDropdown("category") } onClose={ () => setActiveDropdown(undefined) } default={ "選擇分類" } current={ categories.find(cat => cat.id === categoryId)?.title } choices={ categories.map(category => { return { id: category.id, label: category.title } }) } />
                    { categoryId && <button id="delete" onClick={ () => Firebase.instance.deleteCategory(categoryId) }>刪除分類<div className="bin"/></button> }
                </div>
                { options.map(option => optionRow(option)) }
                { categoryId && <button className="add" onClick={ () => setAddModal(<AddChoicePanel categoryId={ categoryId } close={ () => setAddModal(undefined) } />) }>新增選項 ＋</button> }
                { categoryId && <button className="add" onClick={ () => setAddModal(<AddInputPanel categoryId={ categoryId } close={ () => setAddModal(undefined) } />) }>新增輸入 ＋</button> }
            </section>
            { addModal && addModal }
        </main>
    )
}
