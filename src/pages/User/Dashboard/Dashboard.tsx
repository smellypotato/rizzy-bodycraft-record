import { useState } from 'react';
import { ExerciseRecord } from '../../../components/ExerciseRecord/ExerciseRecord';
import { Title } from '../../../components/Title/Title';
import './Dashboard.css';

export const Dashboard = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() - 1);
    return (
        <main id="dashboard">
            <Title />
            <section>
                <ExerciseRecord currentYear={ selectedYear }/>
                <div id="years">
                    <button className="years-button" id={ selectedYear === 2023 ? "current" : ""} onClick={ () => setSelectedYear(2023) }>2023</button>
                    <button className="years-button" id={ selectedYear === 2022 ? "current" : ""} onClick={ () => setSelectedYear(2022) }>2022</button>
                </div>
            </section>
            <button className="main-button">Record Now<div id="pen"/></button>
            <button className="main-button">My Record<div id="record"/></button>
        </main>
    )
}
