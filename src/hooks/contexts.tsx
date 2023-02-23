import { createContext } from "react";
import { User } from "../type";

export const SetModalContext = createContext<(modal?: JSX.Element) => void>(() => {});
export const UserInfoContext = createContext<[User | undefined, (userInfo?: User) => void]>([undefined, () => {}]);
