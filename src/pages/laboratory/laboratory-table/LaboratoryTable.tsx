import React, { useEffect, useRef, useState } from 'react'
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
import { isAddAllDebtClient, isClientAddExcelFile, isClientCurrentPage, isClientDelete, isClientGet, isClientPageLimit, isTornametClient } from '../../../service/reducer/ClientReducer'
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
import { isGraphGet } from '../../../service/reducer/GraphReducer'
import { BiCalendarCheck } from 'react-icons/bi'
import { AiFillEdit } from 'react-icons/ai'
import { FaPrint, FaRegPlusSquare } from 'react-icons/fa'
import { generateCheck } from '../../../helper/generateCheck'
import { chegirmaHisobla } from '../../../helper/cashRegHelper'
import { isTreatmentGet } from '../../../service/reducer/TreatmentReducer'
import { isReferringDoctorGet } from '../../../service/reducer/ReferringDoctorReducer'
import { calculateAge } from '../../../helper/calculateAge'
// import { laboratoryClientHtml } from './laboratoryClientHtml'
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    timer: 2000,
    showConfirmButton: false,
    timerProgressBar: true
})
const LaboratoryTable = () => {
    const dataSelect = (data: any) => {
        let res = [...data].sort((a: any, b: any) => b.id - a.id);
        return res?.map((item: any) => {
            return {
                value: item?.id, label: item?.name || item?.type,
                data: item
            }
        })
    }
    const { user, target_branch } = useSelector((state: ReducerType) => state.ProfileReducer)
    const [data, setData] = useState({
        data: [],
        start_date: '',
        end_date: ''
    } as any)
    const iframeRef = useRef<any>(null);
    const waitForQrCodeToLoad = (iframeDoc: Document) => {
        return new Promise<void>((resolve) => {
            const qrCodeImgs = iframeDoc.querySelectorAll('img'); // Select all images
            let loadedImagesCount = 0;
            const totalImages = qrCodeImgs.length;

            if (totalImages === 0) {
                resolve(); // Resolve immediately if no images are found
                return;
            }

            qrCodeImgs.forEach((qrCodeImg) => {
                // Listen for the load event for each image
                qrCodeImg.addEventListener('load', () => {
                    loadedImagesCount += 1;

                    // Resolve when all images have loaded
                    if (loadedImagesCount === totalImages) {
                        resolve();
                    }
                });

                // In case the image is already cached and the load event doesn't fire
                if (qrCodeImg.complete) {
                    loadedImagesCount += 1;
                    if (loadedImagesCount === totalImages) {
                        resolve();
                    }
                }
            });
        });
    };

    const updateIframeContent = async (content: string) => {
        const iframeDoc = iframeRef.current?.contentDocument;
        if (iframeDoc) {
            iframeDoc.open();
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
       
        table,
        th,
        td {
            border: 1px solid black;
            border-collapse: collapse;
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
                // body {
                //   margin: 0;
                //   padding: 0;
                // }
                /* Brauzerning avtomatik header/footer-ni olib tashlash */
                .header, .footer {
                  display: none;
                }
                @page {
                  margin: 1rem 2rem;
                }
              }
    </style>
</head>

<body>
<div>  
 
            


${content}</div>
</body>

</html>
            `);
            iframeDoc.close();
            await waitForQrCodeToLoad(iframeDoc);
        }
    };

    const handlePrint = async () => {
        const iframeDoc = iframeRef.current?.contentDocument;
        const iframeWindow = iframeRef.current?.contentWindow;
        if (iframeDoc && iframeWindow) {
            const iframeWindow = iframeRef.current.contentWindow;
            await waitForQrCodeToLoad(iframeDoc);
            iframeWindow.print(); // Iframe ichidagi matnni chop qilish
        }
    };
    // const dispatch = useDispatch<AppDispatch>()
    const clientAllData = async (data?: any) => {
        try {
            setData({
                start_date: '',
                end_date: '',
                data: [],
            })
            setLoad(() => true)
            let res = await axios.get(`/client/laboratory/table?${data ?? ''}`)
            const { result } = res.data
            // setData(() => result)
            setData(() => result)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const treatmentShow = async (person_id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get(`/graph/treatment-show?person_id=${person_id}`)
            const { result } = res.data

            setItem2({ ...(result?.graph ?? {}), ...result?.graph_archive?.person, use_status: 'treatment', graph_archive_id: result?.graph_archive?.id, treatment: result?.graph_archive?.treatment })
            setModal3(true)
            // setItem2({ ...result })
            // setItem({})
            // setItem(() => result)
            // setCash(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const [printDataChek, setPrintDataChek] = useState({} as any)
    const printData = async (id: any) => {
        try {
            setSendLoading(() => true)
            let res = await axios.get('/client/laboratory/' + id)
            const { result } = res.data
            // setPrintDataChek(() => result)
            if (result) {
                // setTimeout(() => {
                // updateIframeContent(laboratoryClientHtml(result))
                handlePrint()
                // }, 100);

            }


        } catch (error) {
        }
        finally {
            setSendLoading(() => false)
        }
    }
    const { graph_achive_target } = useSelector((state: ReducerType) => state.GraphReducer)
    const { departmentData, } = useSelector((state: ReducerType) => state.DepartmentReducer)
    const [modal, setModal] = useState(false)
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

    const allShow = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get('/client?show_person_id=' + id)
            const { result } = res.data
            setItem({})
            setModaledit(true)
            setItem(() => {
                return {

                    ...result
                }
            })
            setItem(() => result)
            // setCash(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }

    const [serachText, setSerachText] = useState('')
    const [load, setLoad] = useState(false)
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
        branch: target_branch == 'all' ? { label: 'Barcha filallar', value: 'all' } : (target_branch > 0 ? user?.branch?.find((item: any) => item?.value == target_branch) : user?.branch?.at(0)),
        full_name: '',
        phone: '',
        person_id: '',
        probirka: '',
        data_birth: '',
    } as any)

    const filter = (data: any, serachData: any) => {
        // if (serachData?.full_name?.length > 0 && serachData?.phone?.length == 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) => fullName(item)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase()))
        // }
        // if (serachData?.full_name?.length > 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) =>
        //         fullName(item)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase())
        //         && item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
        //     )

        // }
        // if (serachData?.full_name?.length > 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length > 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) =>
        //         fullName(item)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase())
        //         && item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
        //         && item?.person_id?.toString().toLowerCase().includes(serachData?.person_id?.toString().toLowerCase())
        //     )

        // }
        // if (serachData?.full_name?.length > 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length > 0 && serachData?.probirka?.length > 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) =>
        //         fullName(item)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase())
        //         && item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
        //         && item?.person_id?.toString().toLowerCase().includes(serachData?.person_id?.toString().toLowerCase())
        //         && item?.probirka_count?.toString().toLowerCase().includes(serachData?.probirka?.toString().toLowerCase())
        //     )

        // }
        // if (serachData?.full_name?.length > 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length > 0 && serachData?.probirka?.length > 0 && serachData?.data_birth?.length > 0) {
        //     return data.filter((item: any) =>
        //         fullName(item)?.toString().toLowerCase().includes(serachData?.full_name?.toString().toLowerCase())
        //         && item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
        //         && item?.person_id?.toString().toLowerCase().includes(serachData?.person_id?.toString().toLowerCase())
        //         && item?.probirka_count?.toString().toLowerCase().includes(serachData?.probirka?.toString().toLowerCase())
        //         && Date.parse(item?.data_birth) === Date.parse(serachData?.data_birth)
        //     )
        // }

        // if (serachData?.full_name?.length == 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) =>
        //         item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
        //     )
        // }
        // if (serachData?.full_name?.length == 0 && serachData?.phone?.length == 0 && serachData?.person_id?.length > 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) =>
        //         item?.person_id?.toString().toLowerCase().includes(serachData?.person_id?.toString().toLowerCase())
        //     )
        // }
        // if (serachData?.full_name?.length == 0 && serachData?.phone?.length == 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length > 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) =>
        //         item?.probirka_count?.toString().toLowerCase().includes(serachData?.probirka?.toString().toLowerCase())
        //     )
        // }
        // if (serachData?.full_name?.length == 0 && serachData?.phone?.length == 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length > 0) {
        //     return data.filter((item: any) =>
        //         Date.parse(item?.data_birth) === Date.parse(serachData?.data_birth)
        //     )
        // }

        // if (serachData?.full_name?.length == 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length > 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) =>
        //         item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
        //         && item?.person_id?.toString().toLowerCase().includes(serachData?.person_id?.toString().toLowerCase())
        //     )
        // }
        // if (serachData?.full_name?.length == 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length > 0 && serachData?.data_birth?.length == 0) {
        //     return data.filter((item: any) =>
        //         item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
        //         && item?.probirka_count?.toString().toLowerCase().includes(serachData?.probirka?.toString().toLowerCase())
        //     )
        // }
        // if (serachData?.full_name?.length == 0 && serachData?.phone?.length > 0 && serachData?.person_id?.length == 0 && serachData?.probirka?.length == 0 && serachData?.data_birth?.length > 0) {
        //     return data.filter((item: any) =>
        //         item?.phone?.toString().toLowerCase().includes(serachData?.phone?.toString().toLowerCase())
        //         && Date.parse(item?.data_birth) === Date.parse(serachData?.data_birth)
        //     )
        // }
        return data;
        // return Array.isArray(data) ? [...data].sort((a: any, b: any) => {
        //     const dateA = a ? Date.parse(a.client_item?.at(-1)) : 0;
        //     const dateB = b ? Date.parse(b.client_item?.at(-1)) : 0;
        //     return dateA - dateB;
        // }) : [];


        // if (serachData?.clienttype?.value === 'all' && serachData?.department?.value === 'all' && serachData.text === '') {
        //     return data
        // }
        // if (serachData?.clienttype?.value !== 'all' && serachData?.department?.value === 'all' && serachData.text === '') {
        //     return data.filter((item: any) => item.clienttype.id === serachData?.clienttype?.value)
        // }
        // if (serachData?.clienttype?.value === 'all' && serachData?.department?.value !== 'all' && serachData.text === '') {
        //     return data.filter((item: any) => item.department.id === serachData?.department?.value)
        // }
        // if (serachData?.clienttype?.value !== 'all' && serachData?.department?.value !== 'all' && serachData.text === '') {
        //     return data.filter((item: any) => item.clienttype.id === serachData?.clienttype?.value && item.department.id === serachData?.department?.value)
        // }
        // if (serachData?.clienttype?.value === 'all' && serachData?.department?.value === 'all' && serachData.text !== '') {
        //     return data.filter((item: any) => (item?.name?.toString().toLowerCase().includes(serachData.text)))
        // }
        // if (serachData?.clienttype?.value === 'all' && serachData?.department?.value !== 'all' && serachData.text !== '') {
        //     return data.filter((item: any) => item.department.id === serachData?.department?.value && (item?.name?.toString().toLowerCase().includes(serachData.text)))
        // }
        // if (serachData?.clienttype?.value !== 'all' && serachData?.department?.value === 'all' && serachData.text !== '') {
        //     return data.filter((item: any) => item.clienttype.id === serachData?.clienttype?.value && (item?.name?.toString().toLowerCase().includes(serachData.text)))
        // }

        // if (serachData?.clienttype?.value !== 'all' && serachData?.department?.value !== 'all' && serachData.text !== '') {
        //     return data.filter((item: any) => item.department.id === serachData?.department?.value && item.clienttype.id === serachData?.clienttype?.value && (item?.name?.toString().toLowerCase().includes(serachData.text)))
        // }


    }
    const [show, setShow] = useState(false)

    const { id, clienttype_id, department_id } = useParams() as any
    useEffect(() => {
        // if ((department_id && +department_id > 0) && (clienttype_id && +clienttype_id > 0)) {
        //     dispatch(isClientGet(`?department_id=${department_id}&clienttype_id=${clienttype_id}`))
        // } else {
        //     dispatch(isClientGet(''))
        // }
        // console.log('graph_achive_target', graph_achive_target);


        // dispatch(isServiceGet(''))
        // dispatch(isGraphGet(''))
        // dispatch(isDepartmentGet(''))
        // dispatch(isTreatmentGet(''))
        // dispatch(isReferringDoctorGet(''))
        clientAllData(`branch_id=${target_branch > 0 || target_branch == 'all' ? target_branch : user?.branch?.at(0)?.value}`)


    }, [])
    useEffect(() => {

    }, [])
    const [sendLoading, setSendLoading] = useState(false)
    useEffect(() => {
        if (printDataChek?.client) {
            // updateIframeContent(laboratoryClientHtml(printDataChek))
            handlePrint()
            setPrintDataChek({})
        }
    }, [sendLoading])
    const bloodtestAccept = async (id: any) => {
        try {
            setSendLoading(() => true)
            let res = await axios.get('/client/bloodtest/accept/' + id)
            const { result } = res.data
            setData(() => {
                return {
                    ...data,
                    data: data?.data.map((item: any) => item.person_id === result.person_id ? {
                        ...item,
                        client_item: item?.client_item?.map((item2: any) => item2?.id === result?.id ? { ...result, } : item2)

                    } : item),
                }

            })

        } catch (error) {

        }
        finally {
            setSendLoading(() => false)
        }
    }
    const [cash, setCash] = useState(false)
    const [sendResult, setSendResult] = useState([] as any)
    const [loading, setLoading] = useState(false)
    const saveResult = async (target: any) => {
        try {
            setLoading(true)
            console.log(data);
            let formdata = new FormData();
            formdata.append('table_data', JSON.stringify(target))
            formdata.append('service_type_id', data?.service_type_find?.value)
            let res = await axios.post('/client/laboratory-table/save', formdata)
            Toast.fire("malumotlar saqlandi", '', 'success')
            const { result } = res.data
            if (result?.length > 0) {
                // for (let key of result) {
                //     console.log('key', key);
                    setData(() => {
                        return {
                            ...data,
                            data: data?.data?.map((item: any) => {
                               let find = result?.find((item2: any) => item2?.id === item?.id)
                               if(find){
                                   return find
                               }
                               return item

                            })
                        }
                    })
                // }
            }
            setSendResult(()=>[])
        } catch (error) {

        }
        finally {
            setLoading(false)
        }
    }
    return (
        <Content loading={sendLoading || loading}  >
            <br />
            <Navbar />
            <div className="container-fluid flex-grow-1 py-1 size_16 ">
                <div className="d-block  my-1 gap-0 gap-lg-3">
                    <form className='row w-auto w-lg-100'>
                        <div className={`col-lg-${user?.is_main_branch ? 4 : 3} d-flex align-items-center gap-1`}>
                            <Input type='date'
                                disabled={load}

                                onChange={(e: any) => {
                                    let value = e.target.value
                                    if (value && value.length > 0) {
                                        clientAllData(`end_date=${data?.end_date}&start_date=${value}`)
                                    }
                                }}
                                value={data?.start_date}
                            />
                            <Input type='date'
                                disabled={load}
                                onChange={(e: any) => {
                                    let value = e.target.value
                                    if (value && value.length > 0) {
                                        clientAllData(`end_date=${data?.end_date}&start_date=${value}`)
                                    }
                                }}
                                value={data?.start_date}
                            />
                        </div>
                        {/* 
                        <div className="col-2   d-none d-lg-block">
                            <Input
                                disabled={load}

                                placeholder='F.I.O Izlash...' onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            full_name: e.target.value?.trim().toLowerCase()
                                        }
                                    })

                                }}
                                onKeyDown={
                                    (e: any) => {
                                        if (e.key === 'Enter') {
                                            // dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&full_name=${e.target.value?.trim().toLowerCase()}`))
                                            clientAllData(`end_date=${data?.end_date}&start_date=${data?.start_date}&full_name=${e.target.value?.trim().toLowerCase()}`)
                                        }
                                    }
                                }
                                value={search?.full_name}
                            />
                        </div>
                        <div className="col-2  d-none d-lg-block">
                            <Input
                                disabled={load}

                                placeholder='Telefon Izlash...' onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            phone: e.target.value?.trim().toLowerCase()
                                        }
                                    })

                                }}
                                onKeyDown={
                                    (e: any) => {
                                        if (e.key === 'Enter') {
                                            // dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&phone=${e.target.value?.trim().toLowerCase()}`))
                                            clientAllData(`end_date=${data?.end_date}&start_date=${data?.start_date}&phone=${e.target.value?.trim().toLowerCase()}`)
                                        }
                                    }
                                }
                                value={search?.phone}
                            />
                        </div>
                        <div className="col-1  d-none d-lg-block">
                            <Input
                                disabled={load}

                                placeholder='ID Izlash...' onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            person_id: e.target.value?.trim().toLowerCase()
                                        }
                                    })
                                }}
                                onKeyDown={
                                    (e: any) => {
                                        if (e.key === 'Enter') {
                                            // dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&person_id=${e.target.value?.trim().toLowerCase()}`))
                                            clientAllData(`end_date=${data?.end_date}&start_date=${data?.start_date}&person_id=${e.target.value?.trim().toLowerCase()}`)
                                        }
                                    }
                                }
                                value={search?.person_id}
                            />
                        </div>
                        <div className="col-2  d-none d-lg-block">
                            <Input
                                disabled={load}
                                type='date' onChange={(e: any) => {
                                    setSearch((res: any) => {
                                        return {
                                            ...res,
                                            data_birth: e.target.value
                                        }
                                    })
                                }}
                                onKeyDown={
                                    (e: any) => {
                                        if (e.key === 'Enter' && e.target.value?.trim().length > 0) {
                                            // dispatch(isClientGet(`?start_date=${clientData?.start_date}&end_date=${clientData?.end_date}&data_birth=${e.target.value?.trim().toLowerCase()}`))
                                            clientAllData(`end_date=${data?.end_date}&start_date=${data?.start_date}&data_birth=${e.target.value?.trim().toLowerCase()}`)
                                        }
                                    }
                                }
                                value={search?.data_birth}
                            />
                        </div> */}
                        <div className={`col-2 `}>
                            <Select
                                isDisabled={isLoading ? true : false}
                                name='name'
                                value={data?.service_type_find}
                                onChange={(e: any) => {

                                    (clientAllData(`start_date=${data?.start_date}&end_date=${data?.end_date}&service_type_id=${e.value}`))
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={
                                    data?.service_type?.map((item: any, index: any) => ({
                                        value: item?.id,
                                        label: item?.type
                                    }))
                                } />
                        </div>
                    </form>

                </div>
                {/* <button onClick={() => clientAllData('')}>llll</button> */}
                <div className="card" style={{
                    height: `${window.innerHeight / 1.5}px`,
                    overflow: 'auto'
                }}>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th className=''>#</th>
                                <th className=''>Probirka</th>
                                <th className=''>F.I.O</th>
                                <th className=''>Yoshi</th>
                                {
                                    data?.service?.map((item: any, index: any) => (
                                        <th className='bg-primary text-white'>{item?.short_name ?? '-'}</th>
                                    ))
                                }

                            </tr>

                        </thead>
                        <tbody>
                            {
                                loading ? '' : data?.data?.map((item: any, index: any) => {
                                    let is_full_value = item?.client_value?.filter((itemValue: any) => itemValue?.result?.length > 0)?.length
                                    return (
                                        <tr>
                                            <td
                                                className={`${is_full_value == item?.client_value?.length ? 'bg-success text-white' : 'bg-danger text-white'}`}
                                            >{index + 1}</td>
                                            <td className='w-auto'><b>
                                                {item?.probirka_id}</b></td>
                                            <td><b>
                                                {item?.first_name}</b></td>
                                            <td>{calculateAge(item?.data_birth, user?.graph_format_date)}</td>
                                            {
                                                data?.service?.map((itemChild: any, index: any) => {
                                                    let findClientValue = item?.client_value?.find((itemValue: any) => itemValue?.service_id == itemChild?.id)
                                                    let findResult = sendResult?.find((sendResItem: any) => sendResItem?.client_value_id == findClientValue?.id)
                                                    return (
                                                        <td className='w-auto'>

                                                            {
                                                                findClientValue ? <input type="text"
                                                                    value={findResult?.result ??findClientValue?.result}
                                                                    onChange={(e: any) => {
                                                                        if (findResult) {
                                                                            setSendResult(sendResult.map((resItem: any) => {
                                                                                if (resItem?.client_value_id == findClientValue?.id) {
                                                                                    return {
                                                                                        ...resItem,
                                                                                        result: e.target.value
                                                                                    }

                                                                                }
                                                                                return resItem
                                                                            }))
                                                                        } else {
                                                                            setSendResult([...sendResult, {
                                                                                client_value_id: findClientValue?.id,
                                                                                result: e.target.value
                                                                            }])
                                                                        }
                                                                    }}
                                                                    className='form-control w-auto' /> :
                                                                    item?.short_name ?? '-'}

                                                        </td>
                                                    )
                                                })
                                            }
                                        </tr>
                                    )
                                }
                                )
                            }
                        </tbody>

                    </table>
                </div>
                <button className='btn btn-primary d-block m-auto my-2'
                    onClick={() => {
                        saveResult(sendResult)
                    }}

                >Saqlash</button>
                {/* <br />
                {
                    load ? '' :
                        <Pagination
                            setPageLimit={(e: any) => {
                                // setNumberOfPages(Math.ceil(clientData?.length / e))
                                // setPageLimit(e)
                                // dispatch(isClientCurrentPage(1))
                                // dispatch(isClientPageLimit(e))

                                (clientAllData(`start_date=${data?.start_date}&end_date=${data?.end_date}&data_birth=${search?.data_birth}&full_name=${search?.full_name}&person_id=${search?.person_id}&phone=${search?.phone}&page=${1}&per_page=${e}`))
                            }}

                            pageLmit={data?.per_page}
                            current={data?.current_page} total={data?.last_page} count={(e: any) => {

                                (clientAllData(`start_date=${data?.start_date}&end_date=${data?.end_date}&data_birth=${search?.data_birth}&full_name=${search?.full_name}&person_id=${search?.person_id}&phone=${search?.phone}&page=${e}&per_page=${data?.per_page}`))
                            }} />
                } */}
            </div>
            <iframe
                ref={iframeRef}
                srcDoc={`<html><body></body></html>`}
                style={{ display: 'none' }} // Iframeni ko'rinmas qilish
            ></iframe>
        </Content>
    )
}

export default LaboratoryTable