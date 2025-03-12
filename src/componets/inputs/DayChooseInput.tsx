import { FC, forwardRef, useState } from 'react'
import { NewInputProps } from '../../interface/interface'
import { BsCheckLg } from 'react-icons/bs'
import ErrorInput from './ErrorInput'
import { FaTimes } from 'react-icons/fa'


const DayChooseInput: FC<NewInputProps> = forwardRef<HTMLInputElement, NewInputProps>(({ error, name, type, className, placeholder, ...props }, ref) => {
    const [day] = useState(
        {
            day: [
                {
                    id: 'odd',
                    name: 'Toq kunlar'
                },
                {
                    id: 'do_not_odd',
                    name: 'Juft kunlar'
                },
                {
                    id: 'every_day',
                    name: 'Har kuni'
                },
                {
                    id: 1,
                    name: "DU",
                },
                {
                    id: 2,
                    name: "SE",
                },
                {
                    id: 3,
                    name: "CHOR",
                },
                {
                    id: 4,
                    name: "PAY",
                },
                {
                    id: 5,
                    name: "JUMA",
                },
                {
                    id: 6,
                    name: "SHANBA",
                },
            ]
        });
    const [modal, setModal] = useState({
        modal: false
    })
    const [res, setRes] = useState([] as any)
    const resAdd = (item: any) => {
        if (res.find((_: any) => _.name == item.name)) {
            setRes(res.filter((_: any) => _.name != item.name))
        } else {
            setRes([...res, item])
        }
    }
    return (
        <>

            <div className="form-input mb-[24px]">
                <input onClick={() => setModal({ ...modal, modal: true })} readOnly type="email" required className='py-[17px] bg-transparent outline-none rounded-[16px] px-[24px]  border-[--input-border] border-[1px] placeholder:text-[--grey-50] white text-[14px] font-[500] block w-full ' placeholder='mail@simmmple.com' autoFocus ref={ref} name={name} value={res.map((item: any) => item.name).join(',')} {...props} />
                <div className={`${modal?.modal ? 'scale-100 translate-x-0 z-20' : 'z-0 scale-0 translate-x-[-200px]'} duration-300 day_card fixed w-full flex items-center justify-center h-full bg-transparent backdrop-blur-[10px]	top-0 left-0`} onClick={(e: any) => {
                    if (e.target.className.indexOf('scale-100') !== -1) {
                        setModal({ ...modal, modal: false })
                    }
                }} >
                    <div className="p-[30px] bg-[--bg]  border border-[--bg-saidbar]">
                        <div className="flex justify-between items-center mb-[20px]">
                            <h1 className="white text-[20px] font-[700]">Check Table</h1>
                            <button onClick={() => setModal({ ...modal, modal: false })} type='button' className="px-[15px] py-[10px] white text-[14px] font-[500] bg-[--blue]  rounded-[10px]">
                                <FaTimes />
                            </button>
                        </div>
                        <div className="grid mt-3 grid-cols-3 items-center gap-3">
                            {
                                day.day?.map((item, index) => (
                                    <button type='button' className={`rounded whitespace-pre p-[10px] border bg-[--bg-saidbar] ${res.find((k: any) => k.id === item.id) ? ' border-[red]' : ''}`} onClick={() => resAdd(item)}>{item?.name}</button>
                                ))
                            }

                        </div>
                    </div>
                </div>
            </div>

            <ErrorInput>
                {error}
            </ErrorInput>
        </>
    )
})

export default DayChooseInput;