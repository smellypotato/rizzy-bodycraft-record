import { QueryDocumentSnapshot, Timestamp } from "firebase/firestore";

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
export type Record = {
    id: string,
    userId: string,
    categoryId: string,
    type: string,
    date: Date,
    options: Array<Array<{ optionId: string, value: string }>>
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

export const recordConverter = {
    toFirestore: (record: Record) => {
        const obj = {
            id: "",
            userId: record.userId,
            categoryId: record.categoryId,
            type: record.type,
            date: record.date,
            options: record.options.map(opt => { return { record: opt }})
        }
        return obj
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot): Record => {
        type subRecord = {
            userId: string,
            categoryId: string,
            type: string,
            date: Timestamp,
            options: Array<{ record: Array<{ optionId: string, value: string }> }>
        }
        const data = snapshot.data() as subRecord;
        const obj: Record = Object.assign({ id: snapshot.id }, data, { date: data.date.toDate(), options: data.options.map(option => option.record ) });
        return obj;
    }
}
