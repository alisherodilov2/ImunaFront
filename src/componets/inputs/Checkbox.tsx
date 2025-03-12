import { FC,forwardRef } from 'react'
import { NewInputProps } from '../../interface/interface'
import { BsCheckLg } from 'react-icons/bs'


const Checkbox: FC<NewInputProps> = forwardRef<HTMLInputElement, NewInputProps>(({checked, children, className, ...props },ref) => {
    return (
        <div className="relative w-[24px] h-[24px]    select-none cursor-pointer   border-spacing-1 border-[--link] border ">
            <input checked={checked} ref={ref} {...props} id="check" type="checkbox" className="w-[100%] opacity-0 bg-transparent h-[100%] absolute top-0 left-0 check z-10 peer cursor-pointer" />
            <label htmlFor="check" className="w-[24px] cursor-pointer  h-[24px] absolute top-[-1px] left-[-1px] text-[--bg]  flex justify-center  items-center peer-checked:bg-[--check] duration-200 opacity-0 peer-checked:opacity-100" >
                <BsCheckLg fontSize={20} />
            </label>
        </div>
    )
})

export default Checkbox