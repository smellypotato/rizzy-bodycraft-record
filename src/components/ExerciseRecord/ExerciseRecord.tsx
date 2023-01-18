import { useCallback, useState } from 'react';
import './ExerciseRecord.css';

enum MONTH {
    JAN = 0,
    FEB,
    MAR,
    APR,
    MAY,
    JUN,
    JUL,
    AUG,
    SEP,
    OCT,
    NOV,
    DEC
}

const newArray = (length: number) => {
    return Array.from(Array(length).keys());
}

export const ExerciseRecord = (props: { currentYear: number }) => {
    const daysInYear = useCallback((year: number) => {
        return (new Date(year + 1, 0, 1).getTime() - new Date(year, 0, 1).getTime()) / 1000 / 60 / 60 / 24;
    }, [])

    const weeksInMonth = useCallback((year: number, month: number) => {
        return Math.ceil((new Date(year, month, 1).getDay() + new Date(year, month + 1, 0).getDate()) / 7);
    }, [])

    const [weeks] = useState(newArray(12).map((month) => weeksInMonth(props.currentYear, month) - (month !== MONTH.JAN && new Date(props.currentYear, month, 1).getDay() !== 0 ? 1 : 0)));

    return (
        <section id="exercise_record" title=" Your work">
            <h3>Your work in { props.currentYear }</h3>

            <section id="record_table">
                <div id="days">
                    <label>Sun</label>
                    <label></label>
                    <label></label>
                    <label>Wed</label>
                    <label></label>
                    <label></label>
                    <label>Sat</label>
                </div>
                <div id="months">
                    {
                        weeks.map((noOfWeeks, month) =>
                            {
                                let previousWeeks = weeks.slice(0, month).reduce((totalWeeks, currentWeeks) => totalWeeks + currentWeeks, 0);
                                return <label key={ MONTH[month] } style={ { gridColumn: `${previousWeeks + 1} / ${previousWeeks + noOfWeeks}` } }>{ MONTH[month].toLowerCase() }</label>
                            }
                        )
                    }
                </div>
                <div id="dates">
                    { newArray(new Date(props.currentYear, 0, 1).getDay()).map((val) => <div key={ val }/>) }
                    {
                        newArray(daysInYear(props.currentYear)).map(dayInYear => {
                            let date = new Date(new Date(props.currentYear, 0).setDate(dayInYear + 1));
                            let dayInMonth = date.getDate();
                            return (
                                <div className="record_cell" key={ dayInYear }>
                                    <div className="tooltip_date">{ `${dayInMonth}/${date.getMonth() + 1}/${date.getFullYear()}` }</div>
                                </div>
                            )
                        })
                    }
                </div>
            </section>
        </section>
    )
}
