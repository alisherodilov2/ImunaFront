import React, { useEffect, useState } from 'react'
import Layout from '../../../layout/Layout'
import Navbar from '../../../layout/Navbar'
import Table from '../../../componets/table/Table'
import Input from '../../../componets/inputs/Input'
import Pagination from '../../../componets/pagination/Pagination'
import { read, utils, writeFileXLSX } from 'xlsx'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../../../interface/interface'
import Swal from 'sweetalert2'
import Content from '../../../layout/Content'
import { NumericFormat } from 'react-number-format'
import { query } from '../../../componets/api/Query'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Select from 'react-select';
import { AppDispatch } from '../../../service/store/store'
import { isClientAddExcelFile, isClientCurrentPage, isClientDelete, isClientGet, isClientPageLimit } from '../../../service/reducer/ClientReducer'
import { isDepartmentGet } from '../../../service/reducer/DepartmentReducer'
import { exportToExcel } from '../../../helper/exportToExcel'
import { isServiceTypeGet } from '../../../service/reducer/ServiceTypeReducer'
import { isServiceGet } from '../../../service/reducer/ServiceReducer'
import { fullName } from '../../../helper/fullName'
import { MdContentCopy } from 'react-icons/md'
import { IoMdRepeat } from 'react-icons/io'
import CashRegister from '../../cash_register/CashRegister'
import { formatId } from '../../../helper/idGenerate'
import { getCurrentDateTime } from '../../../helper/dateFormat'
import { cashRegDiscount } from '../../../helper/cashRegCalc'
import { isAddGraphAchiveAll, isEditGraphAchive, isGraphGet } from '../../../service/reducer/GraphReducer'
import { BiCalendarCheck } from 'react-icons/bi'
import { AiFillEdit } from 'react-icons/ai'
import { FaBoxOpen, FaCheckCircle, FaCircle, FaRegPlusSquare } from 'react-icons/fa'
import { generateCheck } from '../../../helper/generateCheck'
import { chegirmaHisobla } from '../../../helper/cashRegHelper'
import { calculateAge } from '../../../helper/calculateAge'
import { findMaxGraphItem } from '../../../helper/treatmentHelper'
import { isTreatmentGet } from '../../../service/reducer/TreatmentReducer'
import TableLoader from '../../../componets/table/TableLoader'
import { came_graph_archive_item_count, formatDateMonthName, generateDayArray, graphAChiveStatus } from '../../../helper/graphHelper'
import { Modal } from 'reactstrap'
const MuolajaTable = ({
    data,
    modal,
    setModal,
    title='Muolajalar'
}: {
    data: any,
    modal: boolean,
    setModal: any,
    title?:string

}) => {
    const toggle = () => {
        setModal(!modal)
    }
    const [load, setLoad] = useState(false)
    const getData = async (data?: any) => {
        try {
            let query = ''
            if (data) {
                query = data
            }
            setLoad(() => true)
            let res = await axios.get(`/graph/treatment?${query}`)
            const { result } = res.data
            console.log(result);
            dispatch(isAddGraphAchiveAll(result))
            // setData(() => result)
            // setCash(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const statusChange = async (id: any, status: any) => {
        try {
            setLoad(() => true)
            let res = await axios.post(`/graph/treatment/${id}`, {
                status: status
            })
            const { result } = res.data
            console.log(result);
            dispatch(isEditGraphAchive(result))
            // setCash(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const dataSelect = (data: any) => {
        return data?.map((item: any) => {
            return {
                value: item?.id, label: item?.name || item?.type,
                data: item
            }
        })
    }

    const { graph_achive, } = useSelector((state: ReducerType) => state.GraphReducer)
    const { treatmentData, } = useSelector((state: ReducerType) => state.TreatmentReducer)
    const { user, } = useSelector((state: ReducerType) => state.ProfileReducer)
    const [modaledit, setModaledit] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [modal3, setModal3] = useState(false)
    const [item, setItem] = useState({} as any)
    const [item2, setItem2] = useState({} as any)
    const { page, clientData, massage, isLoading, isSuccess, pageLimit } = useSelector((state: ReducerType) => state.ClientReducer)
    // const [pageLmit, setPageLimit] = useState(() => 5)
    const [numberOfPages, setNumberOfPages] = useState(Math.ceil(clientData?.data?.length / pageLimit))
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
                dispatch(isClientDelete({ all: [...new Set(checkData?.map((idAll: any) => idAll?.id))] }))
                setCheckData([])
            }
        })
        // dispatch(deletedispatchFunction(id))

    }

    const treatmentShow = async (graph_id: any, target: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/graph/treatment-show?graph_id=${graph_id}`)
            const { result } = res.data
            setItem({ ...result, ...target?.person, graph_achive: target, use_status: 'treatment', graph_archive_id: target?.id, treatment: target?.treatment })
            setModal3(true)
            // setItem({})
            // setItem(() => result)
            // setCash(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }

    const [serachText, setSerachText] = useState('')

    const orderShow = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get('/?client_id=' + id)
            const { result } = res.data
            setItem2(() => result)

            setModal2(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const [search, setSearch] = useState({
        is_today: false,
        client_status: '',
        all: true,
        start_age: '',
        end_age: '',
        full_name: '',
        age: '',
        phone: '',
        status: {
            label: 'Muolajadagilar',
            value: ''
        },
        treatment_id: {
            label: 'Muolaja turi',
            value: ''
        },
        index: {
            label: 'Kun tanlang',
            value: '-'
        }
    } as any)

    const [cash, setCash] = useState(false)
    return (
        <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='xl' backdrop="static" keyboard={false}>
            <div className="modal-header">
                <h5 className="modal-title">{title}</h5>
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
                    height: `${window.innerHeight / 1.4}px`,
                    overflow: 'auto'
                }}>
                    <table className="table table-bordered " >
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>F.I.SH</th>
                                <th>Telefon</th>
                                <th>Yoshi</th>

                                {
                                    data?.length > 0 ? findMaxGraphItem(data)?.graph_archive_item?.map((res: any, index: number) => {
                                        return (
                                            <th className='p-1'>{
                                                // +search?.index.value >= 0 ? +search?.index.value + 1 : 
                                                (index + 1)
                                            } - Kun</th>
                                        )
                                    }) : <th>
                                        1-kun
                                    </th>
                                }


                            </tr>
                        </thead>
                        <tbody>
                            {
                                load ? <tr>
                                    <td colSpan={5}>
                                        <div className='bg-white rounded p-1 text-center d-flex  align-items-center gap-3 justify-content-center'>
                                            <TableLoader />
                                            <h4 className='mb-0'>Yuklanmoqda</h4>
                                        </div>
                                    </td>
                                </tr>
                                    :
                                    data?.length > 0 ? data?.map((item: any, parentIndex: number) => {
                                        return (
                                            <tr>
                                                <td className='p-1'>{parentIndex+1}</td>
                                                <td className='p-1'>{fullName(item?.person)}</td>
                                                <td className='p-1'>{item?.person?.phone}</td>
                                                <td className='p-1'>{calculateAge(item?.person?.data_birth, user?.graph_format_date)}</td>
                                                {
                                                    findMaxGraphItem(data)?.graph_archive_item?.map((res: any, index: number) => {
                                                        {
                                                            let response = item?.graph_archive_item[index]
                                                            return response ? (
                                                                <td className={`p-0 m-0`}>
                                                                    <p
                                                                        className={`p-1 mb-0 fw-bold   ${Date.parse(user?.graph_format_date) == Date.parse(response?.agreement_date) ? 'border-animate' : 'border-notanimate'} text-white bg-${graphAChiveStatus(response, user?.graph_format_date,user.time)}`}

                                                                    >

                                                                        {formatDateMonthName(response?.agreement_date)}
                                                                    </p>
                                                                    {/* {response?.agreement_date} */}
                                                                </td>
                                                            ) : <td>-</td>
                                                        }
                                                    })
                                                }
                                            </tr>
                                        )
                                    }) :
                                        <tr>
                                            <td colSpan={5} >
                                                <div className='bg-white rounded p-1 text-center d-flex  align-items-center gap-3 justify-content-center'>
                                                    <FaBoxOpen size={44} />
                                                    <h4 className='mb-0'>Malumot topilmadi</h4>
                                                </div>
                                            </td>
                                        </tr>
                            }

                        </tbody>



                    </table>

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

export default MuolajaTable