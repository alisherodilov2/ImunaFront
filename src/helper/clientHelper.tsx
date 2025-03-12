import { date } from "yup";
import { dateFormat } from "../service/helper/day";

export const getUniqueDepartments = (services: any) => {
  const uniqueDepartments: { [key: string]: any } = {};

  services.forEach((service: any) => {
    const departmentName = service.data.department.name;

    if (!uniqueDepartments[departmentName]) {
      uniqueDepartments[departmentName] = service.data.department;
    }
  });

  return Object.values(uniqueDepartments);
};

export function serviceGroupBy(items: any, key: 'department' | 'name') {
  return items.reduce((acc: any, item: any) => {
    const groupKey = item.department[key];
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {} as any);
}


export function groupAndLimitServices(data: any, limit: number, start: number) {
  const servicetype = [...new Set(data.map((item: any) => item.servicetype.type))]
  let result = [] as any, count = 0;
  for (let i = 0; i < servicetype.length; i++) {
    const group = data.filter((item: any) => item.servicetype.type === servicetype[i])
    let itemsCount = result?.reduce((a: any, b: any) => a + b.items.length, 0)
    if (limit == 0) {
      if (count + group.length < start) {
        count = count + group.length
      } else {
        if (count >= start) {
          result = [...result, {
            type: servicetype[i],
            items: group
          }]
        } else {
          let l = start - count
          let m = group.slice(start - count);
          count = count + m.length
          if (m.length > 0) {
            result = [...result, {
              type: servicetype[i],
              items: m
            }]
          }
        }

      }
    }
    else {

      if (itemsCount == limit) {
        break
      } else
        if (group.length + itemsCount <= limit) {
          result = [...result, {
            type: servicetype[i],
            items: group
          }]
        } else {
          if (group.length > 0) {
            result = [...result, {
              type: servicetype[i],
              items: group.slice(0, limit - itemsCount)
            }]
          }
        }
    }
  }
  return result


}


// queue_number_limit has function unique
export const regDepartmentUnique = (data: any) => {
  if (data?.length > 0) {
    let result = [] as any

    for (let key of data?.filter((item: any) => +item?.data?.department?.queue_number_limit > 0 && !item?.data?.department?.is_reg_time)) {
      if (!result?.find((item: any) => item?.data?.department?.id == key?.data?.department?.id)) {
        result.push(key)
      }
    }
    return result
  }
  return []
}

export const grapAchiveStatus = (data: any) => {
  switch (data?.status) {
    case 'archive':

      return 'Arxivlangan';
    case 'finish':

      return 'Yakunlangan';

    default:
      return 'Muolajada';
  }
}


// navbat sortlash
export const sortNavbat = (data: any, letter?: any, is_queue_number?: any) => {
  if (data?.length > 0) {
    return [...data]


      ?.sort((a: any, b: any) => {
        let targetA = a?.client_item?.at(0);
        // let targetA = [...new Set(a?.client_item?.map((item: any) => dateFormat(item?.created_at)))]?.at(0) as any;
        // let clientTime = 
        let clintValueA = a?.client_item

          ?.filter((res: any) => Date.parse(dateFormat(res?.created_at)) == Date.parse(dateFormat(targetA.created_at)))
          ?.flatMap((item: any) => item?.client_value)
          // ?.at(0)
          // ?.client_value
          ?.find((item: any) => +item?.service?.department?.is_queue_number) as any;
        if (is_queue_number) {
          clintValueA = a?.client_item
            ?.filter((res: any) => Date.parse(dateFormat(res?.created_at)) == Date.parse(dateFormat(targetA.created_at)))?.flatMap((item: any) => item?.client_value)?.at(0)
        }
        let targetB = b?.client_item?.at(0);
        // let targetB = [...new Set(b?.client_item?.map((item: any) => dateFormat(item?.created_at)))]?.at(0) as any;;
        let clintValueB = b?.client_item

          ?.filter((res: any) => Date.parse(dateFormat(res?.created_at)) == Date.parse(dateFormat(targetB.created_at)))
          ?.flatMap((item: any) => item?.client_value)
          // ?.at(0)
          // ?.client_value
          ?.find((item: any) => +item?.service?.department?.is_queue_number) as any;

        if (is_queue_number) {
          clintValueB = b?.client_item
            ?.filter((res: any) => Date.parse(dateFormat(res?.created_at)) == Date.parse(dateFormat(targetA.created_at)))?.flatMap((item: any) => item?.client_value)?.at(0)
        }
        // const textComparison = textA.localeCompare(textB);
        // if (textComparison === 0) {
        //   // Agar matn bir xil bo'lsa, raqam bo‘yicha tartiblash
        //   // return parseInt(numA, 10) - parseInt(numB, 10);
        // }
        if (letter) {
          if (clintValueB?.service?.department?.letter.localeCompare(clintValueA?.service?.department?.letter) == 0) return parseInt(clintValueA?.queue_number) - parseInt(clintValueB?.queue_number);
          return clintValueB?.service?.department?.letter.localeCompare(clintValueA?.service?.department?.letter)
          // return b?.client_item?.at(-1)?.client_value?.find((item: any) => +item?.service?.department?.is_queue_number)?.service?.department?.letter.localeCompare(a?.client_item?.at(-1)?.client_value?.find((item: any) => +item?.service?.department?.is_queue_number)?.service?.department?.letter)
          // return b?.client_item?.at(0)?.service?.department?.client_value?.find((item: any) => +item?.service?.department?.is_queue_number)?.letter.localeCompare(a?.client_item?.at(0)?.service?.department?.client_value?.find((item: any) => +item?.service?.department?.is_queue_number)?.service?.department?.letter)
          // if (clintValueA?.service?.department?.letter < clintValueB?.service?.department?.letter) return -1;
          // if (clintValueA?.service?.department?.letter > clintValueB?.service?.department?.letter) return 1;
          // if (clintValueA?.service?.department?.letter < clintValueB?.service?.department?.letter) return -1;
          // if (clintValueA?.service?.department?.letter > clintValueB?.service?.department?.letter) return 1;
        }
        // if (+clintValueA?.service?.department?.is_reg_time || +clintValueB?.service?.department?.is_reg_time) return 0;
        return (clintValueA?.queue_number) - (clintValueB?.queue_number);
        // if (clintValueA?.queue_number < clintValueB?.queue_number) return -1;
        // if (clintValueA?.queue_number > clintValueB?.queue_number) return 1;


      })
  }
  return []
}


export const navbatGet = (clientValue: any, clientTime: any, firstQueue: any, department?: any) => {

  const dep = clientValue?.filter((res: any) => !new Set(clientTime?.map((item: any) => item?.department_id)).has(res?.service?.department?.id))
    ?.filter((res: any) => department?.value > 0 ? res?.service?.department?.id == department?.value : true)

  let navbat = [] as any;
  for (let item of dep) {
    let res = `${item?.service?.department?.letter} - ${item?.queue_number}`
    if (res != firstQueue) navbat.push(res)
  }
  for (let item of clientTime?.filter((res: any) => department?.value > 0 ? res?.service?.department?.id == department?.value : true)) {
    let res = `${item?.department?.letter} - ${item?.agreement_time}`
    if (res != firstQueue) navbat.push(res)
  }
  if (firstQueue?.length > 0) navbat = [firstQueue, ...navbat]
  return [...new Set(navbat)]
}
export const navbatGetOld = (clientValue: any, clientTime: any, firstQueue: any, department?: any) => {

  const dep = clientValue?.filter((res: any) => !new Set(clientTime?.map((item: any) => item?.department_id)).has(res?.service?.department?.id))
    ?.filter((res: any) => department?.value > 0 ? res?.service?.department?.id == department?.value : true)

  let navbat = [] as any;
  for (let item of dep) {
    let res = `${item?.service?.department?.letter} - ${item?.queue_number}`
    if (res != firstQueue) navbat.push(res)
  }
  for (let item of clientTime?.filter((res: any) => department?.value > 0 ? res?.service?.department?.id == department?.value : true)) {
    let res = `${item?.department?.letter} - ${item?.agreement_time}`
    if (res != firstQueue) navbat.push(res)
  }
  if (firstQueue?.length > 0) navbat = [firstQueue, ...navbat]
  return [...new Set(navbat)]
}


export const clientTableColumn = (setting: any, first?: any, key?: any, response?: any) => {
  let column = [] as any;
  if (first && key?.length > 0) {
    if (+setting?.[key]) {
      return response
    }
    return ''
  }
  if (+setting?.is_reg_pass_number) {

    column.push('pass_number_')
  }
  if (+setting?.is_reg_phone) {

    column.push('phone_')
  }
  if (+setting?.is_reg_data_birth) {

    column.push('data_birth_')
  }
  if (+setting?.is_reg_person_id) {

    column.push('person_id_')
  }
  if (+setting?.is_reg_pay) {

    column.push('pay_total_price')
  }
  if (+setting?.is_reg_department) {

    column.push('department_')
  }
  if (+setting?.is_reg_service) {

    column.push('client_item_count')
  }
  if (+setting?.is_reg_queue_number) {

    column.push('welcome_count_')
  }
  if (+setting?.is_reg_status) {

    column.push('status_')
  }
  return column

}

const uzbekMonthNames = [
  "yanvar",
  "fevral",
  "mart",
  "aprel",
  "may",
  "iyun",
  "iyul",
  "avgust",
  "sentabr",
  "oktabr",
  "noyabr",
  "dekabr",
];
// export const statsianar
const getDatesInRange = (startDate: string, endDate: string, pay?: any): string[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates: any = [];

  while (start <= end) {
    const day = start.getDate();
    const month = uzbekMonthNames[start.getMonth()];
    const year = start.getFullYear();
    dates.push({
      dayName: `${day}-${month}`,
      date: `${year}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    });

    // Keyingi kunga o'tish
    start.setDate(start.getDate() + 1);
  }

  if (dates?.length == 0) {
    const day = start.getDate();
    const month = uzbekMonthNames[start.getMonth()];
    const year = start.getFullYear();
    dates.push({
      dayName: `${day}-${month}`,
      date: `${year}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    });
  }

  if (pay) {
    return dates.slice(0, -1);
  }
  return dates;
};

export const fullRoomName = (room: any) => {
  return `${room?.type} ${room?.number} ${room?.room_index} o'rin`
}

export const addDaysToDate = (dateStr: string, days: number): string => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Misol uchun foydalanish
console.log(addDaysToDate("01-05-2000", 5)); // 06-05-2000

export const statitionarDateHome = (data: any, currentDate: any, pay?: any, notPay?: any) => {
  const { admission_date, is_finish_statsionar, finish_statsionar_date, day_qty } = data ?? {}

  if (+is_finish_statsionar) {
    if (+day_qty > 0) {
      return getDatesInRange(admission_date, addDaysToDate(finish_statsionar_date, +day_qty))

    } else {
      return getDatesInRange(admission_date, finish_statsionar_date)

    }
  }
  if (+day_qty > 0) {
    return getDatesInRange(admission_date, addDaysToDate(admission_date, +day_qty))
  }
  return getDatesInRange(admission_date, currentDate)
}
export const statitionarDate = (data: any, currentDate: any, pay?: any, notPay?: any) => {
  const { admission_date, is_finish_statsionar, finish_statsionar_date } = data
  let dateAll = [] as any
  if (+is_finish_statsionar) {
    if (pay) {
      return getDatesInRange(admission_date, finish_statsionar_date)
    }
    return getDatesInRange(admission_date, finish_statsionar_date, true)

  }

  if (pay) {
    return getDatesInRange(admission_date, currentDate, pay)
  }
  dateAll = getDatesInRange(admission_date, currentDate)
  return dateAll
}


export const roomCalc = (data: any, selectData?: any, date?: any, currentDate?: any) => {
  console.log('data', data);

  if (data?.id > 0) {
    return statitionarDate(data, currentDate)?.length * (data?.statsionar_room?.statsionar_room_price ?? 0)
  }
  console.log('selectData', selectData);

  return (selectData?.statsionar_room_id?.data?.price ?? 0) * statitionarDate({
    admission_date: date,
  }, currentDate)?.length
}


export const calcRoom = (admission_date: any, price: any, currentDate: any, data?: any, totalView?: any, roomPrice?: any, discountRole?: any, payTotalPrice?: any, discoutView?: any) => {
  let datQty = statitionarDate({
    admission_date: admission_date,
  }, currentDate)?.length - 1
  // }, currentDate)?.length - (+data?.is_finish_statsionar ? 0 : 1)
  let totalPrice = datQty * (price ?? 0)
  let calcDiscount = 0;
  let discount = roomPrice?.save ? roomPrice?.discount : 0
  if (discount > 0) {
    if (discount <= 100) {
      calcDiscount = (totalPrice / 100) * discount
    } else {
      calcDiscount = discount
    }
    if (discoutView) {
      return calcDiscount
    }
  }
  if (totalView == true) {
    return totalPrice - (discountRole ? calcDiscount : 0)
  }
  return totalPrice - (discountRole ? calcDiscount : 0) - +(data?.statsionar_room_price_pay ?? 0) - (payTotalPrice ?? 0)
}


// obshi summa
export const calcRoomTotal = ({
  admission_date,
  price,
  currentDate
}: any) => {
  let datQty = statitionarDate({
    admission_date: admission_date,
  }, currentDate)?.length - 1
  let totalPrice = datQty * (price ?? 0)
  return totalPrice
}
// chegirma summasi va chegirmani korish
export const calcRoomTotalDiscout = ({
  admission_date,
  price,
  currentDate,
  discount,
  discoutView = false
}: {
  admission_date: any,
  price: any,
  currentDate: any,
  discount: any,
  discoutView?: boolean
}) => {
  let datQty = statitionarDate({
    admission_date: admission_date,
  }, currentDate)?.length - 1
  let totalPrice = datQty * (price ?? 0)
  if (discoutView) {
    return discount <= 100 ? (totalPrice / 100) * discount : discount
  }
  return totalPrice - (discount <= 100 ? (totalPrice / 100) * discount : discount)
}

// qolgan summatolanganda qolgan summa qarzi
export const calcRoomTotalPay = ({
  admission_date,
  price,
  currentDate,
  discount,
  pay_total_price,
  statsionar_room_price_pay,
  qarzi = 0,
  tolayotkan = 0,
  activestatusTab = false,
  tolayotkannkorsat = false,
  balanceRole = false,
  balance = 0,
  day_qty = 0,
  is_finish_statsionar = false
}: {
  is_finish_statsionar?: boolean
  admission_date: any,
  price: any,
  currentDate: any,
  discount: any,
  pay_total_price: any,
  statsionar_room_price_pay: any,
  tolayotkani?: any,
  qarzi?: number,
  tolayotkan?: number,
  tolayotkannkorsat?: boolean,
  activestatusTab?: boolean,
  balanceRole?: any,
  balance?: any,
  day_qty?: any
}) => {
  let resDate = currentDate as any;
  // let 
  if (day_qty > 0) {
    resDate = addDaysToDate(admission_date, +day_qty - 1)
  }
  let dateAll = statitionarDate({
    admission_date: admission_date,
  }, resDate)
  console.log('dateAll', dateAll);
  let datQty = dateAll?.filter((item: any) => Date.parse(item.date) <= Date.parse(currentDate))
    ?.length
  // - 1


  let totalPrice = datQty * (price ?? 0)
  totalPrice = totalPrice - (discount <= 100 ? (totalPrice / 100) * discount : discount) - statsionar_room_price_pay
  if (balanceRole) {
    return totalPrice > 0 ? (balance > totalPrice ? (balance - totalPrice) : 0) : balance
    // return totalPrice > 0 ? (balance - totalPrice) > 0 ? (balance - totalPrice) : 0 : balance
  }
  if (tolayotkannkorsat) {
    if (tolayotkan < 0) {
      return tolayotkan
    }
    if (pay_total_price > 0) {
      return (tolayotkan)
    }
    return activestatusTab ? 0 : (tolayotkan) + totalPrice
  }
  if (qarzi > 0) {
    return qarzi + totalPrice
  }


  if (totalPrice < 0) return totalPrice
  if (pay_total_price > totalPrice) return 0
  return totalPrice - pay_total_price
}
// statsionar_room_price_pay

const qaytarXonaPrice = (data: any, currentDate: any, changeDate: any) => {
  const { admission_date, statsionar_room_discount, statsionar_room_price_pay, statsionar_room_price, is_finish_statsionar, finish_statsionar_date } = data
  let datQty = statitionarDate({
    admission_date: admission_date,
  }, is_finish_statsionar ? finish_statsionar_date : currentDate)?.length - 1
  let totalPrice = datQty * (statsionar_room_price ?? 0)
  totalPrice = totalPrice - (statsionar_room_discount <= 100 ? (totalPrice / 100) * statsionar_room_discount : statsionar_room_discount) - statsionar_room_price_pay

  return 0
}

export const sexFunction = (target: string) => {
  return target == 'male' ? 'Мужчина' : 'Женщина';
};

export const labaratoryGroup = (data: any, type = false) => {

  if (data?.client_value && Array.isArray(data.client_value)) {
    if (type) {
      const servicetypes = data.client_value.reduce((acc: any, item: any) => {
        const servicetype = item.service.servicetype;
        if (servicetype && !acc.find((item: any) => item.id === servicetype.id)) {
          acc.push(servicetype); // Faqat unikal servicetype'larni qo'shing
        }
        return acc;
      }, []);
      return servicetypes; //
    }
    return Object.entries(
      data?.client_value?.reduce((acc: any, item: any) => {
        const servicetype = item.service.servicetype?.type;
        if (!acc[servicetype]) {
          acc[servicetype] = []; // Yangi guruh yarating
        }
        acc[servicetype].push(item); // Guruhga qo'shing
        return acc;
      }, {})
    ).map(([servicetype, groups]) => ({ servicetype, groups }));
  }
  return []

}
