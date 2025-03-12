export const formatId = (num: any): string => {
    return `1${num?.toString()?.padStart(5, '0')}`; // 6 ta uzunlikka yetkazadi, oldiga '0' qo'shadi
};