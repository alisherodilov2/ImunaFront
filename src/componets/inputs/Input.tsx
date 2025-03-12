import { FC, forwardRef } from 'react'
import { NewInputProps } from '../../interface/interface'
import { BsCheckLg } from 'react-icons/bs'
import ErrorInput from './ErrorInput'


const Input: FC<NewInputProps> = forwardRef<HTMLInputElement, NewInputProps>(({disabled=false, required = false, value, readOnly, error, name = '', type, className, placeholder, max, min, ...props }, ref) => {
    return (
        <>
            <input key={name} max={max}disabled={disabled} min={min} required={required} ref={ref} readOnly={readOnly}  {...props} value={value} name={name} type={type} className={`  form-control  ${error?.length ?? 0 > 0 ? 'border-danger' : 'border-[--input-border]'}  ${className}`} placeholder={placeholder} />
            <ErrorInput>
                {error}
            </ErrorInput>
        </>
    )
})

export default Input;