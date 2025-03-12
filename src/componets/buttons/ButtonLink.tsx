import { FC, forwardRef } from 'react'
import { NewButtonLinkProps, NewButtonProps } from '../../interface/interface'
import { Link } from 'react-router-dom'


const ButtonLink: FC<NewButtonLinkProps> = forwardRef<HTMLAnchorElement, NewButtonLinkProps>(({ children, className, to = '#', ...props }, ref) => {
    return (
        <Link to={to} ref={ref} {...props} className={`btn   ${className}`}>{children}</Link>
    )
})

export default ButtonLink