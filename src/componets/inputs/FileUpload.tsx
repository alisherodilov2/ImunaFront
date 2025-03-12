import { FC, useState } from 'react'
import { NewInputProps } from '../../interface/interface'
import { BsCheckLg } from 'react-icons/bs'
import { FaFileUpload } from 'react-icons/fa'


const FileUpload: FC<NewInputProps> = ({ defaultValueImg = '', setFileResult, children, className, ...props }) => {
    const [file, setFile] = useState(null)
    return (
        <div className="photo rounded-[13px] text-center relative bg-[--blue] border-dashed border-white border-[1px] cursor-pointer overflow-hidden">
            <input type="file" className='opacity-0 z-10 absolute top-0 left-0 h-full w-full cursor-pointer' onChange={(e: any) => {
                setFile(e.target.files[0])
                setFileResult(e.target.files[0])
            }} />
            {

                file === null ? defaultValueImg?.length != 0 ? <div>
                    <img src={defaultValueImg} alt="filyal.png" className=" top-0 left-0 h-[268px] w-full cursor-pointer  object-contain " />
                </div> : <div className="file-text py-[66px] px-[26px]">
                    <FaFileUpload fontSize={40} className='block m-auto' />
                    <h2 className='text-[20px] font-[700] mt-[12px] mb-[6px]'>Upload Files</h2>
                    <p className='text-[12px] font-[500] text-[#8F9BBA]' >PNG, JPG and GIF files are allowed</p>
                </div> :
                    <div>
                        <img src={URL?.createObjectURL(file)} alt="filyal.png" className=" top-0 left-0 h-[268px] w-full cursor-pointer  object-contain " />
                    </div>
            }

        </div>
    )
}

export default FileUpload