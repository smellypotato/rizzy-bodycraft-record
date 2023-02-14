import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../../../App';
import { ExerciseRecord } from '../../../components/ExerciseRecord/ExerciseRecord';
import { Title } from '../../../components/Title/Title';
import Firebase from '../../../firebase';
import { Category, Record } from '../../../type';
import { Utils } from '../../../Utils';
import './Dashboard.css';

export const Dashboard = () => {
    const navigate = useNavigate();

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() - 1);
    const [selectedDay, setSelectedDay] = useState<Date>();
    const [records, setRecords] = useState<Array<Record>>([]);
    const [categories, setCategories] = useState<Array<Category>>([]);

    useEffect(() => {
        Firebase.instance.getRecord().then(records => setRecords(records));
        Firebase.instance.getCategories().then(categories => setCategories(categories));
    }, []);

    return (
        <main id="dashboard">
            <Title />
            <section>
                <ExerciseRecord currentYear={ selectedYear } worked={ records.map(record => record.date.valueOf()) } onSelectDay={ setSelectedDay } />
                <div id="years">
                    <button aria-selected={ selectedYear === 2023 } className="years-button" onClick={ () => setSelectedYear(2023) }>2023</button>
                    <button aria-selected={ selectedYear === 2022 } className="years-button" onClick={ () => setSelectedYear(2022) }>2022</button>
                </div>
                { selectedDay &&
                    <article className="record">
                        <div id="date">
                            { Utils.formatDate(selectedDay) }
                            <div className="dash" />
                        </div>
                        {   records.map((record, i) => (
                                <div className="item" key={ i }>
                                    <div className="category">
                                        <div>{ categories.find(category => category.id === records[0].categoryId)?.title }</div>
                                        <div className="line" />
                                    </div>
                                    <div className="details">
                                        {
                                            record.options.map((form, j) =>
                                                <div className="detail" key={ j }>
                                                    <div>{ record.type }</div>
                                                    { form.map(detail => <div key={ detail.optionId }>{ detail.value }</div>) }
                                                </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        }
                    </article>
                }
            </section>
            <button className="main-button" onClick={ () => navigate(PATH.RECORD_NOW)}>Record Now<div id="pen"/></button>
            <button className="main-button">My Record<div id="record"/></button>
        </main>
    )
}
