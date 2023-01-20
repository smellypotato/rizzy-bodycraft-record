import "./DropdownMenu.css";

export const DropdownMenu = (props: { onSelect: (value: string) => void, onOpen: () => void, onClose: () => void, opened: boolean, default?: string, current?: string, choices: Array<string>, allowAdd?: boolean }) => {
    return (
        <div className="dropdown_menu">
            <button id="current" onClick={ props.opened? (e) => { props.onClose(); e.stopPropagation(); } : (e) => { props.onOpen(); e.stopPropagation(); } }><div />{ props.current || props.default }<div className="arrow"/></button>
            {   props.opened &&
                <div id="choices">
                    { props.choices.map(choice => <button className="choice" onClick={ () => props.onSelect(choice) }>{ choice }</button>) }
                    { props.allowAdd && <button className="choice">新增</button> }
                </div>
            }
        </div>
    )
}
