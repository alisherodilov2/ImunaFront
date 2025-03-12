import { date } from "./date";

// export const dedlineGenerate = ({ dedline_type = 'day', dedline_quantity = 1, target_date = '' }: { dedline_type?: string, dedline_quantity?: number, target_date?: string }) => {
//     const dateAdd = (type: string, target_date: string, count: number) => {
//         switch (type) {
//             case 'day':
//                 {
//                     let currentDate = new Date(target_date);
//                     let currentDay = currentDate.getDate();
//                     currentDate.setDate(currentDay + count);
//                     return date(currentDate.toDateString());
//                 }
//             case 'month':
//                 {
//                     let currentDate = new Date(target_date);
//                     let currentMonth = currentDate.getMonth();
//                     currentDate.setMonth(currentMonth + count);
//                     return date(currentDate.toDateString());
//                 }
//             case 'year':
//                 {
//                     let currentDate = new Date(target_date);
//                     let currentYear = currentDate.getDate();
//                     currentDate.setFullYear(currentYear + count);
//                     return date(currentDate.toDateString());
//                 }

//             default:
//                 {
//                     return date();
//                 }
//         }
//     }
//     let result = [];
//     for (let i = 0; i < dedline_quantity; i++) {
//         result.push(dateAdd(dedline_type, target_date, i))
//     }
//     return result
// }
export const dateAdd = (type: string, target_date: string, count: number) => {
    switch (type) {
        case 'day':
            {
                let currentDate = new Date(target_date);
                let currentDay = currentDate.getDate();
                currentDate.setDate(currentDay + count);
                return date(currentDate.toDateString());
            }
        case 'month':
            {
                let currentDate = new Date(target_date);
                let currentMonth = currentDate.getMonth();
                currentDate.setMonth(currentMonth + count);
                return date(currentDate.toDateString());
            }
        case 'year':
            {
                let currentDate = new Date(target_date);
                let currentYear = currentDate.getDate();
                currentDate.setFullYear(currentYear + count);
                return date(currentDate.toDateString());
            }

        default:
            {
                return date();
            }
    }
}

function groupElementsByTarget(data: any, target: any) {
    let result = [];
    let currentGroup = [];

    for (let value of data) {
        if (value === target) {
            // Start a new group with a single element
            result.push([value]);
            currentGroup = [];
        } else if (currentGroup.reduce((sum, num) => sum + num, 0) + value <= target) {
            // Add the current value to the current group if it doesn't exceed the target
            currentGroup.push(value);
        } else {
            // Start a new group if adding the current value exceeds the target
            result.push(currentGroup);
            currentGroup = [value];
        }
    }

    // Add the last group to the result
    if (currentGroup.length > 0) {
        result.push(currentGroup);
    }

    return result;
}
// export const priceSlice = ({ price = 0, data }: { price: number, data: any[] }) => {
//     const result: { count: number, data: any[] }[] = [];
//     let priceCount = 1;
//     let currentGroup: any[] = [];

//     for (let i = 0; i < data?.length; i++) {
//         const currentItem = data.at(i);
//         const totalPrice = [...currentGroup,data?.at(i)].reduce((acc, item) => acc + +item?.total_price, 0);

//         if (price == currentItem?.total_price && currentGroup?.length 
//             == 0) {
//             result.push({ count: priceCount, data: [...currentGroup, currentItem] });
//             currentGroup = [];
//             priceCount = 1;
//         } else if (price * priceCount == totalPrice) {
//             result.push({ count: priceCount, data: [...currentGroup, currentItem] });
//             currentGroup = [];
//             priceCount = 1;
//         } else if (i == data.length - 1) {
//             result.push({ count: Math.ceil((totalPrice) / price), data: [...currentGroup, currentItem] });
//             currentGroup = [];
//         } else if (price * priceCount < totalPrice + currentItem?.total_price) {
//             priceCount++;
//             currentGroup = [...currentGroup, currentItem];
//         } else {
//             currentGroup.push(currentItem);
//         }
//     }

//     return Array(10).fill(null).flatMap((_, index) => (result?.at(index) || { count: 1, data: [] })?.count > 1
//         ? Array(result?.at(index)?.count).fill(null).map((_, indexI) => indexI == 0
//             ? (result?.at(index) || { count: 1, data: [] })
//             : { count: 0, data: [] })
//         : (result?.at(index) || { count: 1, data: [] })).slice(0, 10);
// }
export const priceSlice = ({ price = 0, data, dedline = 0 }: { price: number, data: any, dedline?: number }) => {
    let result = [] as any, priceCount = 1, allPrice = [] as any, target = 1;
    for (let i = 0; i < data?.length; i++) {
        if (price == data?.at(i)?.total_price && allPrice?.length == 0) {
            result.push({
                count: priceCount,
                data: [...allPrice, data.at(i)]
            })
            allPrice = []
            priceCount = 1;

        } else
            if (price * priceCount == [...allPrice, data.at(i)].reduce((a: any, b: any) => a + +b?.total_price, 0)) {
                result.push({
                    count: priceCount,
                    data: [...allPrice, data.at(i)]
                })
                allPrice = []
                priceCount = 1;
            }

            else if (i == data?.length - 1) {
                result.push({
                    count: Math.ceil([...allPrice, data.at(i)].reduce((a: any, b: any) => a + +b?.total_price, 0) / (price)),
                    data: [...allPrice, data.at(i)]
                })

            }
            else if (price * priceCount < [...allPrice, data.at(i)].reduce((a: any, b: any) => a + +b?.total_price, 0)) {
                priceCount = priceCount + 1
                allPrice = [...allPrice, data?.at(i)]

            }

            else {
                allPrice.push(data.at(i))

            }

    }

    return Array(+dedline).fill(null).flatMap((_, index) => (result?.at(index) || { count: 1, data: [] })?.count > 1 ? Array(result?.at(index)?.count).fill(null).map((test: any, indexI: any) => indexI == 0 ? (result?.at(index) || { count: 1, data: [] }) : { count: 0, data: [] }) : (result?.at(index) || { count: 1, data: [] })).slice(0, +dedline);
}