import { collection, onSnapshot, Unsubscribe } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Title } from "../../../components/Title/Title";
import Firebase, { PendingApplcation } from "../../../firebase";
import "./StudentList.css";

export const StudentList = () => {

    const [pendingList, setPendingList] = useState<Array<PendingApplcation>>([]);

    useEffect(() => {
        let unSubscribePendingAccountChange = Firebase.instance.onPendingAccountsChange(setPendingList);
        return () => {
            unSubscribePendingAccountChange();
        }
    }, [])

    return (
        <main id="student_list">
            <Title />
            <section id="request">
                <h3>Pending accounts</h3>
                {   pendingList.map(application => (
                        <div key={ application.id } className="pending_account">
                            <div>{ application.name }</div>
                            <div>{ application.email }</div>
                            <button className="approve_icon" onClick={ () => {} } />
                            <button className="decline_icon" onClick={ () => {} } />
                        </div>
                    ))

                }
            </section>
        </main>
    )
}
