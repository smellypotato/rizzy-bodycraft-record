import { QueryDocumentSnapshot } from "firebase/firestore";

export type PendingApplcation = {
    id: string,
    name: string,
    email: string
    // apply_date:
}

export type Option = {
    id: string,
    title: string,
    isChoices: boolean,
    choices?: Array<string>
}
export type Category = {
    id: string,
    title: string,
    types: Array<string>
}

export const categoryConverter = {
    toFirestore: (category: Category) => { return { title: category.title, types: category.types } },
    fromFirestore: (snapshot: QueryDocumentSnapshot): Category => {
        type subCategory = {
            title: string;
            types: Array<string>,
        }
        const data = snapshot.data() as subCategory;
        const obj = Object.assign({ id: snapshot.id }, data);
        return obj;
    }
}

export const optionConverter = {
    toFirestore: (option: Option) => {
        let obj = {
            title: option.title,
            isChoices: option.isChoices,
            choices: option.choices
        };
        if (!obj.isChoices) delete obj.choices;
        return obj;
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot): Option => {
        type subOption = {
            title: string,
            isChoices: boolean,
            choices?: Array<string>
        }
        const data = snapshot.data() as subOption;
        const obj = Object.assign({ id: snapshot.id }, data);
        if (!obj.isChoices) delete obj.choices;
        return obj;
    }
}
