import React from 'react'
import userImg from './user.svg'
const UserCard = ({ photo='', title, text }: { photo?: string, title?: string, text?: string }) => {
    return (
        <div className='bg-[#1B254B]   rounded-[16px] flex  py-[12px] px-[16px] items-center gap-2'>
            <div className="user-img">
                <img src={photo?.length>0 ? photo : userImg} alt="userImg" className='rounded-full w-[46px] h-[46px]  object-cover' />
            </div>
            <div>
                <h2 className='text-[20px]'>{title}</h2>
                <p className='text-[12px] text-[#A3AED0]'>{text}</p>
            </div>
        </div>
    )
}

export default UserCard