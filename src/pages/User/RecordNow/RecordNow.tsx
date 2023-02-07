import { Unsubscribe } from "@firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { DropdownMenu } from "../../../components/DropdownMenu/DropdownMenu";
import { Title } from "../../../components/Title/Title";
import Firebase from "../../../firebase";
import { useCloseDropdown } from "../../../hooks/useCloseDropdown";
import { Category, Option } from "../../../type";
import "./RecordNow.css";

export const RecordNow = () => {
    const initted = useRef(false);
    const [activeDropdown, setActiveDropdown] = useState<string>();
    const [categories, setCategories] = useState<Array<Category>>([]);
    const categoryIdRef = useRef<string>();
    const [categoryId, setCategoryId] = useState<string>();
    const [typeId, setTypeId] = useState<string>();
    const [options, setOptions] = useState<Array<Option>>([]);
    useCloseDropdown(() => setActiveDropdown(undefined), activeDropdown);

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
        setCategoryId(categoryIdRef.current)
    }, [categoryIdRef.current]);

    useEffect(() => {
        let unSubscribeOptionUpdate: Unsubscribe;
        if (categoryId) unSubscribeOptionUpdate = Firebase.instance.onOptionUpdate(categoryId, (options) => setOptions(options));

        return () => unSubscribeOptionUpdate && unSubscribeOptionUpdate();
    }, [categoryId])

    return (
        <main id="record_now">
            <Title />
            <section id="content">
                <DropdownMenu
                    onOpen={ () => setActiveDropdown("category") }
                    onClose={ () => setActiveDropdown(undefined) }
                    onSelect={ (id) => setCategoryId(id) }
                    default={ "分類" }
                    current={ categories.find(category => category.id === categoryId)?.title }
                    choices={ categories.map(category => { return { id: category.id, label: category.title } })}
                    opened={ activeDropdown === "category" }
                />
                { categoryId &&
                    <div id="unique_info">
                        <DropdownMenu
                            onOpen={ () => setActiveDropdown("type") }
                            onClose={ () => setActiveDropdown(undefined) }
                            onSelect={ (id) => setTypeId(id) }
                            default={ "類型" }
                            current={ options.find(option => option.id === typeId)?.title }
                            choices={ options.find(option => option.title === "type")!.choices!.map((choice, i) => { return { id: `${i}`, label: choice } })}
                            opened={ activeDropdown === "type" }
                        />
                    </div>
                }
                <article>
                </article>
            </section>
        </main>
    )
}
