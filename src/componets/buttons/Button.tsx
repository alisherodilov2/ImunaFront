import { FC, forwardRef } from 'react'
import { NewButtonProps } from '../../interface/interface'


const Button: FC<NewButtonProps> = forwardRef<HTMLButtonElement, NewButtonProps>(({ type, children, className, ...props }, ref) => {
    return (
        <button ref={ref} type={type}  {...props} className={`px-[15px] py-[10px] text-white text-[14px] font-[500] bg-gradient-to-tl shadow-[0px_0px_6px_1px_#7267f0b3]  from-[#7367f0] to-[#7267f0b3]  rounded-[30px] ${className}`}>{children}</button>
    )
})
export default Button