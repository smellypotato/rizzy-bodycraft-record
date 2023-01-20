import { useEffect, useState } from "react";
import { DropdownMenu } from "../../../components/DropdownMenu/DropdownMenu";
import { Title } from "../../../components/Title/Title";
import "./Categories.css";

export const Categories = () => {

    const [category, setCategory] = useState<string>();
    const [activeDropdown, setActiveDropdown] = useState<string>();

    useEffect(() => {
        let closeDropdown = () => {
            console.log("close dropdown");
            setActiveDropdown(undefined)
        };
        window.addEventListener("click", closeDropdown);

        return () => window.removeEventListener("click", closeDropdown);
    }, [])

    return (
        <main id="categories">
            <Title />
            <div id="categories-dropdown">
                <DropdownMenu onSelect={ setCategory } opened={ activeDropdown === "category"} onOpen={ () => setActiveDropdown("category") } onClose={ () => setActiveDropdown(undefined) } default={ "選擇分類" } current={ category } choices={ ["A", "B"] } allowAdd />
            </div>
        </main>
    )
}
