import { createContext } from "react";
import { User } from "../type";

export const SetModalContext = createContext<(modal?: JSX.Element) => void>(() => {});
export const SetUserInfoContext = createContext<(userInfo?: User) => void>(() => {});
export const UserInfoContext = createContext<User | undefined>(undefined);
