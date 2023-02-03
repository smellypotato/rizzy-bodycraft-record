import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, createUserWithEmailAndPassword, getAdditionalUserInfo, getAuth, isSignInWithEmailLink, onAuthStateChanged, sendSignInLinkToEmail, signInWithEmailAndPassword, signInWithEmailLink, signOut, updatePassword, User, UserCredential } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, getDocs, getFirestore, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { optionConverter, PendingApplcation, Option, categoryConverter, Category } from "./type";
const firebaseConfig = {
  apiKey: "AIzaSyDHTYHXBArEA-6bqGFdbqsG1_KLuzGRE2I",
  authDomain: "rizzy-bodycraft-record.firebaseapp.com",
  projectId: "rizzy-bodycraft-record",
  storageBucket: "rizzy-bodycraft-record.appspot.com",
  messagingSenderId: "930408534506",
  appId: "1:930408534506:web:127e3be9dd6236d9836293",
  measurementId: "G-SKFHESV2J6"
};

enum COLLECTION {
    CATEGORY = "category",
    USER_PROFILE = "user-profile",
    APPLICATION = "application"
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
        return onSnapshot(collection(this.firestore, COLLECTION.APPLICATION), collection => {
            let pendings: Array<PendingApplcation> = [];
            collection.forEach(application => pendings.push(Object.assign({ id: application.id }, application.data() as { name: string, email: string })));
            callback(pendings)
        })
    }

    async removePendingAccount(id: string) {
        await deleteDoc(doc(this.firestore, COLLECTION.APPLICATION, id));
    }

    async checkNewAccount(email: string) {
        return !(await getDoc(doc(this.firestore, COLLECTION.USER_PROFILE, email))).exists();
    }

    async updateUserProfile(profile: { email: string, name: string }) {
        await setDoc(doc(this.firestore, COLLECTION.USER_PROFILE, profile.email), {
            name: profile.name,
            email: profile.email
        })
    }

    onCategoryUpdate(onUpdate: (categories: Array<Category>) => void) {
        return onSnapshot(collection(this.firestore, COLLECTION.CATEGORY).withConverter(categoryConverter), cats => {
            let categories: Array<Category> = [];
            cats.forEach(cat => categories.push(cat.data()));
            cats.docChanges().forEach(change => console.log(change.type, change.doc.data()));
            onUpdate(categories);
        })
    }
    //
    // async getCategories() {
    //     let categories: Array<any> = [];
    //     await getDocs(collection(this.firestore, COLLECTION.CATEGORY).withConverter(categoryConverter)).then(cats => cats.forEach(cat => {
    //         categories.push(cat.data());
    //     }));
    //     return categories;
    // }

    // async getOptions(categoryId: string) {
    //     let options: Array<Option> = [];
    //     await getDocs(collection(this.firestore, COLLECTION.CATEGORY, categoryId, "Options").withConverter(optionConverter))
    //         .then(opts => opts.forEach(
    //             opt => options.push(opt.data())
    //         ));
    //     return options;
    // }

    async addCategory(categoryLabel: string) {
        if (!(await getDocs(query(collection(this.firestore, COLLECTION.CATEGORY),where("title", "==", categoryLabel)))).empty) {
            console.warn("label exists");
            return;
        }
        let obj = {
            id: "",
            title: categoryLabel
        }
        await addDoc(collection(this.firestore, COLLECTION.CATEGORY).withConverter(categoryConverter), obj);
    }

    onOptionUpdate(categoryId: string, onUpdate: (options: Array<Option>) => void) {
        return onSnapshot(collection(this.firestore, COLLECTION.CATEGORY, categoryId, "Options").withConverter(optionConverter), opts => {
            let options: Array<Option> = [];
            opts.forEach(opt => options.push(opt.data()));
            onUpdate(options);
        })
    }

    async addOption(categoryId: string, optionLabel: string, choices?: Array<string>) {
        if (!(await getDocs(query(collection(this.firestore, COLLECTION.CATEGORY, categoryId, "Options"),where("title", "==", optionLabel)))).empty) {
            console.warn("label exists");
            return;
        }
        let obj = {
            id: "",
            title: optionLabel,
            isChoices: choices !== undefined,
            choices: choices
        }
        !obj.isChoices && delete obj.choices;
        await addDoc(collection(this.firestore, COLLECTION.CATEGORY, categoryId, "Options").withConverter(optionConverter), obj);

    }

    async deleteOption(categoryId: string, optionId: string) {
        await deleteDoc(doc(this.firestore, COLLECTION.CATEGORY, categoryId, "Options", optionId))
    }
}
