import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useTime, useTimer } from 'react-timer-hook';
import RealClock from 'react-live-clock';
import Button from '../buttons/Button';
import { AiFillClockCircle } from 'react-icons/ai';
function Time({ expiryTimestamp }: { expiryTimestamp: any }) {
    const [currentTime, setCurrentTime] = useState(getCurrentTime());

    function getCurrentTime() {
        const now = new Date();
        const year = now.getFullYear().toString().padStart(2, '0');
        const month = now.getMonth().toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        // return `${year}-${+month + 1}-${day} ${hours}:${minutes}:${seconds}`;
        return <div className='flex items-center gap-2 text-[17px]'><span className='text-[22px]'><AiFillClockCircle /> </span> <span>{year}-{+month + 1}-{day} <span className='inline-block min-w-[65px] max-w-[65px]'><span >{hours}</span><span>:{minutes}</span><span>:{seconds}</span></span> </span> </div>;
    }
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(getCurrentTime());
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return currentTime
}

export default Time;
// function Time({ expiryTimestamp }: { expiryTimestamp: any }) {
//     const defaultDate = new Date(expiryTimestamp); //
//     const {
//         seconds='12',
//         minutes,
//         hours='21',
//         ampm='pm',
//     } = useTime({ format: '12-hour' });

//     return (
//         <div style={{ fontSize: '100px' }}>
//             <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span><span>{ampm}</span>
//         </div>

//     );
// }

// export default Time;