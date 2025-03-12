import React, { useEffect, useRef, useState } from 'react'
import { formatId } from '../../../helper/idGenerate'
import { getCurrentDateTime } from '../../../helper/dateFormat'
import { fullName, masulRegUchunFullName } from '../../../helper/fullName'
import Table from '../../../componets/table/Table'
import { NumericFormat } from 'react-number-format'
import Content from '../../../layout/Content'
import Navbar from '../../../layout/Navbar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Input from '../../../componets/inputs/Input'
import { date } from '../../../helper/date'
import { FaCheckCircle, FaPrint, FaRegStopCircle } from 'react-icons/fa'
import { Modal } from 'reactstrap'
import { set } from 'date-fns'
import { useForm } from 'react-hook-form'
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorInput from '../../../componets/inputs/ErrorInput'
import { BiTransfer } from 'react-icons/bi'
import { dateFormat } from '../../../service/helper/day'
import Select from 'react-select';
import { formatter } from '../../../helper/generateDoctorTemplate'
import { useSelector } from 'react-redux'
import { ReducerType } from '../../../interface/interface'
const DailyRepot = (
) => {
    const [load, setLoad] = React.useState(false)
    const [data, setData] = React.useState<any>({
        data: [],
        start_date: '',
        end_date: '',
        status: 'start'
    })
    const schema = yup
        .object()
        .shape({
            name: yup.string().required("Nomi kiriting!"),
            product_category_id: yup.string().required("Minumal miqdori kiriting!"),
            alert_min_qty: yup.string().required("Minumal miqdori kiriting!"),
            price: yup.string().required("narxi kiriting!"),
            alert_dedline_day: yup.string().required("ogohlatirish muddatini kiriting!"),
            expiration_day: yup.string().required("Saqlash muudatini kiriting!"),
        })
        .required();
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            ...data
        }

    });


    useEffect(() => {
        getData({
            ...data,
            branch: target_branch == 'all' ? { label: 'Barcha filallar', value: 'all' } : (target_branch > 0 ? user?.branch?.find((item: any) => item?.value == target_branch) : user?.branch?.at(0))
        })
    }, [])
    const [modal, setModal] = React.useState(false)
    const path = useNavigate()
    const update = async (e: any) => {
        try {
            setLoad(() => true)
            let formData = new FormData();
            formData.append('id', item?.id)
            formData.append('status', 'finish')

            formData.append('give_transfer_price', e?.give_transfer_price)
            formData.append('give_card_price', e?.give_card_price)
            formData.append('give_cash_price', e?.give_cash_price)
            formData.append('is_transfer', e?.is_transfer ? '1' : '0')
            formData.append('is_card', e?.is_card ? '1' : '0')
            formData.append('is_cash', e?.is_cash ? '1' : '0')
            let res = await axios.post(`/repot/daily`, formData)
            const { result } = res.data

            updateIframeContent(result)
            handlePrint()
            setData(() => {
                return {
                    ...data,
                    data: data?.data?.map((res: any) => {
                        if (res?.id === item?.id) {
                            return {
                                ...result,
                                count: result?.daily_repot_client?.length,
                                expence: result?.daily_repot_expense?.reduce((a: any, b: any) => a + +b?.expense?.price, 0)

                            }
                        } else {
                            return res
                        }
                    })
                }
            })
            setPrice({
                give_card_price: 0,
                give_cash_price: 0,
                give_transfer_price: 0,
                is_card: false,
                is_cash: false,
                is_transfer: false
            })
            setItem({})
            toggle()
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const [htmlCode, setHtmlCode] = useState<string>('<h1>Bu yerda chop qilinadigan matn bor</h1>');
    const iframeRef = useRef<any>(null);
    const status = [
        {
            label: 'Yakunlanmagan',
            value: 'start',
        },
        {
            label: 'Yakunlangan',
            value: 'finish',
        }
    ]

    const updateIframeContent = (item: any) => {
        const iframeDoc = iframeRef.current?.contentDocument;
        if (iframeDoc) {
            iframeDoc.open();

            let daily_repot_expense = `  <tr>
            <td colspan="2">Mavjud emas</td>
        </tr>` ;
            if (item?.daily_repot_expense?.length > 0) {
                daily_repot_expense = ``
                let price = 0 as any;
                for (let key of [...item?.daily_repot_expense,
                    // ...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense,...item?.daily_repot_expense
                ]) {
                    price = price + +key?.expense?.price
                    daily_repot_expense += `<tr>
                <td>${key?.expense?.expense_type?.name}</td><td>${formatter.format(key?.expense?.price)}</td></tr>`
                }

                daily_repot_expense += `<tr style="background: rgb(46, 187, 97); font-weight: bold;">
                <td>Jami</td><td>${formatter.format(price)}</td></tr>`
            }


            let cash = '', card = '', transfer = '',
                give_cash_price = '', give_card_price = '', give_transfer_price = '';

            ;
            if (+item?.is_cash) {
                cash = `<tr>
                <td>Naqd</td><td>${item?.give_cash_price - item?.cash_price > 0 ? '+' : ''} ${formatter.format(item?.give_cash_price - item?.cash_price)}</td></tr>`
            }
            if (+item?.is_card) {
                card = `<tr>
                <td>Plastik</td><td>${item?.give_card_price - item?.card_price > 0 ? '+' : ''}${formatter.format(item?.give_card_price - item?.card_price)}</td></tr>`
            }
            if (+item?.is_transfer) {
                transfer = `<tr>
                <td>O'tkazma</td><td>${item?.give_transfer_price - item?.transfer_price > 0 ? '+' : ''}${formatter.format(item?.give_transfer_price - item?.transfer_price)}</td></tr>`
            }

            if (+item?.give_cash_price > 0) {
                give_cash_price = `<tr> 
                <td>Naqd</td><td>${formatter.format(item?.give_cash_price)}</td></tr>`
            }
            if (+item?.give_card_price > 0) {
                give_card_price = `<tr> 
                <td>Plastik</td><td>${formatter.format(item?.give_card_price)}</td></tr>`
            }
            if (+item?.give_transfer_price > 0) {
                give_transfer_price = `<tr> 
                <td>O'tkazma</td><td>${formatter.format(item?.give_transfer_price)}</td></tr>`
            }

            // Faqat body tagidagi kontentni yozish va meta va titleni olib tashlash
            iframeDoc.write(`
            <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <style>
        title{
            display: none;
        }
            body {
            width: 302px;
            max-width: 302px;
            }
                table{
                width: 100%;
                }   
        table,
        th,
        td {
            border: 1px solid black;
            border-collapse: collapse;
            // width: 100%;
        }
        table{
            border: 2px solid black;
        }
        table{
            width: 100%;
        }
    
        td {
            padding: 5px;
            font-size: 16px;
            font-weight: normal;
        }
             /* Har bir sahifaning boshidagi matn */
              .page-header {
                font-size: 18px;
                font-weight: bold;
                text-align: center;
                margin-top: 20px;
              }
              /* Har bir sahifa uchun ajratish */
             
              /* @page CSS qoidasini qo'llash */
            @media print {
             .page-break {
                page-break-before: always;
              }
                body {
                  margin: 0;
                  padding: 0;
                }
                  
                /* Brauzerning avtomatik header/footer-ni olib tashlash */
                .header, .footer {
                  display: none;
                }
                @page {
                  margin: 0.5rem 0.5rem;
                }
              }
    </style>
</head>

<body>
<div>   

 <table>   
          <caption >
          
          <p style="font-size: 20px; font-weight: bold;">
          SMENA № ${item?.batch_number}
          </p>
          <p style=" font-weight: bold;margin:0; padding: 0;">${item?.user?.owner?.name}</p>
<p style=" font-weight: bold; margin:0; padding: 0;">${masulRegUchunFullName(item?.user)}</p>
<br/>
          </caption>      
    <tr style="background: rgb(46, 187, 97); font-weight: bold;">
                  <td ><b>SANA</b></td>
                  <td ><b>${dateFormat(item?.created_at, '.')}</b></td>
            </tr>
            <tr>
                <td>Jami</td>
                <td>${formatter.format(item?.total_price)}</td>
            </tr>
            <tr>
                <td>Naqd</td>
                <td>${formatter.format(item?.cash_price)}</td>
            </tr>
            <tr>
                <td>Plastik</td>
                <td>${formatter.format(item?.card_price)}</td>
            </tr>
            <tr>
                <td>O'tkazma</td>
                <td>${formatter.format(item?.transfer_price)}</td>
            </tr>
            <tr style="background: rgb(46, 187, 97); font-weight: bold;">
                <td colspan="2"><b>XARAJTLAR</b></td>
            </tr>
           ${daily_repot_expense}
            <tr  style="background: rgb(46, 187, 97); font-weight: bold;">
                <td colspan="2"><b>BERILDI</b></td>
            </tr>
            ${give_cash_price}
            ${give_card_price}
            ${give_transfer_price}
            <tr>
                <td>Jami</td>
                <td>${formatter.format(+item?.give_transfer_price + +item?.give_card_price + +item?.give_cash_price)}</td>
            </tr>
            <tr>
               <td colspan="2"><b>KAMOMAT</b></td>
            </tr>
            ${cash}
            ${card}
            ${transfer}
</table>
</div>
</body>

</html>
            `);
            iframeDoc.close();
        }
    };
    const handlePrint = () => {
        if (iframeRef.current) {
            const iframeWindow = iframeRef.current.contentWindow;
            iframeWindow.print(); // Iframe ichidagi matnni chop qilish
        }
    };
    const getData = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/repot/daily?start_date=${id?.start_date ?? ''}&end_date=${id?.end_date ?? ''}&status=${id?.status ?? ''}&branch_id=${id?.branch?.value ?? ''}`)
            const { result } = res.data
            setData(() => result)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const show = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/repot/daily/${id}`)
            const { result } = res.data


            updateIframeContent(result?.data)
            handlePrint()
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const toggle = () => {
        setModal(!modal)
    }
    const [item, setItem] = React.useState<any>({})
    const [price, setPrice] = React.useState({
        give_card_price: 0,
        give_cash_price: 0,
        give_transfer_price: 0,
        is_transfer: false,
        is_card: false,
        is_cash: false
    } as any)
    const { user, target_branch } = useSelector((state: ReducerType) => state.ProfileReducer)

    const [search, setSearch] = useState({
        branch: target_branch == 'all' ? { label: 'Barcha filallar', value: 'all' } : (target_branch > 0 ? user?.branch?.find((item: any) => item?.value == target_branch) : user?.branch?.at(0)),

    } as any)

    return (
        <>
            <Content loading={load}>
                <Navbar />
                <div className="container-fluid flex-grow-1 container-p-y size_16">

                    <div className=" my-1 ">
                        <form className='row '>
                            {/* <div className="col-2">
                                <Input type='date' onChange={(e: any) => {
                                    let value = e.target.value
                                    if (value && value.length > 0) {
                                        // dispatch(isReferringDoctorGet(`?is_repot=1&start_date=${value}&end_date=${referringDoctorData?.end_date}`))
                                        getData({
                                            ...data, start_date: value
                                        })
                                    }
                                }}
                                    value={data?.start_date}
                                />
                            </div>
                            <div className="col-2">
                                <Input type='date' min={data?.start_date} onChange={(e: any) => {
                                    let value = e.target.value
                                    if (value && value.length > 0) {
                                        getData({
                                            ...data, end_date: value
                                        })
                                        // dispatch(isReferringDoctorGet(`?is_repot=1&start_date=${referringDoctorData?.start_date}&end_date=${value}`))
                                    }
                                }}
                                    value={data?.end_date}
                                />
                            </div> */}
                            {
                                user?.is_main_branch ? '' :
                                    <div className="col-lg-2 col-12 my-1">
                                        <Select
                                            name='name'
                                            isDisabled={user?.is_main_branch || load}
                                            value={search?.branch}
                                            onChange={(e: any) => {
                                                setSearch(({ ...search, branch: e }))
                                                getData({
                                                    ...data, branch: e
                                                })
                                                // clientAllData(`branch_id=${e?.value}`)

                                            }}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            options={
                                                [
                                                    {
                                                        value: 'all',
                                                        label: 'Barcha filallar'
                                                    },
                                                       ...(user?.branch ?? [])
                                                ]
                                            } />
                                    </div>
                            }
                            <div className="col-lg-2 col-12">
                                <Select
                                    name='name'
                                    value={status?.find((item: any) => item?.value == data?.status)}
                                    onChange={(e: any) => {
                                        getData({
                                            ...data, status: e.value,
                                            branch: search?.branch
                                        })
                                        // setSearch((res: any) => {
                                        //     return {
                                        //         ...res,
                                        //         department: e
                                        //     }
                                        // })
                                        // dispatch(isGraphGet(`?year=${e?.value ?? ''}&department_id=${graphData?.department?.value ?? ''}&month=${graphData?.month?.value ?? ''}`))
                                    }}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    options={
                                        status
                                    } />
                            </div>

                        </form>
                    </div>
                    <div className="card" style={{
                        height: `${window.innerHeight / 1.5}px`,
                        overflow: 'auto'
                    }}>
                        <Table
                            paginationRole={false}
                            isLoading={false}
                            isSuccess={true}
                            reloadData={true}
                            reloadDataFunction={() => {
                                getData({ ...data, status: 'start' })
                                setSearch({ ...search, branch: user?.branch?.at(0) })
                            }}
                            extraButtonRole={true}
                            extraButton={function (item: any) {
                                return <>
                                    <button className={`btn btn-sm btn-${item?.status == 'start' ? 'danger' : 'success'}`}
                                        disabled={user?.role=='director'|| item?.status == 'finish' ? true : false}
                                        onClick={() => {
                                            setItem(item)
                                            toggle()
                                        }}
                                    >{
                                            item?.status == 'start' ?
                                                <FaRegStopCircle size={24} /> : <FaCheckCircle size={24} />
                                        }
                                    </button >
                                    {
                                        item?.status == 'finish' ?
                                            <button className={`btn btn-sm btn-info`}
                                                onClick={() => {
                                                    show(item?.id)
                                                }}
                                            >     <FaPrint size={24} />
                                            </button > : ''
                                    }
                                </>
                            }}
                            extraKeys={[
                                'klinka_id',
                                'batch_number_',
                                'date',
                                'client',
                                'total',
                                'cash',
                                'card',
                                'transfer',
                                'expenses',
                            ]}
                            columns={[
                                {
                                    title: '№',
                                    key: 'id',
                                    renderItem: (value: any, data: any) => {
                                        return <td>
                                            <span>
                                                {(data?.index + 1)}
                                            </span>
                                        </td>
                                    }
                                },
                                {
                                    title: "klinka",
                                    key: 'klinka_id',
                                    renderItem: (value: any, data: any) => {
                                        return <td onClick={() => {

                                        }}>
                                            {value?.user?.owner?.name}
                                        </td>
                                    }
                                },
                                {
                                    title: "Smena",
                                    key: 'batch_number_',
                                    renderItem: (value: any, data: any) => {
                                        return <td onClick={() => {

                                        }}>
                                            <b>{(value?.batch_number)} - smena</b>
                                        </td>
                                    }
                                },
                                {
                                    title: "Sana",
                                    key: 'date',
                                    renderItem: (value: any, data: any) => {
                                        return <td onClick={() => {

                                        }}>
                                            <b>{(value?.current_date)}</b>
                                        </td>
                                    }
                                },
                                {
                                    title: "To'lovlar soni",
                                    key: 'client',
                                    render: (value: any, data: any) => {
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={value?.count ?? 0} />
                                    }
                                },
                                {
                                    title: 'Uumiy tushum',
                                    key: 'total',
                                    render: (value: any, data: any) => {
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={value?.total_price} />
                                    }
                                },

                                {
                                    title: "Naqd",
                                    key: 'cash',
                                    render: (value: any, data: any) => {
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={value?.cash_price} />
                                    }
                                },
                                {
                                    title: "Plastik",
                                    key: 'card',
                                    render: (value: any, data: any) => {
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={value?.card_price} />
                                    }
                                },
                                {
                                    title: "O'tkaza",
                                    key: 'transfer',
                                    render: (value: any, data: any) => {
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={value?.transfer_price} />
                                    }
                                },
                                {
                                    title: "Xarajat",
                                    key: 'expenses',
                                    render: (value: any, data: any) => {
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={value?.expence} />
                                    }
                                },

                            ]}
                            dataSource={
                                // []
                                data?.data
                            }
                        />
                    </div>
                </div>
            </Content >
            <Modal backdrop="static" keyboard={false} centered={true} isOpen={modal} toggle={toggle} role='dialog' >
                <form onSubmit={(e: any) => {
                    e.preventDefault()
                    update(price)
                }} >

                    <div className="modal-header">
                        <h3 className="modal-title">
                            Topshirish
                        </h3>
                    </div>
                    <div className="modal-body">
                        <div className="col-12 mb-1">
                            <label className="form-label">Naqd</label>
                            <div className="input-group">
                                <div className="input-group-text">
                                    <input type="checkbox" checked={price?.is_cash} onChange={(e: any) => {
                                        let value = e.target.checked
                                        setPrice({ ...price, is_cash: value })
                                    }} className='form-check-input' />
                                </div>
                                <NumericFormat
                                    value={item?.cash_price}
                                    thousandSeparator
                                    disabled
                                    className='form-control'

                                />
                                <button className="btn btn-primary" type='button'
                                    onClick={() => {
                                        setPrice({
                                            ...price,
                                            give_cash_price: item?.cash_price
                                        })
                                    }}
                                >
                                    <BiTransfer />
                                </button>
                                <NumericFormat
                                    value={price?.give_cash_price}


                                    thousandSeparator
                                    onChange={(e: any) => {
                                        setPrice({
                                            ...price,
                                            give_cash_price: e.target.value.replace(/,/g, '')
                                        })
                                    }
                                    }
                                    className='form-control'

                                />
                            </div>
                        </div>
                        <div className="col-12 mb-1">
                            <label className="form-label">Plastik</label>
                            <div className="input-group">
                                <div className="input-group-text">
                                    <input type="checkbox" checked={price?.is_card} onChange={(e: any) => {

                                        let value = e.target.checked
                                        setPrice({ ...price, is_card: value, })

                                    }} className='form-check-input' />
                                </div>
                                <NumericFormat
                                    value={item?.card_price}
                                    thousandSeparator
                                    disabled
                                    className='form-control'

                                />
                                <button className="btn btn-primary" type='button'
                                    onClick={() => {
                                        setPrice({
                                            ...price,

                                            give_card_price: item?.card_price
                                        })
                                    }}
                                >
                                    <BiTransfer />
                                </button>
                                <NumericFormat
                                    value={price?.give_card_price}
                                    thousandSeparator


                                    onChange={(e: any) => {
                                        setPrice({
                                            ...price,

                                            give_card_price: e.target.value.replace(/,/g, '')
                                        })
                                    }
                                    }
                                    className='form-control'

                                />
                            </div>
                        </div>
                        <div className="col-12 mb-1">
                            <label className="form-label">Otkazma</label>
                            <div className="input-group">
                                <div className="input-group-text">
                                    <input type="checkbox" checked={price?.is_transfer} onChange={(e: any) => {
                                        let value = e.target.checked
                                        setPrice({ ...price, is_transfer: value })

                                    }} className='form-check-input' />
                                </div>
                                <NumericFormat
                                    value={item?.transfer_price}
                                    thousandSeparator
                                    disabled
                                    className='form-control'

                                />
                                <button className="btn btn-primary" type='button'
                                    onClick={() => {
                                        setPrice({
                                            ...price,

                                            give_transfer_price: item?.transfer_price
                                        })
                                    }}
                                >
                                    <BiTransfer />
                                </button>
                                <NumericFormat
                                    value={price?.give_transfer_price}
                                    thousandSeparator


                                    onChange={(e: any) => {

                                        setPrice({
                                            ...price,
                                            give_transfer_price: +e.target.value.replace(/,/g, '')
                                        })
                                    }
                                    }
                                    className='form-control'

                                />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary" type='button'
                            onClick={() => {
                                setPrice({
                                    ...price,
                                    give_card_price: item?.card_price,
                                    give_cash_price: item?.cash_price,
                                    give_transfer_price: item?.transfer_price,

                                })
                            }}
                        >
                            <BiTransfer />
                        </button>
                        <button className='btn btn-primary'>Saqlash</button>
                        <button className='btn btn-danger' type='button' onClick={() => toggle()}>ortga</button>
                    </div>
                </form>

            </Modal>

            <iframe
                ref={iframeRef}
                srcDoc={`<html><body>${htmlCode}</body></html>`}
                style={{ display: 'none' }} // Iframeni ko'rinmas qilish
            ></iframe>
        </>


    )
}

export default DailyRepot
