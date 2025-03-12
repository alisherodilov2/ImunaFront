
const currentPrice = (data?: any) => {
    const { product_sell_type, old_price, price_sell } = data

    if (product_sell_type == 0 || product_sell_type == false) {

        return +old_price + +price_sell
    } else if (product_sell_type == 1 || product_sell_type == false) {
        return +old_price + (old_price / 100) * price_sell
    } else {
        return 0
    }
}

export default currentPrice