import React from 'react'

const ProfileCard = () => {
  return (
    <div>
      <div className="user bg-[----bg-saidbar] rounded-[20px] p-[18px] text-center">
        <div className="photo relative">
          <img src="./_test_/filyal.png" alt="filyal.png" className="w-[100%] h-[131px] rounded-[18px] object-cover" />
          <img src="./_test_/user.png" alt="user" className='w-[87px] h-[87px] rounded-full object-cover absolute left-[50%] translate-x-[-50%]  top-[85px] border-[--bg-saidbar] border ' />
        </div>
        <h1 className='mt-[56px] text-[20px] font-[700]'>Adela Parkson</h1>
        <p className='py-[3px] text-[14px] font-[500] text-[--grey-50]'>Product Designer</p>
        <div className="flex justify-between items-center mt-[20px]">
          <div>
            <h1 className=' text-[24px] font-[700]'>17</h1>
            <p className='py-[3px] text-[14px] font-[400] text-[--grey-50]'>Posts</p>
          </div>
          <div>
            <h1 className=' text-[24px] font-[700]'>17</h1>
            <p className='py-[3px] text-[14px] font-[400] text-[--grey-50]'>Posts</p>
          </div>
          <div>
            <h1 className=' text-[24px] font-[700]'>17</h1>
            <p className='py-[3px] text-[14px] font-[400] text-[--grey-50]'>Posts</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard