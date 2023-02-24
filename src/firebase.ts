import { FirebaseApp, FirebaseError, initializeApp } from "firebase/app";
import { Auth, createUserWithEmailAndPassword, EmailAuthProvider, getAdditionalUserInfo, getAuth, isSignInWithEmailLink, onAuthStateChanged, reauthenticateWithCredential, sendSignInLinkToEmail, signInWithEmailAndPassword, signInWithEmailLink, signOut, updatePassword, updateProfile, User, UserCredential } from "firebase/auth";
import { addDoc, collection, deleteDoc, deleteField, doc, DocumentChange, Firestore, getDoc, getDocs, getFirestore, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import { PendingApplcation, optionConverter, Option, categoryConverter, Category, recordConverter, Record, userProfileConverter, User as UserProfile } from "./type";
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
    APPLICATION = "application",
    RECORD = "record"
}

type Response = {
    success: boolean,
    message?: string
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

    async signup(email: string, password: string, name: string): Promise<Response> {
        return updatePassword(this.auth.currentUser!, password).then(() => {
            try {
                this.updateUserProfile({ id: this.auth.currentUser!.uid, email, name });
                this.login({ email, password });
                return { success: true, message: this.auth.currentUser!.uid };
            }
            catch (e) { return { success: false, message: (e as FirebaseError).code } };
        }).catch(e => { return { success: false, message: (e as FirebaseError).code} });
    }

    async login(args: { email: string, password?: string }): Promise<Response> {
        const { email, password } = args;
        if (email) {
            if (password !== undefined) {
                return signInWithEmailAndPassword(this.auth, email, password).then(credential => {
                    console.log(credential);
                    // this.addAdmin();
                    return { success: true }
                }).catch(e => {
                    // auth/too-many-requests
                    return { success: false, message: (e as FirebaseError).code}
                });
            } else {
                console.log(email);
                return signInWithEmailLink(this.auth, email, window.location.href).then(result => {
                    console.log(result);
                    return { success: true }
                }).catch(e => {
                    // auth/invalid-email
                    // auth/invalid-action-code when link used to login
                    return { success: false, message: (e as FirebaseError).code}
                })
            }
        }
        else return { success: false, message: "no email" };
    }

    async logout() {
        await signOut(Firebase.instance.auth);
    }

    onAuthStateChanged(callback: (user: User | null) => void) {
        return onAuthStateChanged(this.auth, user => callback(user));
    }

    async updatePassword(oldPassword: string, password: string): Promise<Response> {
        try { await reauthenticateWithCredential(this.auth.currentUser!, EmailAuthProvider.credential(this.auth.currentUser!.email!, oldPassword)) }
        catch (e) { return { success: false, message: (e as FirebaseError).code } }
        // auth/wrong-password

        return updatePassword(this.auth.currentUser!, password).then(() => {
            return { success: true }
        }).catch(e => { return { success: false, message: (e as FirebaseError).code } });
        // Uncaught (in promise) FirebaseError: Firebase: Password should be at least 6 characters (auth/weak-password).
        // Uncaught (in promise) FirebaseError: Firebase: Error (auth/requires-recent-login). => reauthenticateWithCredential

    }

    async approvePendingAccount(email: string) {
        const actionCodeSettings = {
            // URL you want to redirect back to. The domain (www.example.com) for this
            // URL must be in the authorized domains list in the Firebase Console.
            url: 'http://localhost:3000',
            handleCodeInApp: true
        };
        await sendSignInLinkToEmail(this.auth, email, actionCodeSettings);
    }

    isAnnoymousAccount() {
        return isSignInWithEmailLink(this.auth, window.location.href)
    }

    addAdmin() {
        updateProfile(this.auth.currentUser!, { displayName: "admin" });
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

    async updateUserProfile(profile: { id?: string, email?: string, name: string }): Promise<Response> {
        return setDoc(doc(this.firestore, COLLECTION.USER_PROFILE, profile.email || this.auth.currentUser!.email!).withConverter(userProfileConverter), {
            id: profile.id || this.auth.currentUser!.uid,
            name: profile.name,
            email: profile.email || this.auth.currentUser!.email
        }).then(() => { return { success: true } }).catch(e => { return { success: false, message: (e as FirebaseError).code } });
    }

    async getUserProfile(userId: string) {
        console.log(userId);
        let profiles = await getDocs(query(collection(this.firestore, COLLECTION.USER_PROFILE).withConverter(userProfileConverter), where("id", "==", userId)));
        return profiles.docs[0].data();
    }

    onCategoryUpdate(onUpdate: (categories: Array<Category>, update: Array<DocumentChange<Category>>) => void) {
        let unSubscribeCategoryUpdate = onSnapshot(collection(this.firestore, COLLECTION.CATEGORY).withConverter(categoryConverter), cats => {
            let categories: Array<Category> = [];
            cats.forEach(cat => categories.push(cat.data()));
            onUpdate(categories, cats.docChanges());
        })
        return unSubscribeCategoryUpdate;
    }

    async getCategories() {
        let categories: Array<Category> = [];
        await getDocs(collection(this.firestore, COLLECTION.CATEGORY).withConverter(categoryConverter)).then(cats => cats.forEach(cat => {
            categories.push(cat.data());
        }));
        return categories;
    }

    // async getOptions(categoryId: string) {
    //     let options: Array<Option> = [];
    //     await getDocs(collection(this.firestore, COLLECTION.CATEGORY, categoryId, "Options").withConverter(optionConverter))
    //         .then(opts => opts.forEach(
    //             opt => options.push(opt.data())
    //         ));
    //     return options;
    // }

    async addCategory(categoryLabel: string, subCategories: Array<string>) {
        if (!(await getDocs(query(collection(this.firestore, COLLECTION.CATEGORY), where("title", "==", categoryLabel)))).empty) {
            console.warn("label exists");
            return;
        }
        let obj = {
            id: "",
            title: categoryLabel,
            types: subCategories
        }
        await addDoc(collection(this.firestore, COLLECTION.CATEGORY).withConverter(categoryConverter), obj);
    }

    async deleteCategory(categoryId: string) {
        await getDocs(collection(this.firestore, COLLECTION.CATEGORY, categoryId, "Options"))
            .then(opts => opts.forEach(opt => deleteDoc(doc(this.firestore, COLLECTION.CATEGORY, categoryId, "Options", opt.id))));

        await deleteDoc(doc(this.firestore, COLLECTION.CATEGORY, categoryId))
    }

    async updateTypes(categoryId: string, types: Array<string>) {
        console.log(types);
        await updateDoc(doc(this.firestore, COLLECTION.CATEGORY, categoryId), {
            types
        })
    }

    onOptionUpdate(categoryId: string, onUpdate: (options: Array<Option>) => void) {
        return onSnapshot(collection(this.firestore, COLLECTION.CATEGORY, categoryId, "Options").withConverter(optionConverter), opts => {
            let options: Array<Option> = [];
            opts.forEach(opt => options.push(opt.data()));
            onUpdate(options);
        })
    }

    async addOption(categoryId: string, optionLabel: string, operation: "add" | "update", choices?: Array<string>) {
        let existedOption = await getDocs(query(collection(this.firestore, COLLECTION.CATEGORY, categoryId, "Options").withConverter(optionConverter), where("title", "==", optionLabel)));
        if (operation === "add" && !(existedOption).empty) {
            console.warn("label exists");
            return;
        }
        switch (operation) {
            case "add":
                let addObj = {
                    id: "",
                    title: optionLabel,
                    isChoices: choices !== undefined,
                    choices: choices
                }
                !addObj.isChoices && delete addObj.choices;
                await addDoc(collection(this.firestore, COLLECTION.CATEGORY, categoryId, "Options").withConverter(optionConverter), addObj);
            break;
            case "update":
                choices !== undefined && existedOption.forEach(async option => {
                    await this.updateChoices(categoryId, option.id, choices);
                })

            break;
        }
    }

    async deleteOption(categoryId: string, optionId: string) {
        await deleteDoc(doc(this.firestore, COLLECTION.CATEGORY, categoryId, "Options", optionId))
    }

    async updateChoices(categoryId: string, optionId: string, choices: Array<string>) {
        await updateDoc(doc(this.firestore, COLLECTION.CATEGORY, categoryId, "Options", optionId), {
            choices
        })
    }

    async submitRecord(categoryId: string, type: string, date: Date, record: Array<Array<{ optionId: string, value?: string }>>) {
        let obj = {
            userId: this.auth.currentUser!.uid,
            categoryId: categoryId,
            type: type,
            date: date,
            options: record
        }
        addDoc(collection(this.firestore, COLLECTION.RECORD).withConverter(recordConverter), obj);
    }

    async getRecord() {
        let records: Array<Record> = [];
        await getDocs(query(collection(this.firestore, COLLECTION.RECORD).withConverter(recordConverter), where("userId", "==", this.auth.currentUser!.uid))).then(rcs => rcs.forEach(record => {
            records.push(record.data());
        }));
        return records;
    }

}
