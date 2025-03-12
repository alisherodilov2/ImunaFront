import { useSelector } from "react-redux";

export const userRole = (role: string) => {
    if (role == 'admin') {
        return true
    }
    return false
}

