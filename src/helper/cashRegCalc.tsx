
export const cashRegCalc = ({
    total_price = 0,
    pay_total_price = 0,
    clint_value = [],
    discount = 0,
}:
    {
        total_price?: any,
        pay_total_price?: any,
        clint_value?: any,
        discount?: any,
    }) => {
    let discount_price = discount as any;
    let clintTotalPrice = clint_value?.filter((item: any) => item?.is_active)?.reduce((a: any, b: any) => a + (b?.qty ?? 1) * (b?.price ?? 0), 0)
    if (discount <= 100) {
        discount_price = (total_price / 100 * discount)
    }
    let resultPrice = (clintTotalPrice - discount) - pay_total_price
    return {
        discount_price: discount_price,
        pay_total_price: resultPrice,
        total_price: clintTotalPrice,
        current_total_price: clintTotalPrice - discount
    }

}

export const cashRegTotalPrice = (clientValue: any) => {
    return clientValue?.filter((item: any) => +item?.is_active)?.reduce((a: any, b: any) => a + (b?.qty ?? 1) * (b?.price ?? 0), 0)
}
export const debtRegTotalPrice = (clientValue: any) => {
    return clientValue?.filter((item: any) => +item?.is_active)?.reduce((a: any, b: any) => a + (b?.qty ?? 1) * (b?.price ?? 0) - b?.pay_price, 0)
}


export const cashRegDiscount = (totalPrice: any, discount: any) => {
    if (discount <= 100) {
        return ((totalPrice / 100) * discount)
    }
    return discount
}


export const cashRegCurrentDiscout = (clientValue: any, discount: any) => {
    let totalPrice = cashRegTotalPrice(clientValue);
    if (discount <= 100) {
        return ((totalPrice / 100) * discount)
    }
    return discount
}

export const cashRegCurrentDebt = (clientValue: any, discount: any, debt: any) => {
    if (debt == 0) return 0
    let totalPrice = cashRegTotalPrice(clientValue);
    if (discount <= 100) {
        return totalPrice - ((totalPrice / 100) * discount) - debt
    }
    return totalPrice - discount - debt
}
export const cashRegDebt = (totalPrice: any, payTotalPrice: any) => {
    return totalPrice - payTotalPrice
}
export const cashRegCurrontPrice = (clientValue: any, discount: any, pay_total_price: any) => {
    let totalPrice = cashRegTotalPrice(clientValue);
    let discountPrice = cashRegDiscount(totalPrice, discount);
    return (totalPrice - discountPrice) - pay_total_price

}


export const cashRegStatus = (discount = 0, debt = 0, pay_type = 0) => {
    if (discount > 0 && debt > 0 && pay_type < 4) return 1  //// diskaunt bolganda ,qarz bolganda 
}


// chegirmani polni hisoblash
export const cashRegDiscountFun = (totalPrice: any, discount: any) => {
    if (discount <= 100) {
        return totalPrice - ((totalPrice / 100) * discount)
    }
    return totalPrice- discount
}