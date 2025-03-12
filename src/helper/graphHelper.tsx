import { dateFormat } from "../service/helper/day";

function isLeapYear(year: any) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}
type Month = 'yanvar' | 'fevral' | 'mart' | 'aprel' | 'may' | 'iyun' | 'iyul' | 'avgust' | 'sentyabr' | 'oktyabr' | 'noyabr' | 'dekabr';
function padWithZero(num: any) {
    return num < 10 ? `0${num}` : num; // Bir xonali raqamlarni nol bilan to'ldirish
}
export function generateCalendar(monthIndex: any, year: any) {
    const monthNames = [
        "yanvar", "fevral", "mart", "aprel", "may",
        "iyun", "iyul", "avgust", "sentyabr", "oktyabr",
        "noyabr", "dekabr"
    ];
    const monthDays = [
        { days: 31 },  // yanvar
        { days: isLeapYear(year) ? 29 : 28 },  // fevral
        { days: 31 },  // mart
        { days: 30 },  // aprel
        { days: 31 },  // may
        { days: 30 },  // iyun
        { days: 31 },  // iyul
        { days: 31 },  // avgust
        { days: 30 },  // sentyabr
        { days: 31 },  // oktyabr
        { days: 30 },  // noyabr
        { days: 31 }   // dekabr
    ] as any;
    const weekDays: { [key: number]: string } = {
        // dushanba
        1: "se",  // seshanba
        2: "cho", // chorshanba
        3: "pa",  // payshanba
        4: "ju",  // juma
        5: "sha",  // shanba
        6: "ya",  // yakshanba
        7: "du",
    };
    const result = [];
    const month = monthNames[`${monthIndex - 1}`] as any; // Oy nomini olish
    const days = monthDays[monthIndex - 1].days as any; // Oydagi kunlar sonini olish

    for (let day = 1; day <= days; day++) {
        const weekIndex = (day % 7 === 0) ? 7 : day % 7; // hafta indeksini hisoblash
        const dateString = `${padWithZero(day)}.${padWithZero(monthIndex)}.${year}`; // sanani nol bilan to'ldirish
        const filterDate = `${year}-${padWithZero(monthIndex)}-${padWithZero(day)}`; // sanani nol bilan to'ldirish
        result.push({
            week_index: weekIndex,
            day: day,
            month: month,
            month_index: monthIndex, // oy indeksini qo'shish
            year: year,
            week_day: weekDays[weekIndex],
            date: dateString,
            filter_date: filterDate
        });
    }

    return result;
}
export function getWeekData(inputDate: string) {
    const dateParts = inputDate.split('.');
    const day = parseInt(dateParts[0]);
    const monthIndex = parseInt(dateParts[1]);
    const year = parseInt(dateParts[2]);

    // Kiritilgan sananing haftasini olish
    const weekData = [];
    const startDate = new Date(year, monthIndex - 1, day); // Kiritilgan sanani olish

    // Haftaning boshlanishi (du - dushanba)
    const dayOfWeek = startDate.getUTCDay(); // Haftaning kuni (0 - yakshanba, 1 - dushanba, ...)
    const firstDayOfWeek = new Date(startDate);
    firstDayOfWeek.setDate(startDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Haftaning birinchi kuni

    // Haftaning barcha kunlarini olish
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(firstDayOfWeek);
        currentDate.setDate(firstDayOfWeek.getDate() + (i));

        const currentDay = currentDate.getUTCDate();
        const currentMonthIndex = currentDate.getUTCMonth() + 1; // Oy indeksini olish
        const currentYear = currentDate.getUTCFullYear();

        // Generate the calendar for the current date
        const dayData = generateCalendar(currentMonthIndex, currentYear).find(
            (d) => d.day === currentDay && d.month_index === currentMonthIndex && d.year === currentYear
        );

        if (dayData) {
            weekData.push(dayData);
        }
    }

    return weekData;
}

// Misol uchun kiritish
const week = getWeekData('19.10.2024');
console.log(week);


// // Foydalanish misoli:
// const january2021 = generateCalendar("yanvar", 2021);
// console.log("Yanvar 2021:", january2021);

// const february2024 = generateCalendar("fevral", 2024);
// console.log("Fevral 2024:", february2024);
const isNull = (value: any) => (value === null || value === undefined || value === "") || (value === "-" || value === "null" || value === "undefined");
export function phoneFormatNumber(input: string): string {
    if (isNull(input)) return "";
    // Raqamni bo'sh joysiz faqat raqamlar ko'rinishida olib tashlaymiz
    const cleanedInput = input?.replace(/\D/g, '');

    // Agar raqam uzunligi kerakli bo'lmasa, return qilamiz
    if (cleanedInput.length !== 9) {
        return "Noto'g'ri raqam formati"; // 9 ta raqam bo'lishi kerak
    }

    // Raqamni kerakli formatga bo'lib, qaytarish
    return `${cleanedInput.slice(0, 2)} ${cleanedInput.slice(2, 5)} ${cleanedInput.slice(5, 7)} ${cleanedInput.slice(7)}`;
}

