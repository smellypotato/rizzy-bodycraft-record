import "./calendar.css";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export const Calendar = (props: { calendarIndex: number, calendar: Date, selectedDay: Date, onChangeMonth: (direction: 1 | -1) => void, onChangeSelectedDay: Function }) => {
    let year = props.calendar.getFullYear();
    let month = props.calendar.getMonth();
    let today: Date = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    let daysInMonth: number = new Date(year, month + 1, 0).getDate(); // month + 1 = next month, date 0 = previous date
    let firstDayInWeek: number = props.calendar.getDay();

    let generatePrecedingNodes = () => {
        return Array.from({ length: firstDayInWeek }, _value => _value).map((_precede, i) => <div key={ i } className={`node`} />)
    }

    let generateDays = () => {
        return Array.from({ length: daysInMonth }, (_value, i) => i).map(day => {
            let nodeDate: Date = new Date(year, month, day + 1);
            return (
                <button aria-selected={ props.selectedDay.valueOf() === nodeDate.valueOf() } key={ day } className="node" onClick={() => props.onChangeSelectedDay(nodeDate)}>
                    <div className="node_text">{day + 1}</div>
                </button>
            )}
        )
    }

    return (
        <div className="calendar no_highlight">
            <div className="title">
                <button onClick={ () => props.onChangeMonth(-1)}>{ "<" }</button>
                <div>{`${year}年${month + 1}月`}</div>
                <button onClick={ () => props.onChangeMonth(1) }>{ ">" }</button>
            </div>
            <div className="grid">
                { WEEKDAYS.map((weekday, i) => <div key={ i } className="node node_text color_prim">{ weekday }</div>) }
                { generatePrecedingNodes() }
                { generateDays() }
            </div>
        </div>
    )
}
