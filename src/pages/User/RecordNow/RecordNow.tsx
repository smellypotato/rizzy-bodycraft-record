import { Unsubscribe } from "@firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarDisplay } from "../../../components/calendar/calendarDisplay";
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
    const [type, setType] = useState<string>();
    const [date, setDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
    const [options, setOptions] = useState<Array<Option>>([]);
    const [form, setForm] = useState<Array<Array<{ optionId: string, value?: string }>>>([]);

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

    useEffect(() => {
        if (options.length > 0) {
            let firstForm = options.map(option => { return { optionId: option.id } });
            setForm([firstForm]);
        }
    }, [options])

    const currentCategory = useCallback(() => {
        return categories.find(category => category.id === categoryId);
    }, [categoryId]);

    const addForm = useCallback((i: number) => {
        let fm: typeof form = JSON.parse(JSON.stringify(form));
        fm.splice(i + 1 , 0, options.map(option => { return { optionId: option.id } }));
        setForm(fm);
    }, [form]);

    const deleteForm = useCallback((i: number) => {
        let fm: typeof form = JSON.parse(JSON.stringify(form));
        fm.splice(i , 1);
        setForm(fm);
    }, [form]);

    const card = (i: number) => {
        return (
            <article key={ i } className="card">
                { options.map(option => {
                    let dropdownId = `${i}-${option.id}`;
                    let fm: typeof form = JSON.parse(JSON.stringify(form));
                    let opts = fm[i];
                    let optIndex = opts.findIndex(opt => opt.optionId === option.id);
                    const updateValue = (value: string) => {
                        opts[optIndex].value = value;
                        setForm(fm);
                    }
                    return (
                        option.isChoices ?
                            <DropdownMenu
                                key={ option.id }
                                onOpen={ () => setActiveDropdown(dropdownId) }
                                onClose={ () => setActiveDropdown(undefined) }
                                onSelect={ (index) => { updateValue(option.choices![parseInt(index)])} }
                                default={ option.title }
                                current={ form[i][optIndex].value }
                                choices={ option.choices!.map((choice, i) => { return { id: `${i}`, label: choice } })}
                                opened={ activeDropdown === dropdownId }
                            /> :
                            <input placeholder={ option.title } value={ form[i][optIndex].value } onChange={ (e: React.ChangeEvent<HTMLInputElement>) => updateValue(e.currentTarget.value) } />
                    )
                }) }
                { form.length > 1 && <button className="delete" onClick={ () => deleteForm(i) }>-</button>}
                <button className="add" onClick={ () => addForm(i) }>+</button>
            </article>
        )
    }

    const onSubmit = (fm: typeof form) => {
        Firebase.instance.submitRecord(categoryId!, fm);
    }

    return (
        <main id="record_now">
            <Title />
            <section id="content">
                <DropdownMenu
                    onOpen={ () => setActiveDropdown("category") }
                    onClose={ () => setActiveDropdown(undefined) }
                    onSelect={ (id) => setCategoryId(id) }
                    default={ "分類" }
                    current={ currentCategory()?.title }
                    choices={ categories.map(category => { return { id: category.id, label: category.title } })}
                    opened={ activeDropdown === "category" }
                />
                { categoryId &&
                    <div id="unique_info">
                        <DropdownMenu
                            onOpen={ () => setActiveDropdown("type") }
                            onClose={ () => setActiveDropdown(undefined) }
                            onSelect={ (index) => setType(currentCategory()!.types[JSON.parse(index)]) }
                            default={ "類型" }
                            current={ type }
                            choices={ currentCategory()!.types.map((type, i) => { return { id: `${i}`, label: type } })}
                            opened={ activeDropdown === "type" }
                        />
                        <div id="date">
                            <button onClick={ (e) => { if (activeDropdown !== "calendar") { setActiveDropdown("calendar"); e.stopPropagation(); } } }>{ `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}` }</button>
                            {   activeDropdown === "calendar" &&
                                <div id="calendar_container"><CalendarDisplay selectedDay={ date } onChangeSelectedDay={ (date: Date) => setDate(date) } /></div>
                            }
                        </div>
                    </div>
                }
                { form.map((_f, i) => card(i)) }
                <div id="form_buttons">
                    <button id="submit" onClick={ () => onSubmit(form) }>提交</button>
                    <button id="cancel" onClick={ () => {} }>取消</button>
                </div>
            </section>
        </main>
    )
}
