import React from 'react'
import { ScaleLoader } from 'react-spinners'

const LoadSingle = ({ loading = false, className }: { loading?: boolean, className?: string }) => {
    return loading ? (
        <div className={` h-full w-full flex items-center justify-center ${className}`}>
            <p className='max-[1100px]:text-[14px] text-center  text-[14px] whitespace-pre'>
                <span className='block my-5'>
                    <ScaleLoader color="#36d7b7" />
                </span>
                <span className=''>
                    Yuklanmoqda...
                </span>
            </p>
        </div>
    ) : null
}

export default LoadSingle