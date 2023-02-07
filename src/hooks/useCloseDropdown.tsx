import { useEffect } from "react";

export const useCloseDropdown = (closeDropdown: () => void, dependency: any) => {
    return useEffect(() => {
        if (dependency) window.addEventListener("click", closeDropdown);

        return () => window.removeEventListener("click", closeDropdown);
    }, [dependency])
}
