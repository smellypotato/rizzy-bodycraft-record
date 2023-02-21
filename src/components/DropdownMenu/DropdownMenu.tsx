import "./DropdownMenu.css";

export const DropdownMenu = (props: { onSelect: (value: string, e: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>) => void, onOpen: () => void, onClose: () => void, onAdd?: () => void, opened: boolean, default?: string, current?: string, choices: Array<{ label: string, id: string, onRemove?: () => (void | Promise<void>) }> }) => {
    return (
        <div className={ `no_highlight dropdown_menu${props.opened ? "_open" : ""}` }>
            <button id="current" onClick={ (e) => { props.opened ? props.onClose() : props.onOpen(); e.stopPropagation(); } }><div />{ props.current || props.default }<div className="arrow"/></button>
            {   props.opened &&
                <div id="choices">
                    { props.choices.map(choice =>
                        <button key={ choice.id } className="choice"
                            onClick={ (e) => props.onSelect(choice.id, e) }>
                            <div />
                            { choice.label }
                            { choice.onRemove ? <div className="delete" onClick={ choice.onRemove } /> : <div />}
                        </button>
                    )}
                    { props.onAdd && <button className="choice" onClick={ props.onAdd }><div /><div>新增 ＋</div><div /></button> }
                </div>
            }
        </div>
    )
}
