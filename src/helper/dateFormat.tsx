export const getCurrentDateTime = (date: any) => {
    const now = new Date(date);

    const padZero = (num: number) => num < 10 ? `0${num}` : num;

    // const day = padZero(now.getUTCDate());
    const day = padZero(now.getDate());
    const month = padZero(now.getMonth() + 1); // Oylarda 0-indeksdan boshlab hisoblanadi
    // const month = padZero(now.getUTCMonth() + 1); // Oylarda 0-indeksdan boshlab hisoblanadi
    const year = now.getFullYear();
    // const year = now.getUTCFullYear();

    // const hours = padZero(now.getUTCHours());
    const hours = padZero(now.getHours());
    // const minutes = padZero(now.getUTCMinutes());
    const minutes = padZero(now.getMinutes());
    // const seconds = padZero(now.getUTCSeconds());
    const seconds = padZero(now.getSeconds());

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
};

export const getCurrentTime = (timestamp: any) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0'); // Gets hours in UTC
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Gets minutes in UTC
    return `${hours}:${minutes}`;

    // const padZero = (num: number) => num < 10 ? `0${num}` : num;

    // // const day = padZero(now.getUTCDate());
    // const day = padZero(now.getDate());
    // const month = padZero(now.getMonth() + 1); // Oylarda 0-indeksdan boshlab hisoblanadi
    // // const month = padZero(now.getUTCMonth() + 1); // Oylarda 0-indeksdan boshlab hisoblanadi
    // const year = now.getFullYear();
    // // const year = now.getUTCFullYear();

    // // const hours = padZero(now.getUTCHours());
    // const hours = padZero(now.getHours());
    // // const minutes = padZero(now.getUTCMinutes());
    // const minutes = padZero(now.getMinutes());
    // // const seconds = padZero(now.getUTCSeconds());
    // const seconds = padZero(now.getSeconds());

    // return `${now?.getHours()}:${1}`;
};