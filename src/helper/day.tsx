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

