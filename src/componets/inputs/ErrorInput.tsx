import { FC } from 'react'
import { NewInputProps, NewSpanProps } from '../../interface/interface'
import { BsCheckLg } from 'react-icons/bs'


const ErrorInput: FC<NewSpanProps> = ({ className, children, placeholder, ...props }) => {
    return (
        <span className={`${className}form-text text-danger my-1`} {...props}>
            {children}
        </span>

    )
}

export default ErrorInput;