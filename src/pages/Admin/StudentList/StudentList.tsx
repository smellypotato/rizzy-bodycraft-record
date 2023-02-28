import { useCallback, useContext, useEffect, useState } from "react";
import { Loading } from "../../../components/Loading/Loading";
import { ErrorBox } from "../../../components/ErrorBox/ErrorBox";
import { Title } from "../../../components/Title/Title";
import Firebase from "../../../firebase";
import { FirebaseError } from "@firebase/util";
import { SetModalContext } from "../../../hooks/contexts";
import { PendingApplcation } from "../../../type";
import "./StudentList.css";

export const StudentList = () => {

    const setModal = useContext(SetModalContext);

    const [pendingList, setPendingList] = useState<Array<PendingApplcation>>([]);

    useEffect(() => {
        let unSubscribePendingAccountChange = Firebase.instance.onPendingAccountsChange(setPendingList);
        return () => {
            unSubscribePendingAccountChange();
        }
    }, [])

    const approvePending = useCallback(async (application: PendingApplcation) => {
        setModal(<Loading msg="正在批准用戶..."/>);
        try {
            await Firebase.instance.approvePendingAccount(application.email);
            setModal();
        }
        catch (e) {
            console.log((e as FirebaseError).code);
            setModal(<ErrorBox msg={ (e as FirebaseError).code } />);
        }
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
