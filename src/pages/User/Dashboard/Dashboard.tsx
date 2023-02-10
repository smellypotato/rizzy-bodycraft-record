import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExerciseRecord } from '../../../components/ExerciseRecord/ExerciseRecord';
import { Title } from '../../../components/Title/Title';
import './Dashboard.css';

export const Dashboard = () => {
    const navigate = useNavigate();

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() - 1);
    return (
        <main id="dashboard">
            <Title />
            <section>
                <ExerciseRecord currentYear={ selectedYear }/>
                <div id="years">
                    <button aria-selected={ selectedYear === 2023 } className="years-button" onClick={ () => setSelectedYear(2023) }>2023</button>
                    <button aria-selected={ selectedYear === 2022 } className="years-button" onClick={ () => setSelectedYear(2022) }>2022</button>
                </div>
            </section>
            <button className="main-button" onClick={ () => navigate("/record-now")}>Record Now<div id="pen"/></button>
            <button className="main-button">My Record<div id="record"/></button>
        </main>
    )
}
