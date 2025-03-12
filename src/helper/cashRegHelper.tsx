export const jsonClintValueData = ({
    data = [],
    discount = 0,
    pay_total_price = 0
}: {
    data: any,
    discount: any,
    pay_total_price: any
}
) => {
    let currentDiscount = discount as any
    let totalPrice = data?.reduce((a: any, b: any) => a + (b?.qty ?? 1) * (b?.price ?? 0), 0);
    let splitDiscount = discount / data.length
    let payPrice = pay_total_price


    return data?.map((item: any) => {
        let pay_price = 0;
        if (item?.pay_price > 0 && (item?.price * (item?.qty ?? 1)) - (item?.pay_price + item?.discount) == 0) {
            pay_price = item?.pay_price
        } else {
            payPrice = payPrice - ((item?.price * (item?.qty ?? 1)) - splitDiscount)
            if (payPrice >= 0) {
                pay_price = item?.price * (item?.qty ?? 1)
            }
        }

        if (currentDiscount <= 100) {
            splitDiscount = (((item?.price * (item?.qty ?? 1)) / 100) * currentDiscount)
        }
        return {

            id: item?.id ?? 0,
            // client_id : item?.client_id ?? 0,
            service_id: item?.service_id ?? 0,
            is_active: item?.is_active ?? 0,
            discount: item?.discount,
            price: item?.price ?? 0,
            qty: item?.qty ?? 1,
            pay_price: pay_price
        }
    })


}




// jadval uchun
export const repotTable = (clientValue: any, discount: any, pay_total_price: any, debtErorr: any, defaultChegrima?: any) => {
    // let umumiysumma = clientValue?.reduce((a: any, b: any) => a + (+b?.is_active ? +b.total_price : 0), 0);
    // let chegirma = discount as any;
    // if (discount <= 100) {
    //     chegirma = ((umumiysumma / 100) * discount)
    // }
    // let tolangan = clientValue?.reduce((a: any, b: any) => a + (+b.pay_price), 0)
    // let qaytarilyapdi = clientValue?.reduce((a: any, b: any) => a + (+b?.is_active ? 0 : +b.pay_price), 0)
    // let bag = clientValue?.reduce((a: any, b: any) => a + (+b?.is_active && b.pay_price == 0 ? +b.total_price : 0), 0)
    // let tolanyapti = umumiysumma - chegirma - tolangan;
    // let loalganbag = clientValue?.reduce((a: any, b: any) => a + (!(+b?.is_active) && +b.pay_price > 0 ? +b.pay_price : 0), 0)
    // let qarz = 0;
    // if (pay_total_price > 0) {
    //     tolanyapti = pay_total_price
    //     if (umumiysumma - chegirma - tolangan > 0 && (umumiysumma - chegirma - tolangan) - pay_total_price > 0) {
    //         qarz = (umumiysumma - chegirma - tolangan) - pay_total_price
    //     }
    // }
    // if (debt > 0) {
    //     if (pay_total_price > 0) {
    //         tolanyapti = pay_total_price
    //     } else {
    //         tolanyapti = tolanyapti - debt
    //     }
    //     qarz = debt
    // }
    // if (defaultChegrima > 0) {
    //     if (tolanyapti < 0) {
    //         if (defaultChegrima > 0) {
    //             tolanyapti = -(Math.abs(tolanyapti) - defaultChegrima)
    //         }
    //     }
    //     if (defaultChegrima > 0) {
    //         tolangan = tolangan - defaultChegrima
    //         chegirma = defaultChegrima
    //     }
    // }
    // if (bag > 0 && umumiysumma <= tolangan) {
    //     tolanyapti = tolanyapti - bag
    // }
    // if (loalganbag > 0) {
    //     tolanyapti = -loalganbag
    // }
    // if (defaultChegrima > 0) {
    //     tolanyapti = tolanyapti + defaultChegrima
    // }

    // let qarzaniq = 0
    // // let qarzaniq = clientValue?.reduce((a: any, b: any) => a + (+b.is_active ? b.total_price - (+b.pay_price + chegirmaHisobla(b)) : 0 ), 0)
    // let tolanyotkan = clientValue?.reduce((a: any, b: any) => a + (+b.is_active ? +b.total_price - (+b.pay_price + chegirmaHisobla(b)) : 0), 0) as any;
    // let tolangananiq = clientValue?.reduce((a: any, b: any) => a + (+b.is_active ? 0 : +b.pay_price), 0) as any;
    // let atkaz = clientValue?.reduce((a: any, b: any) => a + (+b.is_active ? 0 : +b.pay_price), 0) as any
    // if (pay_total_price > 0) {
    //     if (clientValue?.reduce((a: any, b: any) => a + (+b.is_active ? +b.total_price - (+b.pay_price + chegirmaHisobla(b)) : 0), 0) as any - pay_total_price >= 0) {
    //         tolanyotkan = pay_total_price
    //         qarzaniq = clientValue?.reduce((a: any, b: any) => a + (+b.is_active ? +b.total_price - (+b.pay_price + chegirmaHisobla(b)) : 0), 0) as any - pay_total_price
    //     }
    // } else if (pay_total_price == 0) {
    //     qarzaniq = clientValue?.reduce((a: any, b: any) => a + (+b.is_active ? +b.total_price - (+b.pay_price + chegirmaHisobla(b)) : 0), 0) as any
    //     tolanyotkan = 0
    // }

    // // if(debt>0 &&  pay_total_price==0){
    // //     tolanyotkan = 0
    // //     qarzaniq = debt
    // // }
    // // else if(debt>0 &&  pay_total_price<=debt){
    // // //     qarzaniq = tolanyotkan
    // // //     tolanyotkan = 0
    // // // }

    // if (atkaz > 0) {
    //     if (clientValue?.reduce((a: any, b: any) => a + (+b.is_active ? +b.total_price - (+b.pay_price + chegirmaHisobla(b)) : 0), 0) as any > 0) {
    //         if (tolangananiq > 0) {

    //             tolanyotkan = -atkaz + clientValue?.reduce((a: any, b: any) => a + (+b.is_active ? +b.total_price - (+b.pay_price - chegirmaHisobla(b)) : 0), 0) - tolangananiq
    //         } else {

    //             tolanyotkan = -atkaz + clientValue?.reduce((a: any, b: any) => a + (+b.is_active ? +b.total_price - (+b.pay_price - chegirmaHisobla(b)) : 0), 0) as any
    //         }
    //     } else {

    //         tolanyotkan = -atkaz
    //     }
    // }

    let chegirmaaniq = clientValue?.reduce((a: any, b: any) => a + (+b?.is_active ? chegirmaHisobla(b) : 0), 0)

    let jami1 = clientValue?.reduce((a: any, b: any) => a + (+b.is_active ? +b.total_price : 0), 0) as any
    let jami = clientValue?.reduce((a: any, b: any) => a + (+b.is_active ? +b.total_price - (chegirmaHisobla(b)) : 0), 0) as any
    let toladi = clientValue?.reduce((a: any, b: any) => a + +b.pay_price, 0) as any
    let qarzianiq = clientValue?.reduce((a: any, b: any) => a + b.is_active ? 0 : +b.total_price - (+b.pay_price + chegirmaHisobla(b)), 0) as any
    let tolashkerak = clientValue?.reduce((a: any, b: any) => a + b.is_active ? +b.total_price - (chegirmaHisobla(b)) : 0, 0) as any

    let tolanyotkantpchni = jami - toladi;
    //  qarzianiq > 0 ? -(qarzianiq - jami) :
    // if(jami==toladi){
    //     tolanyotkantpchni = 0
    // }
    // if(toladi>jami){
    //     tolanyotkantpchni = -(toladi - jami)
    // }
    // if(jami==0 ){
    //     tolanyotkantpchni =  - toladi
    // }
    if (pay_total_price > 0) {
        tolanyotkantpchni = pay_total_price
    }



    let qarrcha = ((pay_total_price == 0) ? jami - toladi : jami - toladi - pay_total_price)

    return {
        total_price: jami1,/// umumiy
        discount: chegirmaaniq,///chegirma
        tolanyotkan: !debtErorr && pay_total_price == 0 ? tolanyotkantpchni : pay_total_price, ///tolanyotkan
        debt: !debtErorr && pay_total_price == 0 ? 0 : qarrcha,
        old_pay_total_price: toladi,///tolangan
        // tolanyotkan:pay_total_price >0 ?pay_total_price  :  debt==0 ? tolanyotkan  - payPrice : 0, ///tolanyotkan
    }
}

