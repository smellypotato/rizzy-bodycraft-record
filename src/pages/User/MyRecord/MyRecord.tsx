import { useCallback, useEffect } from "react";
import Firebase from "../../../firebase";
import { useState } from "react";
import { Category, Record } from "../../../type";
import { Title } from "../../../components/Title/Title";
import "./MyRecord.css";
import { DropdownMenu } from "../../../components/DropdownMenu/DropdownMenu";
import { useCloseDropdown } from "../../../hooks/useCloseDropdown";
import { Utils } from "../../../Utils";

const PERIOD = {
    ALL: "全部",
    YEAR: "過去一年",
    HALF_YEAR: "過去半年",
    MONTH: "過去一個月",
    WEEK: "過去一星期",
    TODAY: "今天"
}

export const MyRecord = () => {

    const [records, setRecords] = useState<Array<Record>>([]);
    const [categories, setCategories] = useState<Array<Category>>([]);
    const [period, setPeriod] = useState(PERIOD.MONTH);
    const [filter, setFilter] = useState<Category>({ id: "all", title: "全部", types: [] })
    const [activeDropdown, setActiveDropdown] = useState<string>();

    useCloseDropdown(() => setActiveDropdown(undefined), activeDropdown);

    useEffect(() => {
        Firebase.instance.getRecord().then(records => setRecords(records.sort((ra, rb) => rb.date.valueOf() - ra.date.valueOf())));
        Firebase.instance.getCategories().then(categories => setCategories([{ id: "all", title: "全部", types: [] as Array<string> }].concat(categories)));
    }, []);

    const recordsByDate = useCallback((period: string, filter: Category) => {
        let date = Utils.getTodayDate();
        switch (period) {
            case PERIOD.ALL:
                date = new Date(0);
            break;
            case PERIOD.YEAR:
                date.setFullYear(date.getFullYear() - 1);
                date.setDate(date.getDate() + 1);
            break;
            case PERIOD.HALF_YEAR:
                date.setMonth(date.getMonth() - 6);
                date.setDate(date.getDate() + 1);
            break;
            case PERIOD.MONTH:
                date.setMonth(date.getMonth() - 1);
                date.setDate(date.getDate() + 1);
            break;
            case PERIOD.WEEK:
                date.setDate(date.getDate() - 7);
            break;
            case PERIOD.TODAY:
            break;
        }
        let map: Map<number, Array<Record>> = new Map();
        records.forEach(record => {
            let key = record.date.valueOf();
            if (key < date.valueOf() || (filter.id !== "all" && record.categoryId !== filter.id)) return;
            if (map.has(key)) {
                let arr = map.get(key)!;
                arr.push(record);
                map.set(key, arr);
            }
            else map.set(key,[record]);
        })
        return map;
    }, [records]);

    return (
        <main id="my_record">
            <Title />
            <section>
                <div id="filters">
                    <DropdownMenu
                        onSelect={ (period) => setPeriod(PERIOD[period as keyof typeof PERIOD]) }
                        onOpen={ () => setActiveDropdown("period") }
                        onClose={ () => setActiveDropdown(undefined) }
                        opened={ activeDropdown === "period" }
                        default={ period }
                        current={ period }
                        choices={ Object.keys(PERIOD).map(period => { return { id: period, label: PERIOD[period as keyof typeof PERIOD], } }) }
                    />
                    <DropdownMenu
                        onSelect={ (filter) => setFilter(categories.find(category => category.id === filter)!) }
                        onOpen={ () => setActiveDropdown("filter") }
                        onClose={ () => setActiveDropdown(undefined) }
                        opened={ activeDropdown === "filter" }
                        default={ "全部" }
                        current={ filter?.title }
                        choices={ categories.map(category => { return { id: category.id, label: category.title } }) }
                    />
                </div>
                <section id="records">
                    {
                        Array.from(recordsByDate(period, filter)).map(record =>
                            <article className="record">
                                <div id="date">

                                    { Utils.formatDate(new Date(record[0])) }
                                    <div className="dash" />
                                </div>
                                {   record[1].map((r, i) => (
                                        <div className="item" key={ i }>
                                            <div className="category">
                                                <div>{ categories.find(category => category.id === r.categoryId)?.title }</div>
                                                <div className="line" />
                                            </div>
                                            <div className="details">
                                                {
                                                    r.options.map((form, j) =>
                                                        <div className="detail" key={ j }>
                                                            <div>{ r.type }</div>
                                                            { form.map(detail => <div key={ detail.optionId }>{ detail.value }</div>) }
                                                        </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                }
                            </article>
                        )
                    }

                </section>
            </section>
        </main>
    )
}
