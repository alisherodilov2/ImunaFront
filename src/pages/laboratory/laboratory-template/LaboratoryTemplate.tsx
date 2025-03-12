import React, { useEffect, useState } from 'react'
import Navbar from '../../../layout/Navbar'
import Content from '../../../layout/Content'
import { NumericFormat } from 'react-number-format'
import { ReducerType } from '../../../interface/interface'
import { useDispatch, useSelector } from 'react-redux'
import Table from '../../../componets/table/Table'
import Swal from 'sweetalert2'
import Input from '../../../componets/inputs/Input'
import Select from 'react-select';
import { isEditService, isServiceGet } from '../../../service/reducer/ServiceReducer'
import { AppDispatch } from '../../../service/store/store'
import { IoMdSettings } from 'react-icons/io'
import { Modal } from 'reactstrap'
import axios from 'axios'
import { read, utils, writeFileXLSX } from 'xlsx'

import { nanoid } from '@reduxjs/toolkit'
import { MdDeleteForever } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const LaboratoryTemplate = () => {
    const [data, setData] = useState([])
    const { page, serviceData, massage, isLoading, isSuccess, pageLimit } = useSelector((state: ReducerType) => state.ServiceReducer)
    const filter = (data: any, serachData: any) => {
        if (serachData?.servicetype?.value === 'all' && serachData?.department?.value === 'all' && serachData.text === '') {
            return data
        }
        if (serachData?.servicetype?.value !== 'all' && serachData?.department?.value === 'all' && serachData.text === '') {
            return data.filter((item: any) => item.servicetype.id === serachData?.servicetype?.value)
        }
        if (serachData?.servicetype?.value === 'all' && serachData?.department?.value !== 'all' && serachData.text === '') {
            return data.filter((item: any) => item.department.id === serachData?.department?.value)
        }
        if (serachData?.servicetype?.value !== 'all' && serachData?.department?.value !== 'all' && serachData.text === '') {
            return data.filter((item: any) => item.servicetype.id === serachData?.servicetype?.value && item.department.id === serachData?.department?.value)
        }
        if (serachData?.servicetype?.value === 'all' && serachData?.department?.value === 'all' && serachData.text !== '') {
            return data.filter((item: any) => (item?.name?.toString().toLowerCase().includes(serachData.text)))
        }
        if (serachData?.servicetype?.value === 'all' && serachData?.department?.value !== 'all' && serachData.text !== '') {
            return data.filter((item: any) => item.department.id === serachData?.department?.value && (item?.name?.toString().toLowerCase().includes(serachData.text)))
        }
        if (serachData?.servicetype?.value !== 'all' && serachData?.department?.value === 'all' && serachData.text !== '') {
            return data.filter((item: any) => item.servicetype.id === serachData?.servicetype?.value && (item?.name?.toString().toLowerCase().includes(serachData.text)))
        }

        if (serachData?.servicetype?.value !== 'all' && serachData?.department?.value !== 'all' && serachData.text !== '') {
            return data.filter((item: any) => item.department.id === serachData?.department?.value && item.servicetype.id === serachData?.servicetype?.value && (item?.name?.toString().toLowerCase().includes(serachData.text)))
        }


    }
    const [search, setSearch] = useState({
        text: '',
        department: {
            value: 'all',
            label: 'Barchasi'
        },
        servicetype: {
            value: 'all',
            label: 'Barchasi'
        },
    } as any)
    const dataSelect = (data: any) => {
        return data?.map((item: any) => {
            return {
                value: item?.id, label: item?.name || item?.type,
                data: item
            }
        })
    }
    const dispatch = useDispatch<AppDispatch>()
    const [modal, setModal] = useState(false)
    const [item, setItem] = useState({
        id: '',
        data: []
    } as any)
    useEffect(() => {
        dispatch(isServiceGet(''))
    }, [])
    const toggle = () => {
        setModal(!modal)
    }
    const [load, setLoad] = useState(false)
    const getShow = async (id: any) => {
        try {
            setLoad(true)
            let res = await axios.get('/service/template/' + id)
            const { result } = res.data
            setItem(() => {
                return {
                    id: id,
                    data: result
                }
            })
            setModal(() => true)
        } catch (error) {

        }
        finally {
            setLoad(false)
        }
    }
    const send = async (item: any) => {
        try {
            setLoad(true)
            const { id, data } = item
            let fomrdata = new FormData();
            fomrdata.append('labatoratory_template', JSON.stringify(data))
            let res = await axios.post('/service/template/' + id, fomrdata)
            const { result } = res.data
            dispatch(isEditService(result))
            setItem(() => { })
            setModal(() => true)
            toggle()
        } catch (error) {

        }
        finally {
            setLoad(false)
        }
    }
    function handleFile(e: any) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function (event: any) {
            const data2 = new Uint8Array(event.target.result);
            const workbook = read(data2, { type: 'array' });

            // Assuming only one sheet in the Excel file
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convert worksheet data to JSON
            const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
            console.log('jsonData', jsonData);
            let resultData = jsonData.slice(1).map((item: any, index: number) => {
                return {
                    // 'name',
                    // 'result',
                    // 'normal',
                    // 'extra_column_1',
                    // 'extra_column_2',
                    id: nanoid(),
                    name: item?.at(1),
                    result: item?.at(2),
                    normal: item?.at(3),
                    extra_column_1: item?.at(4),
                    extra_column_2: item?.at(5),
                }
            })
            // ["Bo'lim"]: item?.department?.name,
            // ["Xizmat turi"]: item?.servicetype?.type,
            // ["Xizmat "]: item?.name,
            // ["Narxi "]: item?.price,
            // ["Doktor ulushi "]: item?.doctor_contribution_price,
            // ["Kontragent ulushi "]: item?.kounteragent_contribution_price,
            // ["Kounterdoktor ulushi "]: item?.kounteragent_doctor_contribution_price,
            send({
                id: item?.id, data: [
                    ...item?.data,
                    ...resultData
                ]
            })
            e.target.value = '';
            // Output JSON data
        };

        reader.readAsArrayBuffer(file);
    }
    const path = useNavigate()
    const servicetypeFilter = (data = [] as any) => {
        if (data?.length === 0) return [];
        let idAll = new Set(data?.map((res: any) => res?.servicetype?.id))
        let res = [];
        for (let key of [...idAll]) {
            const { id, type } = data?.find((resItem: any) => resItem?.servicetype?.id == key)?.servicetype ?? {};
            res.push({
                value: id,
                label: type
            })
        }
        return res;
    }
    return (
        <Content loading={load}>
            <Navbar />
            <div className="container-fluid flex-grow-1 py-1 size_16 ">
                <div className="my-2">
                    <form className='row w-100'>
                        <div className=" col-xl-4 col-lg-6 col-12 mb-2">
                            <Select
                                name='name'
                                value={search?.department}
                                onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            department: e
                                        }
                                    })
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={
                                    [
                                        {
                                            label: 'Hammasi',
                                            value: 'all'
                                        },
                                        ...dataSelect([])
                                    ]
                                } />
                        </div>
                        <div className=" col-xl-4 col-lg-6 d-none d-lg-block">
                            <Select
                                name='name'
                                value={search?.servicetype}
                                onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            servicetype: e
                                        }
                                    })
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={
                                    [
                                        {
                                            label: 'Hammasi',
                                            value: 'all'
                                        },
                                        ...(servicetypeFilter(serviceData))
                                    ]
                                } />
                        </div>
                        <div className=" col-xl-4 col-lg-6 col-12 mb-2">
                            <Input placeholder='Izlash...' onChange={(e: any) => {
                                setSearch((res: any) => {
                                    return {
                                        ...res,
                                        text: e.target.value?.trim().toLowerCase()
                                    }
                                })
                            }}
                                value={search?.text}
                            />
                        </div>

                    </form>
                </div>
                <div className="card" style={{
                    height: `${window.innerHeight / 1.7}px`,
                    overflow: 'auto'
                }}>
                    <Table
                        excelFileImportFunction={(data: any) => {
                            Swal.fire({
                                title: "Faylni yuklaysizmi?",
                                showDenyButton: true,
                                showCancelButton: true,
                                confirmButtonText: 'Ha',
                                denyButtonText: `Yo'q`,
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    let resultData = data.slice(1).map((item: any, index: number) => {
                                        return {
                                            title: item?.at(1),
                                            name: item?.at(2),
                                            result_time_type: item?.at(3),
                                            result_time: item?.at(4),
                                            container: item?.at(5),
                                            container_quantity: /^\d*\.?\d+$/.test(item?.at(6)) ? item?.at(6) : null,
                                            price: item?.at(7),
                                            code: item?.at(8),
                                            result_template: item?.at(9),
                                        }
                                    })
                                    console.log(resultData);

                                    // for (let i = 0; i <= Math?.ceil(resultData?.length / 100); i++) {
                                    //     let cut = resultData.slice((i * 100) - 100, i * 100)
                                    // }
                                    // dispatch(isDiagnosisAddExcelFile({ dataExcel: JSON.stringify(resultData) }))
                                    // Toast.fire('Success excel file add', '', 'success')
                                }
                            })

                        }}
                        excelFileExportFunction={(data: any) => {
                            // let resultData = [...data.map((item: any, index: number) => {
                            //     let { name, capacity } = storageData?.find((a: any) => a?.id == item.container_id)
                            //     return {
                            //         ["№"]: index + 1,
                            //         ["Таҳлил гуруҳи номи"]: item?.title,
                            //         ["Тест номи"]: item?.name,
                            //         ["Натижа чиқиш вақт тури"]: item?.result_time_type,
                            //         ["Натижа чиқиш вақт қиймати"]: item?.result_time,
                            //         ["Пробирка"]: name,
                            //         ["Пробирка cиғими"]: /^\d*\.?\d+$/.test(capacity) ? capacity : '',
                            //         ["Таҳлил суммаси"]: item?.price,
                            //         ["Код"]: item?.code,
                            //         ["Натижа Шаблон"]: item?.title,
                            //     }
                            // })]
                            // exportToExcel(resultData)
                        }}

                        paginationRole={false}
                        errorMassage={massage}
                        isLoading={isLoading}
                        isSuccess={isSuccess}
                        reloadData={true}

                        reloadDataFunction={() => {
                            // if ((department_id && +department_id > 0) && (servicetype_id && +servicetype_id > 0)) {
                            //     dispatch(isServiceGet(`?department_id=${department_id}&servicetype_id=${servicetype_id}`))
                            // } else {
                            //     dispatch(isServiceGet(''))
                            // }
                            dispatch(isServiceGet(''))
                        }}
                        top={100}
                        scrollRole={true}

                        extraButtonRole={true}
                        extraButton={((item: any) => {
                            return <button className='btn btn-warning btn-sm'
                                onClick={() => {
                                    path('/lab-template/' + item?.id)
                                    // getShow(item?.id)
                                    // setItem2(() => { })
                                    // show(item?.id)
                                    // setModal2((prev: any) => true)
                                    // setItem(() => item)
                                }}>
                                <IoMdSettings />
                            </button>
                        })}

                        columns={[
                            {
                                title: '№',
                                key: 'id',
                                render: (value: any, data: any) => {
                                    return <div key={data.index} className='d-flex  align-items-center gap-1'>
                                        <span>
                                            {((data?.index + 1) + (page * pageLimit) - pageLimit)}
                                        </span>
                                    </div>
                                }
                            },
                            // {
                            //     title: "Bo'limi",
                            //     key: 'department',
                            //     render: (value: any, data: any) => {
                            //         return < >
                            //             {value?.name}
                            //         </>
                            //     }
                            // },
                            // {
                            //     title: 'Xizmat turi',
                            //     key: 'servicetype',
                            //     render: (value: any, data: any) => {
                            //         return < >
                            //             {value?.type}
                            //         </>
                            //     }
                            // },
                            {
                                title: 'Xizmat nomi',
                                key: 'name',
                                renderItem: (value: any, data: any) => {
                                    return <td style={{
                                        whiteSpace: 'break-spaces',

                                    }}>
                                        {value}
                                    </td>
                                }
                            },
                            {
                                title: 'Shablon soni',
                                key: 'laboratory_template_count',
                            },


                        ]}
                        dataSource={
                            filter(serviceData, search)
                        }
                    />
                </div>

            </div>

        </Content>
    )
}

export default LaboratoryTemplate
