import { createContext } from "react";

export const SetLoggedInContext = createContext<(loggedIn: boolean) => void>(() => {});
export const SetModalContext = createContext<(modal?: JSX.Element) => void>(() => {});