export function graphItemSortTimes(times: any) {
    return times.sort((a: any, b: any) => {
        const timeA = a.agreement_time === "-" ? -1 : a.agreement_time; // Invalid time (e.g., "-") comes first
        const timeB = b.agreement_time === "-" ? -1 : b.agreement_time; // Invalid time (e.g., "-") comes first

        if (timeA === timeB) return 0; // If both are the same, keep their order
        if (timeA === -1) return -1; // If timeA is invalid, it should come first
        if (timeB === -1) return 1; // If timeB is invalid, it should come second

        // Parse the time strings into Date objects for comparison
        const [hoursA, minutesA] = timeA.split(':').map(Number);
        const [hoursB, minutesB] = timeB.split(':').map(Number);

        // Compare the times
        return (hoursA - hoursB) || (minutesA - minutesB);
    });
}

export function generateDayArray(count: any) {
    const result = [];

    for (let index = 0; index < count; index++) {
        result.push({
            label: `${index + 1}-kun`, // label: 0-kun, 1-kun, va h.k.
            value: index           // value: 0, 1, 2, ...
        });
    }

    return result?.length > 0 ? [{
        label: 'Bugun',
        value: 'today'
    }, ...result] : [];
}

export function came_graph_archive_item_count(data: any) {
    console.log(data);
    if (data?.length > 0) {

        return data?.map((res: any) => {
            return {
                label: `${res} - kun`,
                value: res
            }
        })
    }
    return []
}




export function formatDateMonthName(dateString: string): string {
    // Sanani yaratish
    const date = new Date(dateString);

    // Oylardan iborat massiv
    const months: string[] = [
        "yanvar", "fevral", "mart", "aprel", "may", "iyun",
        "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"
    ];

    // Kun va oyni olish
    const day: number = date.getDate();
    const month: string = months[date.getMonth()];

    // Formatlangan natijani qaytarish
    return `${day}-${month}`;
}

export function isTimeGreater(time1: any, time2: any) {
    // Vaqtlarni "HH:mm" formatida qabul qilamiz
    if ((time1 == null || time2 == null) || (time1 == '-' || time2 == '-')) return false
    const [hours1, minutes1] = time1?.split(':')?.map(Number);
    const [hours2, minutes2] = time2?.split(':')?.map(Number);

    // Har bir vaqtni Date ob'ekti sifatida yaratamiz
    const date1 = new Date();
    date1.setHours(hours1, minutes1, 0, 0); // Vaqtni o'rnatamiz

    const date2 = new Date();
    date2.setHours(hours2, minutes2, 0, 0); // Vaqtni o'rnatamiz

    // Vaqtlarni solishtiramiz
    return date1 <= date2; // Agar time1 time2 dan katta bo'lsa, true qaytaradi
}
export const graphAChiveStatus = (data: any, date: any, time?: any) => {
    console.log('data', data);

    if (data?.client?.finish_department_count == data?.client?.department_count && data?.client?.department_count > 0) {
        return 'success'
    }
    if (data?.client?.id > 0 || data?.client?.is_check_doctor == 'start' || data?.client?.is_check_doctor == 'pause') {
        return 'primary'
    }
    // if (data?.client?.id > 0 && (data?.client?.is_check_doctor != 'finish' || data?.client?.is_check_doctor != 'start' || data?.client?.is_check_doctor != 'pause')) {
    //     return 'info'
    // }
    console.log('grahchek', ishVaqtiniKorinishi(time, data?.graph_item?.at(-1)
        ?.department?.work_end_time, data?.graph_item?.at(-1)?.agreement_time));

    if ((Date.parse(data?.agreement_date) == Date.parse(date) &&
        (data?.graph_item?.at(-1)
            ?.department?.id > 0 ? ishVaqtiniKorinishi(time, data?.graph_item?.at(-1)
                ?.department?.work_end_time, data?.graph_item.at(-1)?.agreement_time) : false) ||
        ((!data?.client?.id) && Date.parse(data?.agreement_date) < Date.parse(date)))) {
        return 'danger'
    }
    return 'warning'

}

const ishVaqtiniKorinishi = (hozirig_vaqt: any, ish_vaqti: any, kelish_vaqti: any,) => {
    if (isTimeValid(kelish_vaqti)) {
        return isTimeGreater(kelish_vaqti, ish_vaqti)
    }
    return isTimeGreater(hozirig_vaqt, ish_vaqti)

}
function isTimeValid(time: any) {
    // Vaqt formatini tekshirish uchun regex
    const timeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeFormat.test(time);
}


export function addOneDay(dateString: string): string {
    let date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return dateFormat(date);
}

