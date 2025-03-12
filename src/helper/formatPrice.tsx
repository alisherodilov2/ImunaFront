

export const formatPrice = (inputValue: string) => {
    // const numericValue = inputValue?.replace(/[^0-9.]/g, '');
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        // currencyDisplay: 'symbol',
        // minimumFractionDigits: 0,
        // minimumFractionDigits: 2,
        // maximumFractionDigits: 4,
        useGrouping: true
    }).format(Number(inputValue));

    return formattedPrice;
};