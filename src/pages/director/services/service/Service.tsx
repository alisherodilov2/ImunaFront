import React, { useEffect, useState } from 'react'
import Layout from '../../../../layout/Layout'
import Navbar from '../../../../layout/Navbar'
import Table from '../../../../componets/table/Table'
import Input from '../../../../componets/inputs/Input'
import Pagination from '../../../../componets/pagination/Pagination'
import { read, utils, writeFileXLSX } from 'xlsx'
import ServiceAdd from './ServiceAdd'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../../../interface/interface'
import { isServiceDelete, isServiceGet, isServiceCurrentPage, isServicePageLimit, isServiceEdit, isServiceAddExcelFile } from '../../../../service/reducer/ServiceReducer'
import { AppDispatch } from '../../../../service/store/store'
import Swal from 'sweetalert2'
import Content from '../../../../layout/Content'
import { isFindFunction } from '../../../../service/reducer/MenuReducer'
import { NumericFormat } from 'react-number-format'
import { query } from '../../../../componets/api/Query'
import axios from 'axios'
import { isDepartmentGet } from '../../../../service/reducer/DepartmentReducer'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { isServiceTypeGet } from '../../../../service/reducer/ServiceTypeReducer'
import Select from 'react-select';
import { exportToExcel } from '../../../../service/helper/exportToExcel'
import { IoMdSettings } from 'react-icons/io'
import ServiceSetting from './ServiceSetting'
import { isProductGet } from '../../../../service/reducer/ProductReducer'
const Service = () => {
    const dataSelect = (data: any) => {
        let res = [...data].sort((a: any, b: any) => b.id - a.id);
        return res?.map((item: any) => {
            return {
                value: item?.id, label: item?.name || item?.type,
                data: item
            }
        })
    }
    const { departmentData, } = useSelector((state: ReducerType) => state.DepartmentReducer)
    const { serviceTypeData } = useSelector((state: ReducerType) => state.ServiceTypeReducer)
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [item, setItem] = useState({} as any)
    const [item2, setItem2] = useState({} as any)
    const { page, serviceData, massage, isLoading, isSuccess, pageLimit } = useSelector((state: ReducerType) => state.ServiceReducer)
    // const [pageLmit, setPageLimit] = useState(() => 5)
    const [numberOfPages, setNumberOfPages] = useState(Math.ceil(serviceData?.length / pageLimit))
    useEffect(() => {
    }, [numberOfPages])
    const [checkData, setCheckData] = useState([] as any)
    const checkFun = (item: any) => {
        let resultCheck = checkData?.find((checkItem: any) => checkItem?.id === item?.id);
        if (resultCheck) {
            return checkData.filter((checkItem: any) => checkItem?.id !== item?.id)
        }
        return [...checkData, item]
    }
    const dispatch = useDispatch<AppDispatch>()
    const deleteAll = () => {
        Swal.fire({
            title: "Ma'lumotni o'chirasizmi?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Ha',
            denyButtonText: `Yo'q`,
        }).then((result: any) => {
            if (result.isConfirmed) {
                dispatch(isServiceDelete({ all: [...new Set(checkData?.map((idAll: any) => idAll?.id))] }))
                setCheckData([])
                setCheckAll(() => false)
            }
        })
        // dispatch(deletedispatchFunction(id))

    }
    const [serachText, setSerachText] = useState('')
    const [load, setLoad] = useState(false)
    const orderShow = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get('/?service_id=' + id)
            const { result } = res.data
            setItem2(() => result)
            console.log(result);

            setModal2(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
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
    function handleFile(e: any) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function (event: any) {
            const data = new Uint8Array(event.target.result);
            const workbook = read(data, { type: 'array' });

            // Assuming only one sheet in the Excel file
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convert worksheet data to JSON
            const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
            console.log('jsonData', jsonData);
            let resultData = jsonData.slice(1).map((item: any, index: number) => {
                return {
                    department: item?.at(1),
                    servicetype: item?.at(2),
                    name: item?.at(3),
                    short_name: item?.at(4) ?? '-',
                    price: item?.at(5),
                    doctor_contribution_price: item?.at(6),
                    kounteragent_contribution_price: item?.at(7),
                    kounteragent_doctor_contribution_price: item?.at(8),
                }
            })
            // ["Bo'lim"]: item?.department?.name,
            // ["Xizmat turi"]: item?.servicetype?.type,
            // ["Xizmat "]: item?.name,
            // ["Narxi "]: item?.price,
            // ["Doktor ulushi "]: item?.doctor_contribution_price,
            // ["Kontragent ulushi "]: item?.kounteragent_contribution_price,
            // ["Kounterdoktor ulushi "]: item?.kounteragent_doctor_contribution_price,
            console.log(resultData);
            dispatch(isServiceAddExcelFile({ dataExcel: JSON.stringify(resultData) }))
            e.target.value = '';
            // Output JSON data
        };

        reader.readAsArrayBuffer(file);
    }
    const { id, servicetype_id, department_id } = useParams() as any
    useEffect(() => {
        if ((department_id && +department_id > 0) && (servicetype_id && +servicetype_id > 0)) {
            dispatch(isServiceGet(`?department_id=${department_id}&servicetype_id=${servicetype_id}`))
        } else {
            dispatch(isServiceGet(''))
        }
        dispatch(isServiceTypeGet(''))
        dispatch(isDepartmentGet(''))
        dispatch(isProductGet(''))

    }, [servicetype_id, department_id])
    const [checkAll, setCheckAll] = useState(false)
    const show = async (id: any, status?: any) => {
        try {
            setItem2(() => { })

            setLoad(() => true)
            let res = await axios.get(`/service/${id}`)
            const { result } = res.data
            setModal2(() => true)
            setItem2(() => result)
        }
        finally {
            setLoad(() => false)

        }
    }
    return (
        <Content loading={load}>
            <Navbar />
            <div className="container-fluid flex-grow-1 container-p-y size_16 ">
                <div className="d-block d-lg-flex my-2 gap-3 ">
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
                                        ...dataSelect(departmentData)
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
                                        ...dataSelect(serviceTypeData)
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
                    <div className='d-flex justify-content-center align-items-center gap-1'>
                        {
                            checkData?.length > 0 ?
                                <button className="btn btn-danger " type="button" onClick={() => {
                                    deleteAll()
                                }}>O'chirish</button> : ''
                        }

                        <button className="btn btn-info fileUpload_" type="button" onClick={() => {
                        }}>
                            <input type="file" id="fileUpload" name="fileUpload"
                                // ref={fileInputRef}
                                onChange={handleFile} accept=".xlsx, .xls, .csv" />
                            import</button>
                        <button className="btn btn-success " type="button" onClick={() => {
                            let resultData = [...serviceData.map((item: any, index: number) => {
                                return {
                                    ["№"]: index + 1,
                                    ["Bo'lim"]: item?.department?.name,
                                    ["Xizmat turi"]: item?.servicetype?.type,
                                    ["Xizmat "]: item?.name,
                                    ["Qisqartma nomi"]: item?.short_name ?? '-',
                                    ["Narxi "]: item?.price,
                                    ["Doktor ulushi "]: item?.doctor_contribution_price,
                                    ["Kontragent ulushi "]: item?.kounteragent_contribution_price,
                                    ["Kounterdoktor ulushi "]: item?.kounteragent_doctor_contribution_price,
                                }
                            })]
                            exportToExcel(resultData)
                        }}>Eksport</button>
                        <button className="btn btn-primary " type="button" onClick={() => {
                            setModal(true)
                            setItem(() => { })
                        }}>

                            Qoshish</button>
                    </div>
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

                        page={page}
                        deletedispatchFunction={isServiceDelete}
                        setNumberOfPages={setNumberOfPages}
                        paginationRole={true}
                        localEditFunction={(e: any) => {
                            setItem(() => e)
                            console.log();

                            setModal(true)
                        }}
                        errorMassage={massage}
                        isLoading={isLoading}
                        isSuccess={isSuccess}
                        reloadData={true}
                        reloadDataFunction={() => {
                            if ((department_id && +department_id > 0) && (servicetype_id && +servicetype_id > 0)) {
                                dispatch(isServiceGet(`?department_id=${department_id}&servicetype_id=${servicetype_id}`))
                            } else {
                                dispatch(isServiceGet(''))
                            }
                        }}
                        top={100}
                        scrollRole={true}
                        editRole={true}
                        allCheckId='id'
                        allCheckRoleFun={
                            (e: any) => {
                                return <>
                                    {" "}
                                    <input className="form-check-input" type="checkbox" onChange={(e: any) => {
                                        const target = !checkAll
                                        setCheckAll(() => target)
                                        if (target) {
                                            setCheckData(() => serviceData)
                                        } else {
                                            setCheckData(() => [])
                                        }
                                    }} checked={checkAll} />
                                    {" "}

                                </>
                            }
                        }

                        extraButtonRole={true}
                        extraButton={((item: any) => {
                            return <button className='btn btn-warning btn-sm'
                                onClick={() => {
                                    setItem2(() => { })
                                    show(item?.id)
                                    // setModal2((prev: any) => true)
                                    // setItem(() => item)
                                }}>
                                <IoMdSettings />
                            </button>
                        })}
                        deleteRole={true}
                        limit={pageLimit}
                        columns={[
                            {
                                title: '№',
                                key: 'id',
                                render: (value: any, data: any) => {
                                    return <div key={data.index} className='d-flex  align-items-center gap-1'>
                                        <input className="form-check-input" type="checkbox" id="defaultCheck3" value={value} onChange={() => {
                                            setCheckData(checkFun(data))
                                        }} checked={checkData?.find((item: any) => item?.id == value)} />
                                        <span>
                                            {((data?.index + 1) + (page * pageLimit) - pageLimit)}
                                        </span>
                                    </div>
                                }
                            },
                            {
                                title: "Bo'limi",
                                key: 'department',
                                render: (value: any, data: any) => {
                                    return < >
                                        {value?.name}
                                    </>
                                }
                            },
                            {
                                title: 'Xizmat turi',
                                key: 'servicetype',
                                render: (value: any, data: any) => {
                                    return < >
                                        {value?.type}
                                    </>
                                }
                            },
                            {
                                title: 'Xizmat nomi',
                                key: 'name',
                            },
                            {
                                title: 'Qisqartma nomi',
                                key: 'short_name',
                            },
                            {
                                title: 'Narxi',
                                key: 'price',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value} />
                                }
                            },
                            {
                                title: 'Doktor ulushi',
                                key: 'doctor_contribution_price',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value} />
                                }
                            },
                            {
                                title: 'Kounteragent ulushi',
                                key: 'kounteragent_contribution_price',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value} />
                                }
                            },
                            {
                                title: 'Kounterdoktor ulushi',
                                key: 'kounteragent_doctor_contribution_price',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value} />
                                }
                            },

                        ]}
                        dataSource={
                            filter(serviceData, search)
                        }
                    />
                </div>
                <br />
                <Pagination
                    setPageLimit={(e: any) => {
                        // setNumberOfPages(Math.ceil(serviceData?.length / e))
                        // setPageLimit(e)
                        dispatch(isServiceCurrentPage(1))
                        dispatch(isServicePageLimit(e))
                    }}

                    pageLmit={pageLimit}
                    current={page} total={Math.ceil(serviceData?.length / pageLimit)} count={isServiceCurrentPage} />
            </div>

            <ServiceAdd
                modal={modal} setModal={setModal}
                setData={setItem} data={item} />
            {
                modal2 ? <ServiceSetting
                    modal={modal2} setModal={setModal2}
                    setData={setItem2} data={item2} /> : ''
            }


        </Content>
    )
}

export default Service