// tolayorkan
export const totalCalc = (data: any) => {
    return (data?.qty ?? 1) * data?.price
}
export const tolanyotkan = (clientValue: any, pay_total_price: any, tolov?: any) => {
    let jami1 = clientValue?.reduce((a: any, b: any) => a + (+b.is_active ? +totalCalc(b) : 0), 0) as any
    let jami = clientValue?.reduce((a: any, b: any) => a + (+b.is_active ? totalCalc(b) - (chegirmaHisobla(b)) : 0), 0) as any
    let toladi = clientValue?.reduce((a: any, b: any) => a + +b.pay_price, 0) as any

    let tolanyotkantpchni = jami - toladi;
    if (tolov) {
        return tolanyotkantpchni
    }
    if (pay_total_price > 0) {
        tolanyotkantpchni = pay_total_price
    }
    return pay_total_price == 0 ? tolanyotkantpchni : pay_total_price
}

export const qarzi = (clientValue: any, pay_total_price: any, isBalance?: boolean, balance?: any, show?: boolean, qarzKorsatish?: boolean) => {
    let jami1 = clientValue?.reduce((a: any, b: any) => a + (+b.is_active ? +totalCalc(b) : 0), 0) as any
    let jami = clientValue?.reduce((a: any, b: any) => a + (+b.is_active ? +totalCalc(b) - (chegirmaHisobla(b)) : 0), 0) as any
    let toladi = clientValue?.reduce((a: any, b: any) => a + +b.pay_price, 0) as any
    let tolanyotkantpchni = jami - toladi;
    if (pay_total_price > 0) {
        tolanyotkantpchni = pay_total_price
    }
    let qarrcha = ((pay_total_price == 0) ? jami - toladi : (jami - toladi - pay_total_price) > 0 ? jami - toladi - pay_total_price : isBalance ? Math.abs(jami - toladi - pay_total_price) : 0)
    if (isBalance) {
        let qarz = jami - toladi;
        if (pay_total_price < 0) {
            return balance
        }
        if (show && balance > 0 && qarz > 0) {
            if (qarzKorsatish) {
                return jami - toladi > 0 ? ((qarz - balance) > 0 ? ((qarz - balance) - qarrcha > 0 ? (qarz - balance) - qarrcha : qarz - balance) : 0) : pay_total_price
            }
            if (pay_total_price >= qarz) {
                return balance > qarz ? qarz : balance
            }
            return balance > pay_total_price ? pay_total_price : balance


        }
        let res = qarz >= pay_total_price ? (balance > pay_total_price ? +(balance ?? 0) - pay_total_price : 0) : qarrcha + +(balance ?? 0)
        return res > 0 ? res : 0
    }

    return qarrcha
}
export const chegirma = (clientValue: any) => {
    return clientValue?.reduce((a: any, b: any) => a + (+b.is_active ? (chegirmaHisobla(b)) : 0), 0) as any
}

