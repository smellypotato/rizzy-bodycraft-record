import { useCallback, useEffect, useState } from "react";
import { Title } from "../../../components/Title/Title";
import Firebase from "../../../firebase";
import { PendingApplcation } from "../../../type";
import "./StudentList.css";

export const StudentList = () => {

    const [pendingList, setPendingList] = useState<Array<PendingApplcation>>([]);

    useEffect(() => {
        let unSubscribePendingAccountChange = Firebase.instance.onPendingAccountsChange(setPendingList);
        return () => {
            unSubscribePendingAccountChange();
        }
    }, [])

    const approvePending = useCallback(async (application: PendingApplcation) => {
        Firebase.instance.approvePendingAccount(application.email);
        // await Firebase.instance.removePendingAccount(id);
    }, []);

    const declinePending = useCallback(async (id: string) => {
        await Firebase.instance.removePendingAccount(id);
    }, []);

    return (
        <main id="student_list">
            <Title />
            <section id="request">
                <h3>Pending accounts</h3>
                {   pendingList.map(application => (
                        <div key={ application.id } className="pending_account">
                            <div>{ application.name }</div>
                            <div>{ application.email }</div>
                            <button className="approve_icon" onClick={ () => approvePending(application) } />
                            <button className="decline_icon" onClick={ () => declinePending(application.id) } />
                        </div>
                    ))

                }
            </section>
        </main>
    )
}
