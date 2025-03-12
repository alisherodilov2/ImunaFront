import React, { useEffect } from 'react'
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
import { useSelector } from 'react-redux'
import { ReducerType } from '../../../interface/interface'
import Select from 'react-select';

const CounterpartyRepot = (
) => {
    const [load, setLoad] = React.useState(false)
    const [data, setData] = React.useState<any>({
        data: [],
        start_date: '',
        end_date: '',
    })
    const { user, target_branch } = useSelector((state: ReducerType) => state.ProfileReducer)
    const [search, setSearch] = React.useState({
        branch: target_branch == 'all' ? { label: 'Barcha filallar', value: 'all' } : (target_branch > 0 ? user?.branch?.find((item: any) => item?.value == target_branch) : user?.branch?.at(0)),
    } as any)
    const show = async (data: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/repot/counterparty?start_date=${data?.start_date}&end_date=${data?.end_date}&branch_id=${data?.branch?.value ?? ''}`)
            const { result } = res.data
            setData(() => result)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    useEffect(() => {
        show({
            ...data,
            branch: target_branch == 'all' ? { label: 'Barcha filallar', value: 'all' } : (target_branch > 0 ? user?.branch?.find((item: any) => item?.value == target_branch) : user?.branch?.at(0))
        })
    }, [])
    const path = useNavigate()

    return (
        <Content loading={load}>
            <Navbar />
            <div className="container-fluid flex-grow-1 container-p-y size_16">
                <div className=" my-1 ">
                    <form className='row w-auto w-lg-100'>
                        {
                            user?.is_main_branch ? '' :
                                <div className="col-lg-2 col-12 my-1">
                                    <Select
                                        name='name'
                                        isDisabled={user?.is_main_branch || load}
                                        value={search?.branch}
                                        onChange={(e: any) => {
                                            setSearch(({ ...search, branch: e }))
                                            show({
                                                ...data, start_date: '', end_date: '', branch: e
                                            })
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
                        <div className="col-lg-2 col-6">
                            <Input type='date' onChange={(e: any) => {
                                let value = e.target.value
                                if (value && value.length > 0) {
                                    // dispatch(isReferringDoctorGet(`?is_repot=1&start_date=${value}&end_date=${referringDoctorData?.end_date}`))
                                    show({
                                        ...data, start_date: value,
                                        branch: search?.branch
                                    })
                                }
                            }}
                                value={data?.start_date}
                            />
                        </div>
                        <div className="col-lg-2 col-6">
                            <Input type='date' min={data?.start_date} onChange={(e: any) => {
                                let value = e.target.value
                                if (value && value.length > 0) {
                                    show({
                                        ...data, end_date: value,
                                        branch: search?.branch
                                    })
                                    // dispatch(isReferringDoctorGet(`?is_repot=1&start_date=${referringDoctorData?.start_date}&end_date=${value}`))
                                }
                            }}
                                value={data?.end_date}
                            />
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
                            setSearch({ branch: user?.branch?.at(0) })
                            show({
                                ...data,

                            })
                        }}
                        extraKeys={[
                            'full_name_',
                            'docotor_count_',
                            'client_count_',
                            'total_price_',
                            'ulushi',
                            'klinka',
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
                                key: 'full_name_',
                                renderItem: (value: any, data: any) => {
                                    return <td onClick={() => {
                                        path('/counterparty/' + value?.id)
                                    }}>
                                        <b>{masulRegUchunFullName(value)}</b>
                                    </td>
                                }
                            },
                            {
                                title: 'Doktor soni',
                                key: 'docotor_count_',
                                render: (value: any, data: any) => {
                                    return value?.docotor_count
                                }
                            },
                            {
                                title: 'Mijoz soni',
                                key: 'client_count_',
                                render: (value: any, data: any) => {
                                    return value?.client_count
                                }
                            },

                            {
                                title: "Summa",
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
                                        value={value?.kounteragent_contribution_price} />
                                }
                            },
                            {
                                title: "klinka",
                                key: 'klinka',
                                render: (value: any, data: any) => {
                                    return value?.owner?.name
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
                            data?.data
                        }
                    />
                </div>
            </div>
        </Content>


    )
}

export default CounterpartyRepot
