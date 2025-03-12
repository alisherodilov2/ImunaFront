export const date = (date: any) => {
    let res = new Date(date);
    return `${res.getFullYear()}-${(res.getMonth() + 1) <= 9 ? '0' + (res.getMonth() + 1) : (res.getMonth() + 1)}-${res.getDate() <= 9 ? '0' + res.getDate() : res.getDate()}`
}