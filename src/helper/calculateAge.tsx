import { dateFormat } from "../service/helper/day";

export function calculateAge(birthDate: any, CurrentDate: any) {
    // Tug'ilgan sana (birthDate) string formatida kiritiladi (masalan, "1990-01-15")
    const birth = new Date(dateFormat(birthDate));
    const today = new Date(dateFormat(CurrentDate));

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    // Agar tug'ilgan oy hali o'tmagan bo'lsa yoki ayni oyda bo'lib, tug'ilgan kun hali kelmagan bo'lsa, yoshi bir yil kamayadi
   

    return age;
}


