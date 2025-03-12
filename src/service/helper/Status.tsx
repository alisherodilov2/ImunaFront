export const status = (text: string) => {
    switch (text) {
        case 'day':
            return 'Kunlik'
        case 'month':
            return 'Oylik'
        default:
            return null;
    }
}

export const statusData = [
    {
        key: 'month',
        title: 'Oylik'
    },
]