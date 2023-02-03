import "./DropdownMenu.css";

export const DropdownMenu = (props: { onSelect: (value: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void, onOpen: () => void, onClose: () => void, onAdd?: () => void, opened: boolean, default?: string, current?: string, choices: Array<{ label: string, id: string, allowRemove?: boolean }> }) => {
    return (
        <div className={ `dropdown_menu${props.opened ? "_open" : ""}` }>
            <button id="current" onClick={ props.opened? (e) => { props.onClose(); e.stopPropagation(); } : (e) => { props.onOpen(); e.stopPropagation(); } }><div />{ props.current || props.default }<div className="arrow"/></button>
            {   props.opened &&
                <div id="choices">
                    { props.choices.map(choice =>
                        <button key={ choice.id } className="choice"
                            onClick={ (e) => props.onSelect(choice.id, e) }>
                            <div />
                            { choice.label }
                            { choice.allowRemove ? <button className="delete" /> : <div />}
                        </button>
                    )}
                    { props.onAdd && <button className="choice" onClick={ props.onAdd }><div /><div>新增 ＋</div><div /></button> }
                </div>
            }
        </div>
    )
}
