import { createContext } from "react";

export const SetLoggedInContext = createContext<(loggedIn: boolean) => void>(() => {});
