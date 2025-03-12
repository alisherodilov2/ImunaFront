
export const query = (data = {} as any, hidden?: any) => {

    let res = '?';
    for (let key in data) {
        if ((typeof data[key] === 'number' || typeof data[key] === 'string') && !hidden?.find((item: any) => item == key) &&(data[key] as string).length > 0) res += `&${key}=${data[key]}`;
    }
    return res;
}

export const queryObj = (data = {} as any, hidden?: any) => {

    let res = {} as any;
    for (let key in data) {
        if ((typeof data[key] === 'number' || typeof data[key] === 'string') && !hidden?.find((item: any) => item == key) && (data[key] as string).length> 0) res  = {
            ...res,
            [key]: data[key]
        };
    }
    return res;
}
