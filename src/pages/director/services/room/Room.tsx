import React, { useEffect, useState } from 'react'
import Layout from '../../../../layout/Layout'
import Navbar from '../../../../layout/Navbar'
import { exportToExcel } from '../../../../service/helper/exportToExcel'
import { read, utils, writeFileXLSX } from 'xlsx'
import Table from '../../../../componets/table/Table'
import Input from '../../../../componets/inputs/Input'
import Pagination from '../../../../componets/pagination/Pagination'
import RoomAdd from './RoomAdd'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../../../interface/interface'
import { isRoomDelete, isRoomGet, isRoomCurrentPage, isRoomPageLimit, isRoomEdit, isRoomAddExcelFile } from '../../../../service/reducer/RoomReducer'
import { AppDispatch } from '../../../../service/store/store'
import Swal from 'sweetalert2'
import Content from '../../../../layout/Content'
import { isFindFunction } from '../../../../service/reducer/MenuReducer'
import { NumericFormat } from 'react-number-format'
import { query } from '../../../../componets/api/Query'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { IoMdSettings } from 'react-icons/io'
// import RoomServiceItem from './RoomServiceItem'
import { isServiceGet } from '../../../../service/reducer/ServiceReducer'

const Room = () => {
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [item, setItem] = useState({} as any)
    const [item2, setItem2] = useState({} as any)
    const path = useNavigate()
    const { page, roomData, massage, isLoading, isSuccess, pageLimit } = useSelector((state: ReducerType) => state.RoomReducer)
    // const [pageLmit, setPageLimit] = useState(() => 5)
    const [numberOfPages, setNumberOfPages] = useState(Math.ceil(roomData?.length / pageLimit))
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
                dispatch(isRoomDelete({ all: [...new Set(checkData?.map((idAll: any) => idAll?.id))] }))
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
            let res = await axios.get('/order-show?room_id=' + id)
            const { result } = res.data
            setItem2(() => result)
            console.log(result);

            // setModal2(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const filter = (data: any, serachData: string) => {
        if (serachData?.length > 0) {
            return (data.filter((item: any) => (item?.name?.toString().toLowerCase().includes(serachData) || item?.phone?.toString().toLowerCase().includes(serachData)) || item?.target_adress?.toString().toLowerCase().includes(serachData) || item?.address?.toString().toLowerCase().includes(serachData)))
        } else
            return (data)
    }
    const [checkAll, setCheckAll] = useState(false)
    useEffect(() => {
        dispatch(isRoomGet(''))
        dispatch(isServiceGet(''))
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
                    type: item?.at(1),
                    number: item?.at(2),
                    room_index: item?.at(3),
                    price: item?.at(4),
                    doctor_contribution: item?.at(5),
                    nurse_contribution: item?.at(6),
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
            dispatch(isRoomAddExcelFile({ dataExcel: JSON.stringify(resultData) }))
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
                            let resultData = [...roomData.map((item: any, index: number) => {
                                return {
                                    ["№"]: index + 1,
                                    ["Xona turi"]: item?.type,
                                    ["Xona raqami"]: item?.number,
                                    ["O'rin raqami "]: item?.room_index,
                                    ["Narxi "]: item?.price,
                                    ["Shifokor ulushi "]: item?. doctor_contribution,
                                    ["Hamshira ulushi "]: item?.nurse_contribution,
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
                       
                        deletedispatchFunction={isRoomDelete}
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
                            dispatch(isRoomGet(''))
                        }}
                        top={100}
                        scrollRole={true}
                        editRole={true}
                        showFunction={(e: any) => {
                            path('/service-type/' + e?.id)
                        }}
                        allCheckId='id'
                        allCheckRoleFun={
                            (e: any) => {
                                return <>
                                    {" "}
                                    <input className="form-check-input" type="checkbox" onChange={(e: any) => {
                                        const target = !checkAll
                                        setCheckAll(() => target)
                                        if (target) {
                                            setCheckData(() => roomData)
                                        } else {
                                            setCheckData(() => [])
                                        }
                                    }} checked={checkAll} />
                                    {" "}

                                </>
                            }
                        }
                        deleteRole={true}
                        limit={pageLimit}
                        extraKeys={['status']}
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
                                title: 'Xona turi',
                                key: 'type',
                                render: (value: any, data: any) => {
                                    return <>
                                        {value}
                                    </>
                                }
                            },
                            {
                                title: 'Xona raqami',
                                key: 'number',
                                render: (value: any, data: any) => {
                                    return <>
                                        {value}
                                    </>
                                }
                            },
                            {
                                title: "O'rin raqami",
                                key: 'room_index',
                                render: (value: any, data: any) => {
                                    return <>
                                        {value}
                                    </>
                                }
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
                                title: 'Shifokor ulushi	',
                                key: 'doctor_contribution',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value} />
                                }
                            },
                            {
                                title: 'Hamshira ulushi	',
                                key: 'nurse_contribution',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value} />
                                }
                            },
                            {
                                title: 'Holati	',
                                key: 'status',
                                render: (value: any, data: any) => {
                                    return '-'
                                }
                            },

                        ]}
                        dataSource={
                            filter(roomData, serachText)
                        }
                    />
                </div>
                <br />
                <Pagination
                    setPageLimit={(e: any) => {
                        // setNumberOfPages(Math.ceil(roomData?.length / e))
                        // setPageLimit(e)
                        dispatch(isRoomCurrentPage(1))
                        dispatch(isRoomPageLimit(e))
                    }}

                    pageLmit={pageLimit}
                    current={page} total={Math.ceil(roomData?.length / pageLimit)} count={isRoomCurrentPage} />
            </div>

            <RoomAdd
                modal={modal} setModal={setModal}
                setData={setItem} data={item} />
            {/* <RoomServiceItem
                modal={modal2} setModal={setModal2}
                setData={setItem2} data={item2} /> */}

        </Content>
    )
}

export default Room