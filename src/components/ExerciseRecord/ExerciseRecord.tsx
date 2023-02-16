import { useCallback, useState } from 'react';
import { Utils } from '../../Utils';
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

export const ExerciseRecord = (props: { currentYear: number, worked: Array<number>, onSelectDay: React.Dispatch<React.SetStateAction<Date | undefined>> }) => {

    const [weeks] = useState(Utils.newArray(12).map((month) => Utils.weeksInMonth(props.currentYear, month) - (month !== MONTH.JAN && new Date(props.currentYear, month, 1).getDay() !== 0 ? 1 : 0)));

    return (
        <section id="exercise_record" title=" Your work">
            <h3>Your work in { props.currentYear }</h3>

            <section id="record_table">
                <div id="days">
                    <label></label>
                    <label>Sun</label>
                    <label></label>
                    <label></label>
                    <label>Wed</label>
                    <label></label>
                    <label></label>
                    <label>Sat</label>
                </div>
                <div id="calendar">
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
                        { Utils.newArray(new Date(props.currentYear, 0, 1).getDay()).map((val) => <div key={ val }/>) }
                        {
                            Utils.newArray(Utils.daysInYear(props.currentYear)).map(dayInYear => {
                                let date = new Date(new Date(props.currentYear, 0).setDate(dayInYear + 1));
                                let dayInMonth = date.getDate();
                                let hasRecord = props.worked.includes(date.valueOf());
                                return (
                                    <div className="record_cell" key={ dayInYear } aria-checked={ hasRecord } onClick={ () => hasRecord && props.onSelectDay(date) }>
                                        { hasRecord && <div className="tooltip_date">{ `${dayInMonth}/${date.getMonth() + 1}/${date.getFullYear()}` }</div>}
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </section>
        </section>
    )
}
