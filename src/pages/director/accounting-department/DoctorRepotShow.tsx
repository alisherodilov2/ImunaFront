import React, { useEffect, useState } from 'react'
import { formatId } from '../../../helper/idGenerate'
import { getCurrentDateTime } from '../../../helper/dateFormat'
import { fullName, masulRegUchunFullName } from '../../../helper/fullName'
import Table from '../../../componets/table/Table'
import { NumericFormat } from 'react-number-format'
import Content from '../../../layout/Content'
import Navbar from '../../../layout/Navbar'
import axios from 'axios'
import Select from 'react-select';
import { useNavigate, useParams } from 'react-router-dom'
import Input from '../../../componets/inputs/Input'
import { dateFormat } from '../../../service/helper/day'
import Pagination from '../../../componets/pagination/Pagination'
import ClientAllDoctorRepotShow from './ServiceAllDoctorRepotShow'
import { exportToExcel } from '../../../helper/exportToExcel'

const DoctorRepotShow = (
) => {
    const [load, setLoad] = React.useState(false)
    const [data, setData] = React.useState<any>({
        data: [],
        start_date: '',
        end_date: '',
        per_page: 500,
    })
    const { id } = useParams()
    const show = async (data: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/repot/doctor/${id}?start_date=${data?.start_date}&end_date=${data?.end_date}&per_page=${data?.per_page ?? 500}&page=${data?.page ?? 1}&full_name=${data?.full_name ?? ''}&batch_number=${data?.batch_number > 0 ? data?.batch_number : ''}`)
            const { result } = res.data
            setData(() => result)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }

    const [modal2, setModal2] = useState(false as any)
    const [item, setItem] = useState({} as any)
    const clietshow = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/repot/doctor-service/${id}`)
            const { result } = res.data
            setItem(() => result)
            setModal2(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    useEffect(() => {
        show(data)
    }, [])
    const path = useNavigate()
    const [search, setSearch] = React.useState<any>({
        full_name: '',
        phone: '',
        person_id: '',
        data_birth: '',
    })
    const filter = (data: any, serachData: any) => {

        let response = data as any;

        if (serachData?.full_name?.trim()?.length > 0) {
            response = response?.filter((res: any) =>
                (res?.client?.first_name)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase()) || (res?.client?.last_name)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase())

            )
        }
        if ((serachData?.status?.value ?? '')?.trim()?.length > 0) {
            response = response?.filter((res: any) => res?.daily_repot?.status === serachData?.status?.value)

        }

        return response



    }
    return (
        <Content loading={load}>
            <Navbar />
            <div className="container-fluid flex-grow-1 container-p-y size_16">

                <div className=" my-1 ">
                    <form className='row '>

                        <div className="col-lg-4 col-12 my-1">
                            <div className="d-flex justify-content-between gap-2">
                                <Input type='date' onChange={(e: any) => {
                                    let value = e.target.value
                                    if (value && value.length > 0) {
                                        // dispatch(isReferringDoctorGet(`?is_repot=1&start_date=${value}&end_date=${referringDoctorData?.end_date}`))
                                        show({
                                            ...data, start_date: value,
                                            full_name: search?.full_name
                                        })
                                    }
                                }}
                                    value={data?.start_date}
                                />
                                <Input type='date' min={data?.start_date} onChange={(e: any) => {
                                    let value = e.target.value
                                    if (value && value.length > 0) {
                                        show({
                                            ...data, end_date: value,
                                            full_name: search?.full_name
                                        })
                                        // dispatch(isReferringDoctorGet(`?is_repot=1&start_date=${referringDoctorData?.start_date}&end_date=${value}`))
                                    }
                                }}
                                    value={data?.end_date}
                                />
                            </div>

                        </div>
                        <div className="col-lg-3 col-6 my-1">
                            <Input placeholder='F.I.O Izlash...' disabled={load ? true : false} onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        ...res,
                                        full_name: e.target.value?.trim().toLowerCase()
                                    }
                                })

                            }}
                                onKeyDown={
                                    (e: any) => {
                                        setSearch((res: any) => {
                                            return {
                                                ...res,
                                                full_name: e.target.value?.trim().toLowerCase()
                                            }
                                        })
                                        if (e.key === 'Enter') {
                                            setSearch((res: any) => {
                                                return {
                                                    ...res,
                                                    batch_number: false
                                                }
                                            })
                                            show({
                                                ...data,
                                                batch_number: 0,
                                                status: false,

                                                full_name: e.target.value?.trim().toLowerCase()
                                            })
                                            // dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&full_name=${e.target.value?.trim().toLowerCase()}`))
                                        }
                                    }
                                }
                                value={search?.full_name}
                            />
                        </div>
                        <div className="col-lg-2 col-6  my-1">
                            <Select
                                name='name'
                                placeholder='Smenalar'
                                value={search?.batch_number}
                                onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            batch_number: e,
                                            status: false
                                        }
                                    })
                                    show({
                                        ...data,
                                        batch_number: e.value
                                    })
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={
                                    [
                                        {
                                            label: 'Smenalar',
                                            value: '0'
                                        },
                                        ...(data?.batch_number?.length > 0 ? data?.batch_number : [])?.map((item: any) => {
                                            return {
                                                label: `${item} - smena`,
                                                value: item
                                            }
                                        })
                                    ]
                                } />

                        </div>
                        <div className="col-lg-2 col-6  my-1">
                            <Select
                                name='name'
                                placeholder='Holati'
                                value={search?.status}
                                onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            status: e
                                        }
                                    })
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={
                                    [
                                        {
                                            label: 'Holati',
                                            value: ''
                                        },
                                        {
                                            label: 'Yakunlangan',
                                            value: 'finish'
                                        },
                                        {
                                            label: 'Yakunlanmagan',
                                            value: 'start'
                                        },


                                    ]
                                } />

                        </div>
                        <div className="col-lg-1 col-4 my-1">
                            <button className="btn btn-success " type="button" onClick={() => {
                                let resultData = [...filter(data?.data, search).map((item: any, index: number) => {
                                    return {
                                        ["№"]: index + 1,
                                        ["sana"]: getCurrentDateTime(item.client.created_at),
                                        ["Smena"]: item?.daily_repot?.batch_number > 0 ? `${item?.daily_repot?.batch_number}- smena` : '-',
                                        ["I.F.SH"]: fullName(item?.client),
                                        ["ID"]: formatId(item?.client?.person_id),
                                        ["Xizmat soni"]: item?.service_count,
                                        ["Umumiy narxi "]: item?.total_price,
                                        ["Ulushi "]: item?.total_doctor_contribution_price,
                                    }
                                })]
                                exportToExcel(resultData)
                            }}>Eksport</button>
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
                            show({
                                start_date: '',
                                end_date: ''
                            })
                            setSearch(() => ({
                                start_date: '',
                                end_date: '',
                                full_name: '',
                                batch_number: 0,
                                status: false
                            }))
                        }}
                        extraTrFunction={() => {
                            return <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                    <b>
                                        <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={
                                                filter(data?.data, search)?.reduce((a: any, b: any) => a + +b?.service_count, 0)
                                            } />
                                    </b>
                                </td>
                                <td>
                                    <b>

                                        <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={
                                                filter(data?.data, search)?.reduce((a: any, b: any) => a + +b?.total_price, 0)
                                            } />
                                    </b>
                                </td>
                                <td>
                                    <b>

                                        <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={
                                                filter(data?.data, search)?.reduce((a: any, b: any) => a + +b?.total_doctor_contribution_price, 0)
                                            } />

                                    </b>
                                </td>
                            </tr>
                        }}
                        extraKeys={[
                            'sana',
                            'smena',
                            'full_name_',
                            'docotor_count_',
                            'client_count_',
                            'total_price_',
                            'ulushi',
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
                                title: "Sana",
                                key: 'sana',
                                renderItem: (value: any, data: any) => {
                                    return <td onClick={() => {
                                        clietshow(value?.id)
                                    }}>
                                        <b>{getCurrentDateTime(value.client.created_at)}</b>
                                    </td>
                                }
                            },
                            {
                                title: "Smena",
                                key: 'smena',
                                renderItem: (value: any, data: any) => {
                                    return <td onClick={() => {
                                        clietshow(value?.id)
                                    }}
                                        className={
                                            value?.daily_repot?.id > 0 ?
                                                value?.daily_repot?.status == 'start' ? ' text-white bg-danger' : 'bg-success text-white ' : ''

                                        }

                                    >
                                        <b>{value?.daily_repot?.batch_number > 0 ? `${value?.daily_repot?.batch_number}- smena` : '-'}</b>
                                    </td>
                                }
                            },
                            {
                                title: "F.I.O",
                                key: 'full_name_',
                                renderItem: (value: any, data: any) => {
                                    return <td onClick={() => {
                                        clietshow(value?.id)
                                    }}>
                                        <b>{fullName(value?.client)}</b>
                                    </td>
                                }
                            },
                            {
                                title: 'ID',
                                key: 'docotor_count_',
                                render: (value: any, data: any) => {
                                    return formatId(value?.client?.person_id)
                                }
                            },
                            {
                                title: 'Xozmat soni',
                                key: 'client_count_',
                                render: (value: any, data: any) => {
                                    return value?.service_count
                                }
                            },

                            {
                                title: "Umumiy narxi",
                                key: 'total_price_',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.total_price} />
                                }
                            },
                            {
                                title: "Ulushi",
                                key: 'ulushi',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.total_doctor_contribution_price} />
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
                            filter(data?.data, search)
                        }
                    />
                </div>
                <br />
                {
                    load ? '' :
                        <Pagination

                            setPageLimit={(e: any) => {
                                // setNumberOfPages(Math.ceil(clientData?.length / e))
                                // setPageLimit(e)
                                // dispatch(isClientCurrentPage(1))
                                // dispatch(isClientPageLimit(e))

                                // dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&data_birth=${search?.data_birth}&full_name=${search?.full_name}&person_id=${search?.person_id}&status=${clientData?.use_status}&phone=${search?.phone}&page=${1}&per_page=${e}`))
                                show({
                                    ...data,
                                    full_name: search?.full_name,
                                    per_page: e
                                })
                            }}
                            pageLmit={data?.per_page}
                            current={data?.current_page} total={data?.last_page} count={(e: any) => {
                                show({
                                    ...data,
                                    full_name: search?.full_name,
                                    per_page: data?.per_page,
                                    page: e
                                })
                                // dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&data_birth=${search?.data_birth}&full_name=${search?.full_name}&person_id=${search?.person_id}&status=${clientData?.use_status}&phone=${search?.phone}&page=${e}&per_page=${clientData?.per_page}`))
                            }} />
                }
            </div>
            <ClientAllDoctorRepotShow
                modal={modal2}
                setModal={setModal2}
                data={item}
            />
        </Content>


    )
}

export default DoctorRepotShow
