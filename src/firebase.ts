import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, createUserWithEmailAndPassword, getAdditionalUserInfo, getAuth, isSignInWithEmailLink, onAuthStateChanged, sendSignInLinkToEmail, signInWithEmailAndPassword, signInWithEmailLink, signOut, updatePassword, User, UserCredential } from "firebase/auth";
import { collection, deleteDoc, doc, Firestore, getDoc, getDocs, getFirestore, onSnapshot, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHTYHXBArEA-6bqGFdbqsG1_KLuzGRE2I",
  authDomain: "rizzy-bodycraft-record.firebaseapp.com",
  projectId: "rizzy-bodycraft-record",
  storageBucket: "rizzy-bodycraft-record.appspot.com",
  messagingSenderId: "930408534506",
  appId: "1:930408534506:web:127e3be9dd6236d9836293",
  measurementId: "G-SKFHESV2J6"
};

export type PendingApplcation = {
    id: string,
    name: string,
    email: string
    // apply_date:
}

export default class Firebase {

    private static _inst: Firebase;

    app: FirebaseApp;
    auth: Auth;
    firestore: Firestore;

    private constructor() {
        console.log("initializing firebase");
        this.app = initializeApp(firebaseConfig);
        this.auth = getAuth(this.app);
        this.firestore = getFirestore(this.app)
    }

    public static get instance() {
        return Firebase._inst;
    }

    static init() {
        if (!Firebase._inst) Firebase._inst = new Firebase();
    }

    // auth

    async signup(email: string, password: string, name: string) {
        updatePassword(this.auth.currentUser!, password).then(() => {
            this.updateUserProfile({ email, name });
        }).catch(err => console.error(err));
    }

    async login(args: { email: string, password?: string }): Promise<boolean> {
        const { email, password } = args;
        if (email !== undefined) {
            if (password !== undefined) {
                return await new Promise((resolve, reject) => {
                    signInWithEmailAndPassword(this.auth, email, password).then(credential => {
                        console.log(credential);
                        resolve(true);
                    }).catch((err: { code: string, message: string } ) => {
                        console.error(err.code);
                        reject(false);
                    });
                });
            }
            else {
                console.log(email);
                return await new Promise((resolve, reject) =>
                    signInWithEmailLink(this.auth, email, window.location.href).then(result => {
                        console.log(result);
                        resolve(true);
                    }).catch((err: { code: string, message: string }) => {
                        // auth/invalid-email
                        // auth/invalid-action-code when link used to login
                        console.error(err.code, err.message);
                        reject(false)
                    })
                );
            }
        }
        return false;
    }

    async logout() {
        await signOut(Firebase.instance.auth);
    }

    onAuthStateChanged(callback: (user: User | null) => void) {
        return onAuthStateChanged(this.auth, user => callback(user));
    }

    approvePendingAccount(email: string) {
        const actionCodeSettings = {
            // URL you want to redirect back to. The domain (www.example.com) for this
            // URL must be in the authorized domains list in the Firebase Console.
            url: 'http://localhost:3000',
            handleCodeInApp: true
        };
        sendSignInLinkToEmail(this.auth, email, actionCodeSettings).then(() => console.log("success")).catch((err) => console.log("failed", err));
    }

    isAnnoymousAccount() {
        return isSignInWithEmailLink(this.auth, window.location.href)
    }

    // firestore

    onPendingAccountsChange(callback: (pendings: Array<PendingApplcation>) => void) {
        return onSnapshot(collection(this.firestore, "application"), collection => {
            let pendings: Array<PendingApplcation> = [];
            collection.forEach(application => pendings.push(Object.assign({ id: application.id }, application.data() as { name: string, email: string })));
            callback(pendings)
        })
    }

    async removePendingAccount(id: string) {
        await deleteDoc(doc(this.firestore, "application", id));
    }

    async checkNewAccount(email: string) {
        return !(await getDoc(doc(this.firestore, "user-profile", email))).exists();
    }

    async updateUserProfile(profile: { email: string, name: string }) {
        await setDoc(doc(this.firestore, "user-profile", profile.email), {
            name: profile.name,
            email: profile.email
        })
    }
}
