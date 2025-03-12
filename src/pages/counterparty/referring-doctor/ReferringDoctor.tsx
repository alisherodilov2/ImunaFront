import React, { useEffect, useState } from 'react'
import Layout from '../../../layout/Layout'
import Navbar from '../../../layout/Navbar'
import Table from '../../../componets/table/Table'
import Input from '../../../componets/inputs/Input'
import Pagination from '../../../componets/pagination/Pagination'
import ReferringDoctorAdd from './ReferringDoctorAdd'
import { read, utils, writeFileXLSX } from 'xlsx'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../../interface/interface'
import { isReferringDoctorDelete, isReferringDoctorGet, isReferringDoctorCurrentPage, isReferringDoctorPageLimit, isReferringDoctorEdit, isReferringDoctorAddExcelFile } from '../../../service/reducer/ReferringDoctorReducer'
import { AppDispatch } from '../../../service/store/store'
import Swal from 'sweetalert2'
import { IoMdSettings } from 'react-icons/io'
import Content from '../../../layout/Content'
import { isFindFunction } from '../../../service/reducer/MenuReducer'
import { NumericFormat } from 'react-number-format'
import { query } from '../../../componets/api/Query'
import axios from 'axios'
import { domain } from '../../../main'
import { fullName } from '../../../helper/fullName'
import ReferringDoctorService from './ReferringDoctorService'
import { exportToExcel } from '../../../helper/exportToExcel'
// import { ReferringDoctorOrderShow } from './ReferringDoctorOrderShow'

const ReferringDoctor = () => {
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [item, setItem] = useState({} as any)
    const [item2, setItem2] = useState({} as any)
    const { page, referringDoctorData, massage, isLoading, isSuccess, pageLimit } = useSelector((state: ReducerType) => state.ReferringDoctorReducer)
    // const [pageLmit, setPageLimit] = useState(() => 5)
    const [numberOfPages, setNumberOfPages] = useState(Math.ceil(referringDoctorData.data?.length / pageLimit))
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
                dispatch(isReferringDoctorDelete({ all: [...new Set(checkData?.map((idAll: any) => idAll?.id))] }))
                setCheckData([])
            }
        })
        // dispatch(deletedispatchFunction(id))

    }
    const [serachText, setSerachText] = useState('')
    const [load, setLoad] = useState(false)
    const [service, setService] = useState({} as any)
    const serviceShow = async (id: any, user: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get('/referring-doctor/service/' + id)
            const { result } = res.data
            setService(() => {
                return {
                    ...result,
                    user: user
                }
            })
            setModal3(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }

    const [modal3, setModal3] = useState(false)
    const filter = (data: any, serachData: string) => {
        if (serachData?.length > 0) {
            return (data.filter((item: any) => (item?.full_name?.toString().toLowerCase().includes(serachData) || item?.phone?.toString().toLowerCase().includes(serachData)) || item?.target_adress?.toString().toLowerCase().includes(serachData) || item?.address?.toString().toLowerCase().includes(serachData)))
        } else
            return (data)
    }
    useEffect(() => {
        dispatch(isReferringDoctorGet('?is_table=1'))
    }, [])
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
                    first_name: item?.at(1),
                    phone: item?.at(2),
                    workplace: item?.at(3),
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
            dispatch(isReferringDoctorAddExcelFile({ dataExcel: JSON.stringify(resultData) }))
            e.target.value = '';
            // Output JSON data
        };

        reader.readAsArrayBuffer(file);
    }
    return (
        <Content loading={load}>
            <Navbar />
            <div className="container-fluid flex-grow-1 container-p-y size_16 ">
                <div className="d-flex my-2 gap-3">
                    <form className='w-100'>
                        <Input placeholder='Izlash...' onChange={(e: any) => {
                            setSerachText(e.target.value)
                        }}
                            value={serachText}
                        />
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
                            let resultData = [...referringDoctorData.data.map((item: any, index: number) => {
                                return {
                                    ["№"]: index + 1,
                                    ["F.I.O"]: fullName(item),
                                    ["Tel"]: `+998${item?.phone}`,
                                    ["Ish joyi "]: item?.workplace,
                                }
                            })]
                            exportToExcel(resultData)
                        }}>Eksport</button>
                        <button className="btn btn-primary " type="button" onClick={() => {
                            setModal(true)
                            setItem(() => { })
                        }}>Qoshish</button>
                    </div>
                </div>
                <div className="card" style={{
                    height: `${window.innerHeight / 1.7}px`,
                    overflow: 'auto'
                }}>
                    <Table
                        page={page}
                        //  exportFile={true}
                        //  importFile={true}
                        deletedispatchFunction={isReferringDoctorDelete}
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
                            dispatch(isReferringDoctorGet('?is_table=1'))
                        }}
                        extraButton={((item: any) => {
                            return <button className='btn btn-warning btn-sm'
                                onClick={() => {
                                    serviceShow(item?.id, item)
                                }}>
                                <IoMdSettings />
                            </button>
                        })}
                        top={100}
                        scrollRole={true}
                        editRole={true}
                        deleteRole={true}
                        limit={pageLimit}
                        extraKeys={['full_name', 'phone_', 'workplace_']}
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
                            {
                                title: "F.I.O",
                                key: 'full_name',
                                renderItem: (value: any, data: any) => {
                                    return <td onClick={() => {

                                    }}>

                                        <b>{fullName(value)}</b>

                                    </td>
                                }
                            },
                            {
                                title: 'Tel',
                                key: 'phone_',
                                render: (value: any, data: any) => {
                                    return `+998${value.phone}`
                                }
                            },
                            {
                                title: 'Ish joyi',
                                key: 'workplace_',
                                render: (value: any, data: any) => {
                                    return value?.workplace
                                }
                            },


                        ]}
                        dataSource={
                            filter(referringDoctorData.data, serachText)
                        }
                    />
                </div>
                <br />
                <Pagination
                    setPageLimit={(e: any) => {
                        // setNumberOfPages(Math.ceil(referringDoctorData?.length / e))
                        // setPageLimit(e)
                        dispatch(isReferringDoctorCurrentPage(1))
                        dispatch(isReferringDoctorPageLimit(e))
                    }}

                    pageLmit={pageLimit}
                    current={page} total={Math.ceil(referringDoctorData.data?.length / pageLimit)} count={isReferringDoctorCurrentPage} />
            </div>
            {/* <ReferringDoctorOrderShow
                modal={modal2}
                setModal={setModal2}
                data={item2}
                setData={setItem2}
            /> */}
            <ReferringDoctorAdd
                modal={modal} setModal={setModal}
                setData={setItem} data={item} />
            {
                modal3 ?
                    <ReferringDoctorService
                        modal={modal3} setModal={setModal3}
                        setData={setService} data={service} /> : ''
            }


        </Content>
    )
}

export default ReferringDoctor