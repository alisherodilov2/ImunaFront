import { FC } from 'react'
import { NewInputProps, NewLabelProps } from '../../interface/interface'
import { BsCheckLg } from 'react-icons/bs'


const Label: FC<NewLabelProps> = ({ children, className, ...props }) => {
    return (
        <label {...props} className={` form-label ${className}`} >
            {children}
        </label>
    )
}

export default Label;