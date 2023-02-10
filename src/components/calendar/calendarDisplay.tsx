import { useState } from "react";

import { Calendar } from "./calender";

import "./calendarDisplay.css";

// all month start from 0 = JAN
export const CalendarDisplay = (props: { selectedDay: Date, onChangeSelectedDay: Function }) => {
    let today = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const [calendars, setCalendars] = useState([new Date(today.getFullYear(), today.getMonth())]);

    let onChangeSelectedDay = (newDate: Date) => {
        props.onChangeSelectedDay(newDate);
    }

    let onChangeMonth = (direction: 1 | -1) => {
        let originCalendars: Array<Date> = [...calendars];
        let newCalendars: Array<Date> = originCalendars.map(originCalendar => new Date(originCalendar.getFullYear(), originCalendar.getMonth() + direction));
        setCalendars(newCalendars);
    }

    return (
        <div id="calendar-display" onClick={ (e) => e.stopPropagation() }>
            <Calendar calendarIndex={ 0 } calendar={ calendars[0] } selectedDay={ props.selectedDay } onChangeMonth={ (direction: 1 | -1) => onChangeMonth(direction) } onChangeSelectedDay={ onChangeSelectedDay }/>
        </div>
    )
}
