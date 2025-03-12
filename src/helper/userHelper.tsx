export const kounteragentCalcPriceTotal = (data:any)=>{
    let totalPrice = data?.price;
    if(data?.kounteragent_contribution_price<=100){
        return  ((totalPrice / 100) * data?.kounteragent_contribution_price);
    }
    return data?.kounteragent_contribution_price ?? 0
}