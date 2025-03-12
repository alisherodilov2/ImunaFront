import { FC } from 'react'
import { NewDivProps, NewInputProps, NewLabelProps } from '../../interface/interface'
import { BsCheckLg } from 'react-icons/bs'


const FormInput: FC<NewDivProps> = ({ children, className, ...props }) => {
    return (
        <div {...props} className={` form-input mb-[24px] ${className}`} >
            {children}
        </div>
    )
}

export default FormInput;