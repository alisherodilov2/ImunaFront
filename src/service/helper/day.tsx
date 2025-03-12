export const day = (text: string) => {
    switch (text) {
        case 'odd':
            return 'Toq kunlar'
        case 'do_not_odd':
            return 'Juft kunlar'
        case 'no_limit':
            return 'Har kuni'
        default:
            return null;
    }
}

export const dayData = [
    {
        key: 'odd',
        title: 'Toq kunlar'
    },
    {
        key: 'do_not_odd',
        title: 'juft kunlar'
    },
    {
        key: 'no_limit',
        title: 'har kuni'
    }
]


export const dateFormat = (date: any, smble = '-', type = true) => {
    let res = new Date(date);
    if (type) {
        return `${res.getFullYear()}${smble}${(res.getMonth() + 1) <= 9 ? '0' + (res.getMonth() + 1) : (res.getMonth() + 1)}${smble}${res.getDate() <= 9 ? '0' + res.getDate() : res.getDate()}`
    }
    return `${res.getDate() <= 9 ? '0' + res.getDate() : res.getDate()}${smble}${(res.getMonth() + 1) <= 9 ? '0' + (res.getMonth() + 1) : (res.getMonth() + 1)}${smble}${res.getFullYear()}`
}


export const dateFormatSplit = (date: any,) => {
    return date?.split('T')?.[0]
}

