import { useSelector } from "react-redux";
import { ReducerType } from "../../interface/interface";

export const userRole = (role: string) => {
    if (role == 'admin') {
        return true
    }
    return false
}

