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
import uploadFileIcon from '../../../assets/upload-file.svg'
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
import { MdContentCopy, MdDeleteForever, MdPictureAsPdf } from 'react-icons/md'
import { IoMdRepeat } from 'react-icons/io'
import CashRegister from '../../cash_register/CashRegister'
import { formatId } from '../../../helper/idGenerate'
import { getCurrentDateTime } from '../../../helper/dateFormat'
import { cashRegDiscount } from '../../../helper/cashRegCalc'
import { isGraphGet } from '../../../service/reducer/GraphReducer'
import { BiCalendarCheck } from 'react-icons/bi'
import { AiFillEdit, AiOutlineEye } from 'react-icons/ai'
import { FaFileDownload, FaFileUpload, FaPrint, FaRegPlusSquare } from 'react-icons/fa'
import { generateCheck } from '../../../helper/generateCheck'
import { chegirmaHisobla } from '../../../helper/cashRegHelper'
import { isTreatmentGet } from '../../../service/reducer/TreatmentReducer'
import { isReferringDoctorGet } from '../../../service/reducer/ReferringDoctorReducer'
import { laboratoryClientHtml } from './laboratoryClientHtml'
import { labaratoryGroup } from '../../../helper/clientHelper'
import red from '../../../assets/red.png'
import pdf from '../../../assets/pdf.png'
import green from '../../../assets/green.png'
import black from '../../../assets/black.png'
import { domain } from '../../../main'
import { Modal } from 'reactstrap'
const LaboratoryClientCheck = () => {
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
    const { debtClientData } = useSelector((state: ReducerType) => state.ClientReducer)
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
    const [data, setData] = useState({
        data: [],
        start_date: '',
        end_date: ''
    } as any)
    // const dispatch = useDispatch<AppDispatch>()
    const clientAllData = async (data?: any) => {
        try {
            setData({
                start_date: '',
                end_date: '',
                data: [],
            })
            setLoad(() => true)
            let res = await axios.get(`/client/laboratory?${data ?? ''}`)
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
    const [fileModal, setFileModal] = useState(false)
    const [fileData, setFileData] = useState({
        file: [],
        name: ''
    } as any)
    const toggle = () => {
        setFileModal(!fileModal)
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

        return data;



    }
    const [show, setShow] = useState(false)

    const getData = async (id: any) => {
        try {
            setSendLoading(() => true)
            let res = await axios.get('/client/laboratory/' + id)
            const { result } = res.data
            setData(() => result)

        } catch (error) {
            path('/')
        }
        finally {
            setSendLoading(() => false)
        }
    }
    const { id } = useParams()
    useEffect(() => {
        getData(id)
    }, [])
    const path = useNavigate()
    const [sendLoading, setSendLoading] = useState(false)
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
            path('/')
        }
        finally {
            setSendLoading(() => false)
        }
    }
    const [cash, setCash] = useState(false)

    const saveResult = async (data: any) => {
        try {
            setSendLoading(() => true)
            console.log(data);

            let sendJson = data?.client_value?.map((item: any) => {
                let { laboratory_template_result } = item
                return item?.service?.laboratory_template.map((item2: any) => {
                    let find = laboratory_template_result.find((item3: any) => item3?.laboratory_template_id === item2?.id)
                    return {
                        // id: item2?.id,
                        name: find ? find?.name : item2?.name,
                        result: find ? find?.result : item2?.result,
                        normal: find ? find?.normal : item2?.normal,
                        extra_column_1: find ? find?.extra_column_1 : item2?.extra_column_1,
                        extra_column_2: find ? find?.extra_column_2 : item2?.extra_column_2,
                        service_id: item?.service?.id,
                        laboratory_template_id: item2?.id,
                        client_value_id: item?.id,
                        is_print: find ? find?.is_print : 0,
                        color: find ? find?.color : 'black',
                    }
                })
            }).flatMap((item: any) => item)
            console.log('sendJson', sendJson);

            let formdata = new FormData()
            formdata.append('laboratory_template_result', JSON.stringify(sendJson))
            let res = await axios.post('/client/laboratory/save/' + id, formdata)

            const { result } = res.data
            setData(() => {
                return {
                    ...data,
                    client_value: result
                }
            })
        } catch (error) {

        } finally {
            setSendLoading(() => false)
        }
    }
    const [loading, setLoading] = React.useState(false);

    const [type, setType] = useState('all' as any)
    const store = async (target: any) => {
        try {
            const { file, name, servicetype_id } = target
            setSendLoading(true)
            let formData = new FormData();

            // for (let key in file) {
            //     if (file?.[key]?.type) {
            //         formData.append("images[]", file[key]);
            //         formData.append("type", file[key]?.type?.split('/')[0]);
            //     }

            //     console.log(file[key]);

            //     // formData.append("images[]", file[key]);
            // }
            formData.append("file", file);
            formData.append("type", file?.type?.split('/')[0]);
            formData.append("name", name);
            formData.append("servicetype_id", servicetype_id?.value);
            let res = await axios.post(`/client/laboratory/file/${id}`, formData)
            const { result } = res.data
            // setData(() => [
            //     ...data,
            //     ...result
            // ])
            setData(() => {
                return {
                    ...data,
                    files: [
                        ...data.files,
                        ...result
                    ]
                }
            })
            setFileData({
                file: [],
                name: ''
            })
            toggle()
        } catch (error) {

        }
        finally {
            setSendLoading(false)
        }
    }
    const update = async (file: any, id: any) => {
        try {
            setSendLoading(true)
            let formData = new FormData();
            formData.append("file", file);
            let res = await axios.post(`/client/laboratory/file/update/${id}`, formData)
            const { result } = res.data
            setData(() => {
                return {
                    ...data,
                    files: data?.files?.map((item: any) => item?.id === id ? { ...item, ...result } : item)
                }
            })
        } catch (error) {

        }
        finally {
            setSendLoading(false)
        }
    }
    const deletePhoto = async (id: any) => {
        try {
            setSendLoading(true)
            let res = await axios.delete(`/client/laboratory/file-delete/${id}`)
            const { result } = res.data
            setData(() => {
                return {
                    ...data,
                    files: data?.files?.filter((item: any) => item?.id !== id)
                }
            })
        } catch (error) {

        }
        finally {
            setSendLoading(false)
        }
    }
    return (
        <Content loading={sendLoading}  >
            <br />
            <Navbar />
            <div className="container-fluid flex-grow-1 py-1 size_16 ">
                <div className="card p-1">
                    <div className="flex align-items-center gap-2">
                        <p>ID: {formatId(data?.client?.person_id)}</p>
                        <p>I.F.O: {fullName(data?.client)}</p>
                        <p>Tel: {data?.client?.phone ?? '-'}</p>

                    </div>
                    <div className="d-flex my-2 btn-group">

                        {sendLoading ? <p>Yuklanmoqda</p> : <>
                            <button className={`btn btn-sm btn-${type === 'all' ? 'primary' : 'secondary'}`}
                                onClick={() => {
                                    setType('all')
                                }}

                            >
                                barchasi
                            </button>
                            {
                                labaratoryGroup(data, true)?.map((res: any) => (
                                    <button className={`btn btn-sm btn-${type.id === res.id ? 'primary' : 'secondary'}`}
                                        onClick={() => {
                                            setType(res)
                                        }}
                                    >
                                        {res?.type}
                                    </button>
                                ))
                            }
                        </>

                            // data?

                        }

                    </div>

                    {
                        sendLoading ? <p>Yuklanmoqda</p> : labaratoryGroup(data)
                            ?.filter((res: any) => {
                                const { groups } = res
                                if (type === 'all') return true
                                return groups?.flatMap((item: any) => item?.service?.servicetype_id)?.find((item: any) => item === type?.id)
                                //  res.servicetype === type || type === 'all'
                            })
                            ?.map((parentItem: any, parentItemIndex: number) => {
                                const { groups, servicetype } = parentItem
                                console.log('groups', parentItem);
                                const { laboratory_template } = groups?.at(0)?.service
                                let laboratory_template_chek = groups?.flatMap((item: any) => item?.service?.laboratory_template.slice(1))
                                const typeId = groups?.at(0)?.service?.servicetype_id
                                let header = [] as any
                                let chekheadercol = [
                                    'name',
                                    'result',
                                    'normal',
                                    'extra_column_1',
                                    'extra_column_2',
                                    'is_print'
                                ] as any;
                                let headerfind = laboratory_template?.at(0)
                                if (headerfind) {
                                    for (let key in headerfind) {
                                        let res_colums = chekheadercol.find((c: any) => c === key);
                                        if ((headerfind[key] != 'null' && headerfind[key] !== '') && (headerfind[key] !== undefined && res_colums)) {
                                            header.push({
                                                key: key,
                                                name: headerfind[key]
                                            })
                                        }
                                    }

                                }
                                // let client_value_find = laboratory_template_result?.filter((item22: any) => (laboratory_template?.at(0)?.id == item22?.laboratory_template_id ? false : true) && item22?.client_value_id == item?.id && +item22?.is_print)
                                let client_value_find = data?.client_value?.filter((item2: any) => item2?.service?.servicetype_id == typeId)?.flatMap((item22: any) => item22?.laboratory_template_result?.filter((kk: any) => {
                                    return (laboratory_template?.at(0)?.id == kk?.laboratory_template_id ? false : true) && +kk?.is_print
                                }))
                                console.log(
                                    client_value_find
                                );

                                // ?.filter((item22: any) => (laboratory_template?.at(0)?.id == item22?.laboratory_template_id ? false : true) && item22?.client_value_id == item?.id && +item22?.is_print)
                                let index_num = 0;
                                return <div className=' my-2'>
                                    <div className="d-flex justify-content-between align-items-center ">
                                        <h3 className='text-center'>{groups?.length > 1 ? servicetype : groups?.at(0)?.service?.name}</h3>
                                        <button className='btn btn-sm btn-warning'
                                            onClick={() => {
                                                updateIframeContent(laboratoryClientHtml({
                                                    ...data,
                                                    client_value: data?.client_value?.filter((item2: any) => item2?.service?.servicetype_id == typeId),
                                                    files: data?.files?.filter((item2: any) => item2?.servicetype_id == typeId 
                                                    && item2?.type=='image'
                                                ),
                                                }))
                                                handlePrint()
                                            }}

                                        >
                                            <FaPrint />
                                        </button>
                                    </div>
                                    <table className='table table-bordered'>
                                        <thead className='bg-grey '>
                                            <th className=''>
                                                №
                                            </th>
                                            {
                                                header?.map((item: any, index: number) => {
                                                    return <th className='text-center' key={index}>{item?.name}</th>
                                                })
                                            }
                                            <th className=' '>
                                                <input type="checkbox" className='form-check-input'
                                                    checked={client_value_find?.length === laboratory_template_chek?.length}
                                                    onChange={(e: any) => {
                                                        let checked = e.target.checked
                                                        setData(() => {
                                                            return {
                                                                ...data,
                                                                client_value: data?.client_value?.map((item2: any) => {
                                                                    if (item2?.service?.servicetype_id !== typeId) return item2
                                                                    let { laboratory_template_result } = item2
                                                                    let { laboratory_template } = item2.service
                                                                    let result = [] as any;
                                                                    for (let key of laboratory_template.slice(1)) {
                                                                        let find = laboratory_template_result.find((item3: any) => item3?.laboratory_template_id === key?.id)
                                                                        if (find) {
                                                                            result.push({
                                                                                ...find,
                                                                                is_print: checked ? 1 : 0
                                                                            })
                                                                        } else {
                                                                            result.push({
                                                                                ...key,
                                                                                color: 'black',
                                                                                laboratory_template_id: key?.id,
                                                                                client_value_id: item2?.id,
                                                                                is_print: checked ? 1 : 0
                                                                            })
                                                                        }

                                                                    }


                                                                    return {
                                                                        ...item2,
                                                                        laboratory_template_result: result
                                                                    }

                                                                })
                                                            }
                                                        })
                                                    }}


                                                />
                                            </th>
                                        </thead>
                                        {
                                            groups?.map((item: any) => {

                                                const { laboratory_template } = item?.service
                                                const { laboratory_template_result } = item
                                                // let header = [] as any
                                                // let chekheadercol = [
                                                //     'name',
                                                //     'result',
                                                //     'normal',
                                                //     'extra_column_1',
                                                //     'extra_column_2',
                                                //     'is_print'
                                                // ] as any;
                                                // let headerfind = laboratory_template?.at(0)
                                                // if (headerfind) {
                                                //     for (let key in headerfind) {
                                                //         let res_colums = chekheadercol.find((c: any) => c === key);
                                                //         if ((headerfind[key] != 'null' && headerfind[key] !== '') && (headerfind[key] !== undefined && res_colums)) {
                                                //             header.push({
                                                //                 key: key,
                                                //                 name: headerfind[key]
                                                //             })
                                                //         }
                                                //     }

                                                // }
                                                // let client_value_find = laboratory_template_result?.filter((item22: any) => (laboratory_template?.at(0)?.id == item22?.laboratory_template_id ? false : true) && item22?.client_value_id == item?.id && +item22?.is_print)
                                                return (<tbody>
                                                    {
                                                        laboratory_template?.slice(1)?.map((res: any, parent_index: number) => {
                                                            let value = laboratory_template_result?.find((item22: any) => item22?.laboratory_template_id == res?.id && item22?.client_value_id == item?.id)
                                                            index_num = index_num + 1
                                                            return <tr key={parent_index}>
                                                                <td>
                                                                    {index_num}
                                                                </td>

                                                                {
                                                                    header?.map((item1: any, index: number) => {

                                                                        return <td key={index} className={item1.key == 'result' ? ' position-relative p-0' : 'p-0'}>

                                                                            <textarea
                                                                                id={`text_area_${typeId}_${index}_${index_num}`}
                                                                                data-index={index}
                                                                                data-index_num={index_num}
                                                                                style={item1.key == 'result' ? { color: `${value ? value?.color : 'black'}`, fontWeight: 'bolder', } : { minHeight: '100%' }}
                                                                                onKeyDown={(e: any) => {
                                                                                    console.log('keydown', e);
                                                                                    let idData = e.target.id.split('_');
                                                                                    console.log('keydown', id);
                                                                                    console.log('keydown', idData.at(-2));
                                                                                    console.log('keydown', idData.at(-1));
                                                                                    let index = +idData.at(-2)
                                                                                    let parent_index = +idData.at(-1)

                                                                                    if (e.key == 'ArrowRight') {
                                                                                        e.preventDefault()
                                                                                        if (+index + 1 == header?.length) {
                                                                                            console.log('endddd', `text_area_${0}_${+parent_index + 1}`);

                                                                                            // document.getElementById(`text_area_${0}_${parent_index + 1}`)?.focus()
                                                                                            document.getElementById(`text_area_${typeId}_${0}_${+parent_index + 1}`)?.focus()
                                                                                        } else {
                                                                                            console.log(`text_area_${typeId}_${+index + 1}_${parent_index}`);

                                                                                            document.getElementById(`text_area_${typeId}_${+index + 1}_${parent_index}`)?.focus()
                                                                                        }
                                                                                        // document.getElementById(`text_area_${typeId}_${index + 1}_${index_num}`)?.focus()
                                                                                    } else if (e.key == 'ArrowLeft') {
                                                                                        e.preventDefault()
                                                                                        if (index == 0) {
                                                                                            document.getElementById(`text_area_${typeId}_${header?.length - 1}_${parent_index - 1}`)?.focus()
                                                                                        } else {
                                                                                            document.getElementById(`text_area_${typeId}_${index - 1}_${parent_index}`)?.focus()
                                                                                        }
                                                                                    } else if (e.key == 'ArrowDown') {
                                                                                        e.preventDefault()
                                                                                        document.getElementById(`text_area_${typeId}_${index}_${parent_index + 1}`)?.focus()
                                                                                    } else if (e.key == 'ArrowUp') {
                                                                                        e.preventDefault()
                                                                                        document.getElementById(`text_area_${typeId}_${index}_${parent_index - 1}`)?.focus()
                                                                                    } else {



                                                                                    }

                                                                                    // ArrowRight
                                                                                    // ArrowLeft
                                                                                    // ArrowDown
                                                                                    // /ArrowUp
                                                                                }}
                                                                                onChange={(e: any) => {
                                                                                    setData(() => {
                                                                                        return {
                                                                                            ...data,
                                                                                            client_value: data?.client_value?.map((item2: any) => {
                                                                                                let findValue = item2?.laboratory_template_result?.find((item3: any) => item3?.laboratory_template_id == res?.id && item3?.client_value_id == item?.id)
                                                                                                if (findValue) {
                                                                                                    return {
                                                                                                        ...item2,
                                                                                                        laboratory_template_result: item2?.laboratory_template_result?.map((item3: any) => {
                                                                                                            if (findValue?.laboratory_template_id == item3?.laboratory_template_id) {
                                                                                                                return {
                                                                                                                    ...item3,
                                                                                                                    [item1?.key]: e.target.value
                                                                                                                }
                                                                                                            }
                                                                                                            return {
                                                                                                                ...item3
                                                                                                            }
                                                                                                        })
                                                                                                    }
                                                                                                }

                                                                                                return {
                                                                                                    ...item2,
                                                                                                    laboratory_template_result: [
                                                                                                        ...item2?.laboratory_template_result,
                                                                                                        {
                                                                                                            ...res,
                                                                                                            is_print: 0,
                                                                                                            id: 0,
                                                                                                            client_value_id: item?.id,
                                                                                                            laboratory_template_id: res?.id,
                                                                                                            [item1?.key]: e.target.value
                                                                                                        }
                                                                                                    ],

                                                                                                }
                                                                                            })
                                                                                        }
                                                                                    })
                                                                                }}

                                                                                className='form-control'>
                                                                                {
                                                                                    value ? value?.[item1?.key] : res[item1?.key]
                                                                                }
                                                                            </textarea>
                                                                            {/* {
                                                                                item1.key == 'result' ? <div>
                                                                                    <button className='btn p-1'
                                                                                        onClick={(e: any) => {
                                                                                            setData(() => {
                                                                                                return {
                                                                                                    ...data,
                                                                                                    client_value: data?.client_value?.map((item2: any) => {
                                                                                                        let findValue = item2?.laboratory_template_result?.find((item3: any) => item3?.client_value_id == item2?.id && item3?.laboratory_template_id == res?.id)
                                                                                                        console.log('findValue', findValue);
                                                                                                        if (findValue) {
                                                                                                            return {
                                                                                                                ...item2,
                                                                                                                laboratory_template_result: item2?.laboratory_template_result?.map((item3: any) => {
                                                                                                                    if (findValue?.laboratory_template_id == item3?.laboratory_template_id) {
                                                                                                                        return {
                                                                                                                            ...item3,
                                                                                                                            color: 'black'
                                                                                                                        }
                                                                                                                    }
                                                                                                                    return {
                                                                                                                        ...item3
                                                                                                                    }
                                                                                                                })
                                                                                                            }
                                                                                                        }

                                                                                                        return {
                                                                                                            ...item2,
                                                                                                            laboratory_template_result: [
                                                                                                                ...item2?.laboratory_template_result,
                                                                                                                {

                                                                                                                    ...res,
                                                                                                                    laboratory_template_id: res?.id,
                                                                                                                    client_value_id: item2?.id,
                                                                                                                    color: 'black'
                                                                                                                }
                                                                                                            ],

                                                                                                        }
                                                                                                    })
                                                                                                }
                                                                                            })
                                                                                        }}

                                                                                    >
                                                                                        <img src={black} style={{
                                                                                            width: '20px',
                                                                                            height: '20px'
                                                                                        }} alt="" />
                                                                                    </button> <br />
                                                                                    <button className='btn p-1'
                                                                                        onClick={(e: any) => {
                                                                                            setData(() => {
                                                                                                return {
                                                                                                    ...data,
                                                                                                    client_value: data?.client_value?.map((item2: any) => {
                                                                                                        let findValue = item2?.laboratory_template_result?.find((item3: any) => item3?.client_value_id == item2?.id && item3?.laboratory_template_id == res?.id)
                                                                                                        console.log('findValue', findValue);
                                                                                                        if (findValue) {
                                                                                                            return {
                                                                                                                ...item2,
                                                                                                                laboratory_template_result: item2?.laboratory_template_result?.map((item3: any) => {
                                                                                                                    if (findValue?.laboratory_template_id == item3?.laboratory_template_id) {
                                                                                                                        return {
                                                                                                                            ...item3,
                                                                                                                            color: 'green'
                                                                                                                        }
                                                                                                                    }
                                                                                                                    return {
                                                                                                                        ...item3
                                                                                                                    }
                                                                                                                })
                                                                                                            }
                                                                                                        }

                                                                                                        return {
                                                                                                            ...item2,
                                                                                                            laboratory_template_result: [
                                                                                                                ...item2?.laboratory_template_result,
                                                                                                                {

                                                                                                                    ...res,
                                                                                                                    laboratory_template_id: res?.id,
                                                                                                                    client_value_id: item2?.id,
                                                                                                                    color: 'green'
                                                                                                                }
                                                                                                            ],

                                                                                                        }
                                                                                                    })
                                                                                                }
                                                                                            })
                                                                                        }}

                                                                                    >
                                                                                        <img src={green} style={{
                                                                                            width: '20px',
                                                                                            height: '20px'
                                                                                        }} alt="" />
                                                                                    </button> <br />
                                                                                    <button className='btn p-1'
                                                                                        onClick={(e: any) => {
                                                                                            setData(() => {
                                                                                                return {
                                                                                                    ...data,
                                                                                                    client_value: data?.client_value?.map((item2: any) => {
                                                                                                        let findValue = item2?.laboratory_template_result?.find((item3: any) => item3?.client_value_id == item2?.id && item3?.laboratory_template_id == res?.id)
                                                                                                        console.log('findValue', findValue);
                                                                                                        if (findValue) {
                                                                                                            return {
                                                                                                                ...item2,
                                                                                                                laboratory_template_result: item2?.laboratory_template_result?.map((item3: any) => {
                                                                                                                    if (findValue?.laboratory_template_id == item3?.laboratory_template_id) {
                                                                                                                        return {
                                                                                                                            ...item3,
                                                                                                                            color: 'red'
                                                                                                                        }
                                                                                                                    }
                                                                                                                    return {
                                                                                                                        ...item3
                                                                                                                    }
                                                                                                                })
                                                                                                            }
                                                                                                        }

                                                                                                        return {
                                                                                                            ...item2,
                                                                                                            laboratory_template_result: [
                                                                                                                ...item2?.laboratory_template_result,
                                                                                                                {

                                                                                                                    ...res,
                                                                                                                    laboratory_template_id: res?.id,
                                                                                                                    client_value_id: item2?.id,
                                                                                                                    color: 'red'
                                                                                                                }
                                                                                                            ],

                                                                                                        }
                                                                                                    })
                                                                                                }
                                                                                            })
                                                                                        }}
                                                                                    >
                                                                                        <img src={red} style={{
                                                                                            width: '20px',
                                                                                            height: '20px'
                                                                                        }} alt="" />
                                                                                    </button>
                                                                                </div> : ''
                                                                            } */}
                                                                            {
                                                                                item1.key == 'result' ? <>
                                                                                    <input type="checkbox" className='checkbox form-check-input bg-danger  position-absolute  top-0 end-0 z-index-1'
                                                                                        checked={value?.color == 'red' ? true : false}
                                                                                        onChange={(e: any) => {
                                                                                            let checked = e.target.checked
                                                                                            let colorres = checked ? 'red' : 'black'
                                                                                            setData(() => {
                                                                                                return {
                                                                                                    ...data,
                                                                                                    client_value: data?.client_value?.map((item2: any) => {
                                                                                                        let findValue = item2?.laboratory_template_result?.find((item3: any) => item3?.client_value_id == item2?.id && item3?.laboratory_template_id == res?.id)
                                                                                                        console.log('findValue', findValue);
                                                                                                        if (findValue) {
                                                                                                            return {
                                                                                                                ...item2,
                                                                                                                laboratory_template_result: item2?.laboratory_template_result?.map((item3: any) => {
                                                                                                                    if (findValue?.laboratory_template_id == item3?.laboratory_template_id) {
                                                                                                                        return {
                                                                                                                            ...item3,
                                                                                                                            color: colorres
                                                                                                                        }
                                                                                                                    }
                                                                                                                    return {
                                                                                                                        ...item3
                                                                                                                    }
                                                                                                                })
                                                                                                            }
                                                                                                        }

                                                                                                        return {
                                                                                                            ...item2,
                                                                                                            laboratory_template_result: [
                                                                                                                ...item2?.laboratory_template_result,
                                                                                                                {

                                                                                                                    ...res,
                                                                                                                    laboratory_template_id: res?.id,
                                                                                                                    client_value_id: item2?.id,
                                                                                                                    color: colorres
                                                                                                                }
                                                                                                            ],

                                                                                                        }
                                                                                                    })
                                                                                                }
                                                                                            })
                                                                                        }}

                                                                                    />

                                                                                    <input type="checkbox" className='checkbox form-check-input bg-success position-absolute  bottom-0 end-0 z-index-1'
                                                                                        checked={value?.color == 'green' ? true : false}
                                                                                        onChange={(e: any) => {
                                                                                            let checked = e.target.checked
                                                                                            let colorres = checked ? 'green' : 'black'
                                                                                            setData(() => {
                                                                                                return {
                                                                                                    ...data,
                                                                                                    client_value: data?.client_value?.map((item2: any) => {
                                                                                                        let findValue = item2?.laboratory_template_result?.find((item3: any) => item3?.client_value_id == item2?.id && item3?.laboratory_template_id == res?.id)
                                                                                                        console.log('findValue', findValue);
                                                                                                        if (findValue) {
                                                                                                            return {
                                                                                                                ...item2,
                                                                                                                laboratory_template_result: item2?.laboratory_template_result?.map((item3: any) => {
                                                                                                                    if (findValue?.laboratory_template_id == item3?.laboratory_template_id) {
                                                                                                                        return {
                                                                                                                            ...item3,
                                                                                                                            color: colorres
                                                                                                                        }
                                                                                                                    }
                                                                                                                    return {
                                                                                                                        ...item3
                                                                                                                    }
                                                                                                                })
                                                                                                            }
                                                                                                        }

                                                                                                        return {
                                                                                                            ...item2,
                                                                                                            laboratory_template_result: [
                                                                                                                ...item2?.laboratory_template_result,
                                                                                                                {

                                                                                                                    ...res,
                                                                                                                    laboratory_template_id: res?.id,
                                                                                                                    client_value_id: item2?.id,
                                                                                                                    color: colorres
                                                                                                                }
                                                                                                            ],

                                                                                                        }
                                                                                                    })
                                                                                                }
                                                                                            })
                                                                                        }}

                                                                                    />
                                                                                </> : ''
                                                                            }

                                                                        </td>
                                                                    })
                                                                }
                                                                <td>
                                                                    <input type="checkbox" className='form-check-input'
                                                                        checked={value ? (+value?.is_print ? true : false) : false}
                                                                        onChange={(e: any) => {
                                                                            setData(() => {
                                                                                return {
                                                                                    ...data,
                                                                                    client_value: data?.client_value?.map((item2: any) => {
                                                                                        let findValue = item2?.laboratory_template_result?.find((item3: any) => item3?.client_value_id == item2?.id && item3?.laboratory_template_id == res?.id)
                                                                                        console.log('findValue', findValue);
                                                                                        if (findValue) {
                                                                                            return {
                                                                                                ...item2,
                                                                                                laboratory_template_result: item2?.laboratory_template_result?.map((item3: any) => {
                                                                                                    if (findValue?.laboratory_template_id == item3?.laboratory_template_id) {
                                                                                                        return {
                                                                                                            ...item3,
                                                                                                            is_print: e.target.checked ? 1 : 0
                                                                                                        }
                                                                                                    }
                                                                                                    return {
                                                                                                        ...item3
                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                        }

                                                                                        return {
                                                                                            ...item2,
                                                                                            laboratory_template_result: [
                                                                                                ...item2?.laboratory_template_result,
                                                                                                {

                                                                                                    ...res,
                                                                                                    color: 'black',
                                                                                                    laboratory_template_id: res?.id,
                                                                                                    client_value_id: item2?.id,
                                                                                                    is_print: e.target.checked ? 1 : 0
                                                                                                }
                                                                                            ],

                                                                                        }
                                                                                    })
                                                                                }
                                                                            })
                                                                        }}

                                                                    />
                                                                </td>

                                                            </tr>
                                                        })
                                                    }
                                                </tbody>

                                                )
                                            })
                                        }
                                    </table>

                                </div>



                            })
                    }

                    <hr />
                    <div className="row">
                        <p>
                            Rasm yuklash
                        </p>
                        {
                            loading ? "Yuklanmoqda..." : ''
                        }
                        {
                            data?.files?.filter((res: any) => res?.type != 'application')?.map((res: any, index: any) => {
                                return <div className="col-2 my-2  ">

                                    <div className="card position-relative border rounded-1">
                                        <img src={`${domain}${res?.file}`} alt="" className='w-100 rounded-1' height={200}


                                        />

                                        <button className='show_files  rounded-1  border-0 text-white' onClick={() => {
                                            toggle()
                                            let find = labaratoryGroup(data, true)?.find((item: any) => item?.id == res?.servicetype_id)
                                            setFileData({
                                                ...res,
                                                servicetype_id: {
                                                    value: res?.id,
                                                    label: find?.type
                                                }

                                            })
                                        }}>
                                            <AiOutlineEye size={30} />
                                        </button>
                                        <p className='index__'>{index + 1}</p>
                                        <p className='mb-0 py-1'>
                                            {res?.name}
                                        </p>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center my-1">
                                        <a href={`${domain}${res?.file}`} download={`${domain}${res?.file}`} target='_blank' className='btn btn-primary  btn-sm text-white'><FaFileDownload /></a>
                                        <button className='btn  btn-danger btn-sm'
                                            onClick={() => {
                                                Swal.fire({
                                                    title: "Ma'lumotni o'chirasizmi?",
                                                    showDenyButton: true,
                                                    showCancelButton: true,
                                                    confirmButtonText: 'Ha',
                                                    denyButtonText: `Yo'q`,
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        deletePhoto(res?.id)
                                                    }
                                                })
                                            }}

                                        >    <MdDeleteForever /></button>
                                    </div>
                                </div>
                            })
                        }
                        {
                            sendLoading || loading ? '' : <div className="col-2 my-2  ">
                                <div className="card position-relative" onClick={() => {
                                    setFileModal(true)
                                    setFileData({
                                        file: [],
                                        name: ''
                                    })
                                }}>
                                    {/* <input
                                        type="file"
                                        accept="image/*"
                                        className='opacity-0 uplaod_img  absolute top-0 start-0  cursor-pointer' multiple onChange={(e: any) => {
                                            if (e.target.files.length > 0) {
                                                console.log(e.target.files);
                                                store(e.target.files)
                                            }
                                        }
                                        } /> */}
                                    <img src={uploadFileIcon} alt="" className='w-100' height={200} />
                                </div>
                            </div>
                        }
                        <hr />
                        <p>
                            Fayllar
                        </p>

                        {
                            loading ? "Yuklanmoqda..." : ''
                        }
                        {
                            data?.files?.filter((res: any) => res?.type == 'application')?.map((res: any, index: any) => {
                                return <div className="col-2 my-2  ">

                                    <div className="card position-relative border rounded-1">
                                        <img src={pdf} alt="" className='w-100 rounded-1' height={200}
                                            style={{
                                                objectFit: 'contain'
                                            }}

                                        />

                                        {/* <button className='show_files  rounded-1  border-0 text-white' onClick={() => {
                                            toggle()
                                            setFileData(res)
                                        }}>
                                            <AiOutlineEye size={30} />
                                        </button>
                                        <p className='index__'>{index + 1}</p> */}
                                        <p className='mb-0 py-1'>
                                            {res?.name}
                                        </p>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center my-1">
                                        <a href={`${domain}${res?.file}`} download={`${domain}${res?.file}`} target='_blank' className='btn btn-primary  btn-sm text-white'><FaFileDownload /></a>
                                        <button className='btn  btn-danger btn-sm'
                                            onClick={() => {
                                                Swal.fire({
                                                    title: "Ma'lumotni o'chirasizmi?",
                                                    showDenyButton: true,
                                                    showCancelButton: true,
                                                    confirmButtonText: 'Ha',
                                                    denyButtonText: `Yo'q`,
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        deletePhoto(res?.id)
                                                    }
                                                })
                                            }}

                                        >    <MdDeleteForever /></button>
                                    </div>
                                </div>
                            })
                        }
                        {
                            sendLoading || loading ? '' : <div className="col-2 my-2  ">
                                <div className="card position-relative" onClick={() => {
                                    setFileModal(true)
                                    setFileData({
                                        type: 'file',
                                        file: [],
                                        name: ''
                                    })
                                }}>
                                    <img src={uploadFileIcon} alt="" className='w-100' height={200} />
                                </div>
                            </div>
                        }
                        {/* <div className="d-flex flex-wrap align-items-center gap-2">

                            {
                                data?.files?.filter((res: any) => res?.type == 'application')?.map((res: any, index: any, array: any) => {
                                    return <div className="my-2 d-flex align-items-center gap-1 border border-primary rounded">
                                        <button className='btn btn-sm btn-primary'> <MdPictureAsPdf size={18} /></button>
                                        <p className='mb-0'>
                                            {res?.name}
                                        </p>

                                        <a href={`${domain}${res?.file}`} download={`${domain}${res?.file}`} target='_blank' className='btn btn-primary btn-sm text-white'><FaFileDownload /></a>
                                        <button className='btn btn-danger btn-sm'
                                            onClick={() => {
                                                Swal.fire({
                                                    title: "Ma'lumotni o'chirasizmi?",
                                                    showDenyButton: true,
                                                    showCancelButton: true,
                                                    confirmButtonText: 'Ha',
                                                    denyButtonText: `Yo'q`,
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        deletePhoto(res?.id)
                                                    }
                                                })
                                            }}
                                        ><MdDeleteForever /></button>

                                    </div>
                                })
                            }
                            <div>
                                <button className='btn btn-success  my-2' onClick={() => {
                                    setFileData({
                                        type: 'file',
                                        file: [],
                                        name: ''
                                    })
                                    toggle()
                                }}
                                >
                                    Fayl yuklash
                                    <FaFileUpload /></button>
                            </div>
                        </div> */}


                    </div>
                    <div className='d-flex justify-content-center gap-2'>
                        <button className='btn btn-primary ' onClick={() => saveResult(data)}>
                            Tasdiqlash
                        </button>
                        <button className='btn btn-warning ' onClick={() => {

                            updateIframeContent(laboratoryClientHtml(data))
                            handlePrint()
                        }}>
                            <FaPrint /> Chop etish
                        </button>
                    </div>
                </div>




            </div>
            <Modal centered={true} isOpen={fileModal} toggle={toggle} role='dialog' size={fileData?.id > 0 ? 'xl' : 'lg'} backdrop="static" keyboard={false}>
                <div className="modal-header">
                    <h1>Fayl</h1>
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
                    <form onSubmit={(e: any) => {
                        e.preventDefault()
                        store(fileData)
                    }}>
                        {
                            fileData?.type == 'file' ? <div>
                                <input type="file" className='form-control' accept="application/pdf" onChange={(e: any) => {
                                    if (e.target.files[0]) {
                                        console.log(e.target.files);
                                        setFileData({
                                            ...fileData,
                                            file: e.target.files[0],
                                            name: e.target.files[0].name,

                                        })
                                        // store(e.target.files)
                                    }
                                }
                                } />
                            </div> : <div className="col-12 card position-relative my-1" >
                                {
                                    fileData?.id > 0 ? '' : <input
                                        type="file"
                                        accept="image/*"
                                        required
                                        className='opacity-0 uplaod_img  absolute top-0 start-0  cursor-pointer' onChange={(e: any) => {
                                            if (e.target.files[0]) {
                                                console.log(e.target.files);
                                                setFileData({
                                                    ...fileData,
                                                    file: e.target.files[0],
                                                    name: e.target.files[0].name,

                                                })
                                                // store(e.target.files)
                                            }
                                        }
                                        } />
                                }
                                {
                                    fileData?.id > 0 ? <img src={`${domain}${fileData?.file}`} alt="" className='w-100' /> : <img src={fileData?.file?.length != 0 ? URL.createObjectURL(fileData?.file) : uploadFileIcon} alt="" className='w-100' height={300} />
                                }

                            </div>
                        }

                        <div className="col-12 mb-1">

                            <label className="form-label">Fayl nomi</label>
                            <input type="text" className='form-control'
                                disabled={fileData?.id > 0}
                                onChange={(e: any) => {
                                    setFileData({
                                        ...fileData,
                                        name: e.target.value
                                    })
                                }}
                                value={fileData?.name}
                            />
                        </div>
                        <div className="col-12 mb-1">
                            <label className="form-label">Xizmat turi</label>
                            <Select
                                name='name3'
                                isDisabled={fileData?.id > 0}
                                value={fileData?.servicetype_id}
                                onChange={(e: any) => {
                                    setFileData({
                                        ...fileData,
                                        servicetype_id: e
                                    })
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                // value={userBranch}
                                options={
                                    (labaratoryGroup(data, true))?.map((res: any) => {
                                        return {
                                            value: res?.id,
                                            label: res?.type
                                        }
                                    })
                                } />
                        </div>
                        {fileData?.id > 0 ? '' : <div className="d-flex gap-2 my-2">
                            <button


                                className="btn btn-primary" data-bs-dismiss="modal">
                                Saqlash
                            </button>

                            <button type="button" className="btn btn-danger" onClick={toggle}>Ortga</button>
                        </div>}

                    </form>
                </div>

            </Modal>
            <iframe
                ref={iframeRef}
                srcDoc={`<html><body></body></html>`}
                style={{ display: 'none' }} // Iframeni ko'rinmas qilish
            ></iframe>
        </Content>
    )
}

export default LaboratoryClientCheck