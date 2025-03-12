import React, { useState } from 'react'
import { formatId } from '../../../helper/idGenerate'
import { getCurrentDateTime } from '../../../helper/dateFormat'
import { fullName } from '../../../helper/fullName'
import Table from '../../../componets/table/Table'
import { Modal } from 'reactstrap'
import { NumericFormat } from 'react-number-format'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Select from 'react-select';
import { exportToExcel } from '../../../helper/exportToExcel'
const ClientView = (
    {
        data,
        modal,
        setModal
    }: {
        data: any,
        modal: boolean,
        setModal: any
    }
) => {
    const toggle = () => {
        setModal(!modal)
        setSearch({
            department: {
                label: "Bo'limlar",
                value: 'all'
            },
            service: {
                label: 'Xizmatlar',
                value: 'all'
            }
        })
    }
    const { id } = useParams()
    const [load, setLoad] = useState(false)
    const [datas, setData] = useState<any>({})

    const serviceCheck = (id: any, data: any,) => {
        return data?.find((item: any) => +item?.id === +id && +item?.is_active)
    }
    const show = async (id: any, data: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/repot/counterparty/${id}?start_date=${data?.start_date}&end_date=${data?.end_date}`)
            const { result } = res.data
            setData(() => result)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const [search, setSearch] = useState<any>({
        department: {
            label: "Bo'limlar",
            value: 'all'
        },
        service: {
            label: 'Xizmatlar',
            value: 'all'
        }
    })
    const dataSelect = (data: any) => {
        return data?.map((item: any) => {
            return {
                value: item?.id, label: item?.name || item?.type,
                data: item
            }
        })
    }
    const serviceData = (data: any) => {
        let res = [] as any;
        for (let item of data) {
            for (let key of item?.client?.client_value) {
                if (!res?.find((resItem: any) => resItem?.id == key?.service?.id)) {
                    res.push(key.service)
                }
            }

        }
        return res
    }

    const filterData = (data: any, search: any) => {
        let res = data as any;
        if (search?.department?.value > 0) {
            res = res.filter((item: any) => item.client?.client_value?.filter((res: any) => +res?.is_active && res?.department_id == search?.department?.value)?.length > 0)
        }
        if (search?.service?.value > 0) {
            res = res.filter((item: any) => item.client?.client_value?.filter((res: any) =>+res?.is_active &&  res?.service_id == search?.service?.value)?.length > 0)
        }
        return res
    }
    return (
        <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='xl' backdrop="static" keyboard={false}>
            <div className="modal-header">
                <div className="row w-100">
                    <h5 className="modal-title col-2">Ambulator</h5>
                    <div className="col-3">
                        <Select
                            name='name'
                            value={search?.department}
                            onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        ...res,
                                        department: e,
                                        service: {
                                            label: 'Xizmatlar',
                                            value: 'all'
                                        }
                                    }
                                })
                            }}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            options={
                                [
                                    {
                                        label: "Bo'limlar",
                                        value: 'all'
                                    },
                                    ...dataSelect(data?.department ?? [])
                                ]
                            } />
                    </div>
                    <div className="col-6">
                        <Select
                            name='name'
                            value={search?.service}
                            onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        ...res,
                                        service: e,

                                    }
                                })
                            }}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            options={
                                [
                                    {
                                        label: 'Xizmatlar',
                                        value: 'all'
                                    },
                                    ...dataSelect(serviceData(data?.referring_doctor_balance ?? [])?.filter((res: any) => {
                                        if (search?.department?.value > 0) {
                                            return res?.department_id == search?.department?.value
                                        }
                                        return res
                                    }))
                                ]
                            } />
                    </div>

                    <div className="col-1">
                        <button className="btn btn-success " type="button" onClick={() => {
                            let resultData = [...data?.referring_doctor_balance
                                ?.filter((item: any) => {
                                    if (search?.department?.value > 0 || search?.service?.value > 0) {
                                        return search?.service?.value > 0 ? item.client?.client_value?.filter((res: any) => +res?.is_active && res?.service_id == search?.service?.value)?.length > 0 : item.client?.client_value?.filter((res: any) =>+res?.is_active && res?.department_id == search?.department?.value)?.length > 0
                                    }
                                    return item
                                    // if (search?.department?.value > 0) {
                                    //     res = res.filter((item: any) => item.client?.client_value?.filter((res: any) => res?.department_id == search?.department?.value)?.length > 0)
                                    // }
                                    // if (search?.service?.value > 0) {
                                    //     res = res.filter((item: any) => item.client?.client_value?.filter((res: any) => res?.service_id == search?.service?.value)?.length > 0)
                                    // }
                                })
                                ?.map((item: any, index: number) => {
                                    let allData = item?.client?.client_value
                                    let data = "" as any;
                                    let serviceId = [] as any
                                    for (let res of allData?.filter((res: any) => {
                                        if (search?.department?.value > 0 || search?.service?.value > 0) {
                                            return +res?.is_active && (search?.service?.value > 0 ? res?.service_id == search?.service?.value : res?.department_id == search?.department?.value)
                                        }
                                        return +res?.is_active
                                    })) {
                                        if (!serviceId?.find((resItem: any) => resItem == res?.service?.id)) {
                                            if (data != "") {
                                                data += ", " + res?.service?.name

                                            } else {
                                                data = res?.service?.name
                                            }
                                            serviceId.push(res?.service?.id)
                                        }
                                    }
                                    let total_price = item?.client?.total_price;
                                    let total_kounteragent_contribution_price = item?.total_kounteragent_contribution_price
                                    let total_kounteragent_doctor_contribution_price = item?.total_kounteragent_doctor_contribution_price
                                    let contribution_history = JSON.parse(item?.contribution_history ?? "[]")
                                    if (search.department.value > 0 || search.service.value > 0) {
                                        let resData = contribution_history?.filter((item1: any) => serviceCheck(item1?.client_value, item?.client?.client_value) && (search.service.value > 0 ? item1?.service_id == search.service.value : item1?.department_id == search.department.value))
                                        total_price = resData?.reduce((a: any, b: any) => a + +b.price * b.qty, 0)
                                        total_kounteragent_contribution_price = resData?.reduce((a: any, b: any) => a + +b.total_kounteragent_contribution_price, 0)
                                        total_kounteragent_doctor_contribution_price = resData?.reduce((a: any, b: any) => a + +b.total_kounteragent_doctor_contribution_price, 0)
                                    }
                                    return {
                                        ["№"]: index + 1,
                                        ["F.I.O"]: fullName(item?.client),
                                        ["Xizmatlar"]: data,
                                        ["Telefon"]: item?.client?.phone ?? '-',
                                        ["Summa "]: total_price,
                                        ["Agent ulushi"]: item?.total_kounteragent_contribution_price,
                                        ["SHifokor ulushi"]: item?.total_kounteragent_doctor_contribution_price,
                                        ["Kelgna sana"]: getCurrentDateTime(item?.client.created_at)
                                    }
                                })]
                            exportToExcel(resultData)
                        }}>Eksport</button>
                    </div>
                </div>
                <button
                    type="button"
                    className="close btn-close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={toggle}
                >
                    {/* <span aria-hidden="true">&times;</span> */}
                </button>
            </div>
            <div className="modal-body">

                <div className="card" style={{
                    height: `${window.innerHeight / 1.5}px`,
                    overflow: 'auto'
                }}>
                    <Table
                        paginationRole={false}
                        isLoading={false}
                        isSuccess={true}
                        extraKeys={[
                            'full_name',
                            'service',
                            'phone_',
                            'total_price_',
                            'kounteragent_contribution_price_',
                            'kounteragent_doctor_contribution_price_'
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
                                title: "F.I.O",
                                key: 'full_name',
                                renderItem: (value: any, data: any) => {
                                    return <td onClick={() => {
                                    }}>

                                        <b>{fullName(value?.client)}</b>
                                        <br />
                                        <span className='text-info register_date'  >
                                            {getCurrentDateTime(value?.client.created_at)}
                                        </span>
                                    </td>
                                }
                            },
                            {
                                title: "Xizmatlar",
                                key: 'service',
                                render: (value: any) => {
                                    let allData = value?.client?.client_value
                                    let data = [] as any;
                                    let serviceId = [] as any
                                    for (let res of allData?.filter((res: any) => {
                                        if (search?.department?.value > 0 || search?.service?.value > 0) {
                                            return +res?.is_active && (search?.service?.value > 0 ? res?.service_id == search?.service?.value : res?.department_id == search?.department?.value)
                                        }
                                        return +res?.is_active
                                    })) {
                                        if (!serviceId?.find((resItem: any) => resItem == res?.service?.id)) {

                                            data.push(<p className={
                                                `mb-1 text-white badge bg-secondary`
                                            }>
                                                {res?.service?.name}
                                            </p>)
                                            serviceId.push(res?.service?.id)
                                        }
                                    }

                                    return <div className="d-flex align-items-center gap-1 flex-wrap ">
                                        {/* {
                                            client_value?.map((res: any, index: number) => {
                                                return <p className={
                                                    `mb-1 text-white badge bg-${client_result?.find((resItem: any) => resItem?.department_id == res?.department_id && resItem?.is_check_doctor == 'finish') ? 'success' : 'secondary'}`
                                                }>
                                                    {res?.service?.name}
                                                </p>
                                            })
                                        } */}
                                        {data}
                                    </div>
                                }
                            },
                            {
                                title: 'Tel',
                                key: 'phone_',
                                render: (value: any, data: any) => {
                                    return `+998${value?.client?.phone}`
                                }
                            },

                            {
                                title: "Summa",
                                key: 'total_price_',
                                render: (value: any, data: any) => {
                                    let contribution_history = JSON.parse(value?.contribution_history ?? "[]")
                                    if (search.department.value > 0 || search.service.value > 0) {
                                        let resData = contribution_history?.filter((item: any) => serviceCheck(item?.client_value, value?.client?.client_value) && (search.service.value > 0 ? item?.service_id == search.service.value : item?.department_id == search.department.value))
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={resData?.reduce((a: any, b: any) => a + +b.price * b.qty, 0)} />
                                    }
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.client?.total_price} />
                                }
                            },
                            {
                                title: "Agent ulushi",
                                key: 'kounteragent_contribution_price_',
                                render: (value: any, data: any) => {
                                    let contribution_history = JSON.parse(value?.contribution_history ?? "[]")
                                    if (search.department.value > 0 || search.service.value > 0) {
                                        let resData = contribution_history?.filter((item: any) => serviceCheck(item?.client_value, value?.client?.client_value) && (search.service.value > 0 ? item?.service_id == search.service.value : item?.department_id == search.department.value))
                                        console.log('resData', resData);
                                        // return JSON.stringify(resData)
                                        // return resData?.length
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={resData?.reduce((a: any, b: any) => a + +b.total_kounteragent_contribution_price, 0)} />
                                    }
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.total_kounteragent_contribution_price} />
                                }
                            },
                            {
                                title: "SHifokor ulushi",
                                key: 'kounteragent_doctor_contribution_price_',
                                render: (value: any, data: any) => {
                                    let contribution_history = JSON.parse(value?.contribution_history ?? "[]")
                                    if (search.department.value > 0 || search.service.value > 0) {
                                        let resData = contribution_history?.filter((item: any) => serviceCheck(item?.client_value, value?.client?.client_value) && (search.service.value > 0 ? item?.service_id == search.service.value : item?.department_id == search.department.value))
                                        console.log('resData', resData);
                                        // return resData?.length
                                        return <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={resData?.reduce((a: any, b: any) => a + +b.total_kounteragent_doctor_contribution_price, 0)} />
                                    }
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.total_kounteragent_doctor_contribution_price} />
                                }
                            },
                            // {
                            //     title: 'Tashriflar',
                            //     key: 'welcome_count_',
                            //     render: (value: any, data: any) => {
                            //         return <>
                            //             <NumericFormat displayType="text"
                            //                 thousandSeparator
                            //                 decimalScale={2}
                            //                 value={value?.welcome_count} /></>
                            //     }
                            // },




                        ]}
                        dataSource={
                            // []
                            filterData(data?.referring_doctor_balance, search)
                            // data?.referring_doctor_balance?.filter((item: any) => {
                            //     if (search.department.value == 'all') return item
                            //     return item.client?.client_value?.filter((res: any) => res?.department_id == search?.department?.value)?.length > 0
                            // })
                        }
                    />
                </div>
                <div className="flex gap-5">
                    <h3 className='text-right'>Jami: <NumericFormat displayType="text" thousandSeparator decimalScale={2} value={filterData(data?.referring_doctor_balance, search)
                        ?.map((item: any) => {
                            if (search.department.value > 0 || search.service.value > 0) {
                                let contribution_history = JSON.parse(item?.contribution_history ?? "[]")
                                return {
                                    total_price: contribution_history?.filter((res: any) => serviceCheck(res?.client_value, item?.client?.client_value) && (search.service.value > 0 ? res?.service_id == search.service.value : res?.department_id == search.department.value))?.reduce((a: any, b: any) => a + +b.price * +b.qty, 0)
                                }
                            }
                            return item
                        })
                        ?.reduce((a: any, b: any) => a + +b.total_price, 0)} /> </h3>
                    <h3 className='text-right'>Agent ulushi: <NumericFormat displayType="text" thousandSeparator decimalScale={2} value={filterData(data?.referring_doctor_balance, search)

                        ?.map((item: any) => {
                            if (search.department.value > 0 || search.service.value > 0) {
                                let contribution_history = JSON.parse(item?.contribution_history ?? "[]")
                                return {
                                    total_price: contribution_history?.filter((res: any) => serviceCheck(res?.client_value, item?.client?.client_value) && (search.service.value > 0 ? res?.service_id == search.service.value : res?.department_id == search.department.value))?.reduce((a: any, b: any) => a + +b.total_kounteragent_contribution_price, 0)
                                }
                            }
                            return {
                                total_price: item?.total_kounteragent_contribution_price
                            }
                        })
                        ?.reduce((a: any, b: any) => a + +b.total_price, 0)} /> </h3>
                    <h3 className='text-right'>	SHifokor ulushi: <NumericFormat displayType="text" thousandSeparator decimalScale={2} value={filterData(data?.referring_doctor_balance, search)
                        ?.map((item: any) => {
                            if (search.department.value > 0 || search.service.value > 0) {
                                let contribution_history = JSON.parse(item?.contribution_history ?? "[]")
                                return {
                                    total_price: contribution_history?.filter((res: any) => serviceCheck(res?.client_value, item?.client?.client_value) && (search.service.value > 0 ? res?.service_id == search.service.value : res?.department_id == search.department.value))?.reduce((a: any, b: any) => a + +b.total_kounteragent_doctor_contribution_price, 0)
                                }
                            }
                            return {
                                total_price: item?.total_kounteragent_doctor_contribution_price
                            }
                        })
                        ?.reduce((a: any, b: any) => a + +b.total_price, 0)} /> </h3>
                </div>
            </div>
            <div className="modal-footer">
                <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                    onClick={toggle}
                >
                    Chiqish
                </button>
            </div>
        </Modal>

    )
}

export default ClientView
