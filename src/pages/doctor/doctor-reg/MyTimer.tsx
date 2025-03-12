import React, { useEffect } from 'react';
import { useTimer } from 'react-timer-hook';


export const timeData = (data:any)=>{
    if(data?.is_check_doctor=='pause'){
        const time = new Date();
        time.setSeconds(time.getSeconds() + 100);// 10 minutes timer
        return time
    }
    if(data?.is_check_doctor=='start'){
        const time = new Date();
        time.setSeconds(time.getSeconds() + data?.duration-data?.use_duration); // 10 minutes timer
        return time
    }
    const time = new Date();
    time.setSeconds(time.getSeconds() + 0); // 10 minutes timer
    return time
}
export function MyTimer({ expiryTimestamp,pauseCheck=true,startCheck=false }: {
    expiryTimestamp: any,
    pauseCheck?:boolean,
    startCheck?:boolean
}) {
    const expiryTime = timeData(expiryTimestamp);
    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({expiryTimestamp: expiryTime, onExpire: () => console.warn('onExpire called') });

    useEffect(()=>{
        if(pauseCheck){
            pause()
        }
        if(expiryTimestamp?.is_check_doctor=='pause'){
       
           
            start()
        }
        if(expiryTimestamp?.is_check_doctor=='finsih'){
            const time = new Date();
            time.setSeconds(time.getSeconds() + 0);
            restart(time)
        }
    })
    return (
        <div style={{ textAlign: 'center' }}>
            {expiryTimestamp?.is_check_doctor}
            <h1>react-timer-hook </h1>
            <p>Timer Demo</p>
            <div style={{ fontSize: '100px' }}>
                <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
            </div>
            <p>{isRunning ? 'Running' : 'Not running'}</p>
            <button onClick={start}>Start</button>
            <button onClick={pause}>Pause</button>
            <button onClick={resume}>Resume</button>
            <button onClick={() => {
                // Restarts to 5 minutes timer
                const time = new Date();
                time.setSeconds(time.getSeconds() + 300);
                restart(time)
            }}>Restart</button>
        </div>
    );
}

export function RoomMyTimer({ expiryTimestamp,pauseCheck=true,startCheck=false }: {
    expiryTimestamp: any,
    pauseCheck?:boolean,
    startCheck?:boolean
}) {
    const time = new Date();
    time.setSeconds(time.getSeconds() + expiryTimestamp);
    const expiryTime = time;
    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({expiryTimestamp: expiryTime, onExpire: () => console.warn('onExpire called') });

    useEffect(()=>{
        if(pauseCheck){
            pause()
        }
        if(startCheck){
            start()
        }
    })
    return (
       <>
       {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
       </>
    );
}
