import { QueryDocumentSnapshot, Timestamp } from "firebase/firestore";
export type User = {
    id: string,
    name: string,
    email: string,
    admin: boolean
}

export type PendingApplcation = {
    id: string,
    name: string,
    email: string
    apply_date: Date;
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
export const applicationConverter = {
    toFirestore: (application: PendingApplcation) => { return { email: application.email, name: application.name, apply_date: new Date() } },
    fromFirestore: (snapshot: QueryDocumentSnapshot): PendingApplcation => {
        type subPendingApplication = {
            email: string;
            name: string;
            apply_date: Date;
        }
        const data = snapshot.data() as subPendingApplication;
        const obj = Object.assign({ id: snapshot.id }, data);
        return obj;
    }
}
export const userProfileConverter = {
    toFirestore: (user: User) => { return { id: user.id, email: user.email, name: user.name } },
    fromFirestore: (snapshot: QueryDocumentSnapshot): { id: string, email: string, name: string } => {
        const data = snapshot.data() as { id: string, email: string, name: string };
        return data;
    }
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