const balanceFun = (balance: any, extraBalans: any, qarz: any) => {
    if (qarz == 0) {

    }
    // if(qarzi)

    // return (data?.balance)
}

export const chegirmaHisobla = (data: any) => {
    if (+data?.discount <= 100) {
        return +(((totalCalc(data)) / 100) * (data?.discount ?? 0))
    }
    return +data?.discount
}

export const chegirmaTaqsimlash = (data: any, discount: any, validate?: any) => {
    let chegirmayuqdat = data?.filter((e: any) => !e.is_pay && e.is_discount)
    let jami = chegirmayuqdat?.reduce((a: any, b: any) => a + +totalCalc(b), 0) as any
    if (discount <= 100) {

        return data?.map((res: any) => {
            return {
                ...res,
                discount: chegirmayuqdat?.find((e: any) => e.id == res.id) ? discount : res.discount
            }
        })
    } else {
        // let chegirma  =discount;
        // let result =  chegirmayuqdat?.map((res: any) => {
        //     let chekChegirma = chegirma - res?.total_price
        //     if(chekChegirma<0 && chegirma>0){
        //         chekChegirma = chegirma
        //         chegirma = 0
        //     }else  if(chekChegirma>=0){
        //         chegirma = chegirma - res?.total_price
        //     }
        //     return {
        //         ...res,
        //         discount: chekChegirma
        //     }
        // })
        // if(validate){
        //     if(chegirma>0){
        //         return false
        //     }
        //     return true
        // }
        // return result

        let allDiscount = discount;

        let chegiramfoiz = (discount / jami) * 100
        let chegirmaaniq = chegiramfoiz
        let qoldiq = 0;
        if (isFloat(chegiramfoiz)) {
            chegirmaaniq = Math.floor(chegiramfoiz);
        }
        qoldiq = chegiramfoiz - chegirmaaniq
        let resChegirmadata = [] as any
        // (totalCalc(res) * chegiramfoiz) / 100
        let qoldiqsummlar = 0;
        return data?.map((res: any) => {
            let find = chegirmayuqdat?.find((e: any) => e.id == res.id)
            if (find) {
                let chegirmasummasi = ((totalCalc(res) * chegiramfoiz) / 100);
                if (chegirmasummasi % 1000 > 500) {
                    chegirmasummasi = chegirmasummasi - (chegirmasummasi % 1000) + 1000
                } else {
                    chegirmasummasi = chegirmasummasi - (chegirmasummasi % 1000)
                }
                let qoldiqsumma = chegirmasummasi % 1000
                qoldiqsummlar = qoldiqsummlar + qoldiqsumma
                return {
                    ...res,
                    discount: chegirmasummasi
                    // discount: chegirmayuqdat?.find((e: any) => e.id == res.id) ? (chegirmayuqdat?.at(-1)?.id == res.id ? (totalCalc(res) * chegirmaaniq + qoldiq) / 100 : (totalCalc(res) * chegirmaaniq) / 100) : res.discount


                }
            }
            return res
        })
        // let chegirma = discount / chegirmayuqdat.length;
        // if (isFloat(chegirma)) {
        //     chegirma = Math.floor(chegirma);
        // }
        // let oxirgisumma = discount - (chegirma * chegirmayuqdat.length)
        // return data?.map((res: any) => {
        //     return {
        //         ...res,
        //         discount: chegirmayuqdat?.find((e: any) => e.id == res.id) ? (chegirmayuqdat?.at(-1)?.id == res.id ? oxirgisumma + chegirma : chegirma) : res.discount
        //     }
        // })
    }


}
function isFloat(num: any) {
    return num % 1 !== 0;
}