export function addDays(dateString:any, days:any) {
    // Berilgan sanani Date obyektiga aylantiramiz
    const date = new Date(dateString);
  
    // Sanaga kiritilgan kunlarni qo'shamiz
    date.setDate(date.getDate() + days);
  
    // Sanani 'YYYY-MM-DD' formatida qaytaramiz
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
  
const dangerDate = (data:any) => {

}

export const isExpiringSoon = (expirationDate: string, days:any,currentDate:string) => {
  const today = new Date(currentDate);
    const targetDate = new Date(expirationDate);
  console.log('expirationDate',expirationDate);
  console.log('expirationDate',currentDate);
  
    // Sana validligini tekshirish (expirationDate bugundan keyingi bo'lishi kerak)
    // if (targetDate <= today) return false;

    // Bugungi sana va expirationDate orasidagi kun farqini hisoblash
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    // Millisekundlar farqini kunlarga aylantirish
    const dayDifference = (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
console.log('dayDifference',dayDifference);
console.log('days',days);

    return dayDifference <= +days ? true : false;
};

