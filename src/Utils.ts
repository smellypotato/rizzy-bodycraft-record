export class Utils {
    static newArray = (length: number) => {
        return Array.from(Array(length).keys());
    }

    static daysInYear = (year: number) => {
        return (new Date(year + 1, 0, 1).getTime() - new Date(year, 0, 1).getTime()) / 1000 / 60 / 60 / 24;
    }

    static weeksInMonth = (year: number, month: number) => {
        return Math.ceil((new Date(year, month, 1).getDay() + new Date(year, month + 1, 0).getDate()) / 7);
    }
}
