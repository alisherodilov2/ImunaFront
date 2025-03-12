import React, { FC, forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AiFillCheckCircle, AiFillEdit } from 'react-icons/ai'
import Checkbox from '../inputs/Checkbox'
import { NewDivProps } from '../../interface/interface'
import Button from '../buttons/Button'
import { MdDeleteForever, MdOutlineRemoveRedEye, MdOutlineZoomInMap, MdOutlineZoomOutMap } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../service/store/store'
import Swal from 'sweetalert2'
import { read, utils, writeFileXLSX } from 'xlsx'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'
import ButtonLink from '../buttons/ButtonLink'
import { isFindFunction } from '../../service/reducer/MenuReducer'
import TableLoader from './TableLoader'
import { BsArrowRepeat, BsDatabaseFillX } from 'react-icons/bs'
import { IoMdPrint } from 'react-icons/io'
import { FaFileDownload, FaFileUpload } from 'react-icons/fa'
import { nanoid } from '@reduxjs/toolkit'
import { handleFullScreen } from '../../service/helper/fullScreen'
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    timer: 2000,
    showConfirmButton: false,
    timerProgressBar: true
})
const Table: FC<NewDivProps> = forwardRef<HTMLDivElement, NewDivProps>(({
    localDelete = false, localEdit = false, top = 0, scrollRole = false, rowSpanRole = false, reloadData = false, exportFile,
    importFile, trConditionClassFunction = function () { return '' }, excelFileImportFunction = function () { }, trClick = function () { }, showFunction = function () { }, localFunction = false, excelFileExportFunction = function () { }, localEditFunction = function () { }, setNumberOfPages = function () { }, deleteLocalFunction = function () { }, reloadDataFunction = function () { }, paginationRole, page = 0, limit = 5, checkbox, checkboxResult, errorMassage = {}, isLoading = false, isSuccess, editdispatchFunction,
    showIcon = <MdOutlineRemoveRedEye />,
    allCheckRoleFun = function () { },
    allCheckId = '',
    extraButton = function () { return <></> },
    extraButtonRole = false,
    deletedispatchFunction,
    editRole = false,
    showRole = false,
    deleteRole, dataSource, columns, extraKeys = [],
    extraTrFunction = function () { return '' }
}, ref) => {
    const dispatch = useDispatch<AppDispatch>()
    let columnsRes = editRole || deleteRole ? [...columns, {
        key: 'actions',
        title: 'Amallar',

    }] : columns
    let { pathname } = useLocation();
    const path = useNavigate();
    const [checkData, setCheckData] = useState([] as any)
    const checkFun = (item: any) => {
        let resultCheck = checkData?.find((checkItem: any) => checkItem?.id === item?.id);
        if (resultCheck) {
            return checkData.filter((checkItem: any) => checkItem?.id !== item?.id)
        }
        return [...checkData, item]
    }
    const handleDragStart = (e: any, id: any) => {
        e.dataTransfer.setData('text/plain', id);
        setDraggedId(id);
    };

    const handleDragOver = (e: any) => {
        e.preventDefault();
    };
    const [dragging, setDragging] = useState(false);
    const [draggedId, setDraggedId] = useState(null);
    const [rows, setRows] = useState(dataSource);
    const handleDrop = (e: any, id: any) => {
        e.preventDefault();
        setRows(filter(rows))
        const dragId = e.dataTransfer.getData('text');
        const dragIndex = rows.findIndex((row: any) => row.id === Number(draggedId));
        const dropIndex = rows.findIndex((row: any) => row.id === Number(id));
        let dragIndexObject = rows.at(dragIndex)
        setRows(rows.with(dragIndex, rows.at(dropIndex)).with(dropIndex, dragIndexObject));
        setDraggedId(null);

    };
    useEffect(() => {
        setRows(filter(rows))
    }, [rows])
    const filter = (data: any = []) => {
        if (data?.length > 0) {
            return data
        }
        return dataSource
    }

    const deleteAll = (id: any) => {
        Swal.fire({
            title: "Ma'lumotni o'chirasizmi?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Ha',
            denyButtonText: `Yo'q`,
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${pathname}/${JSON.stringify(id)}`)
                    .then((res) => {
                        if (res.data.result > 0) {
                            dispatch(deletedispatchFunction(id))
                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                title: "Maxsulot o'chirildi",
                                showConfirmButton: false,
                                timer: 2500
                            })
                        }
                    })
            }
        })
        // dispatch(deletedispatchFunction(id))

    }
    interface MyType {
        value?: string;
    }
    // const fileInputRef = useRef<Any | null>({});

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

            excelFileImportFunction(jsonData);
            e.target.value = '';
            // Output JSON data
        };

        reader.readAsArrayBuffer(file);
    }

    const pagination = (data: any) => {
        if (paginationRole) {
            // setNumberOfPages(Math?.ceil(data?.length / limit))

            // if (data.length <= (page * limit)) {
            //     setNumberOfPages(1)
            //     return data
            // }
            return data?.slice((page * limit) - limit, page * limit)
            // return data.slice((page * limit) - limit, page * limit).length == 0 ? data : data.slice((page * limit) - limit, page * limit)
        } else {
            return data
        }
    }
    useLayoutEffect(() => {
    }, [dataSource])
    const { handleClick,
        screen } = handleFullScreen(true)
    return (
        <div ref={ref} className={`${screen ? ' top-0 left-0 w-full h-full z-[999]' : ''} table-responsive text-nowrap`}>
            {/* <button

                style={{
                    zIndex: 9999,
                    right: 0
                }}
                onClick={() => {
                    reloadDataFunction()
                }}
                className="btn btn-sm btn-icon btn-primary position-absolute top-0 right-0">
                <span className="tf-icons bx bx-cog" />
            </button> */}

            <div style={{
                zIndex: 999,
                right: 0
            }} className="btn-group btn-group-sm  position-absolute top-0 right-0" role="group" aria-label="First group">

                {reloadData &&
                    <button type="button" className="btn  btn-primary" onClick={() => {
                        reloadDataFunction()
                    }}>
                        <i className="tf-icons bx bx-reset" />
                    </button>
                }
                {exportFile &&
                    <button type="button" className="btn  btn-primary" onClick={() => {
                        excelFileExportFunction(dataSource)
                    }}>
                        <i className="tf-icons bx bx-export" />
                    </button>
                }
                {importFile &&
                    <button type="button" className="btn  btn-primary" onClick={() => {
                        excelFileExportFunction(dataSource)
                    }}>
                        <i className="tf-icons bx bx-export" />
                    </button>
                }
                {/* <button type="button" className="btn  btn-info">
                    <i className="tf-icons bx bx-export" />
                </button>
                <button type="button" className="btn  btn-info">
                    <i className="tf-icons bx bx-import" />
                </button> */}
            </div>

            <table className="table table-bordered" >
                <thead className={`${scrollRole ? `sticky-top blur top-[${top}px]` : 'top-[120px]'}  backdrop-blur-2xl  bg-transparent   z-50 left-0`}>
                    <tr className='text-nowrap'>
                        {/* <th  className="p-[12px]">
                            <span >id</span>
                        </th> */}
                        {
                            columnsRes
                                ?.filter((res: any) => {
                                    if (res?.condition_role) {
                                        return res?.condition == res.key
                                    }
                                    return true
                                })
                                ?.map((item: any, index: any) => (
                                    <th className="" key={nanoid()}>
                                        {
                                            allCheckId == item?.key && allCheckRoleFun()
                                        }
                                        {
                                            item?.title
                                        }

                                    </th>

                                ))
                        }
                        {/* <td className="p-[16px] flex items-center gap-3"> */}

                        {/* <Button onClick={() => {
                                // Swal.fire({
                                //     title: "Ma'lumotni o'chirasizmi?",
                                //     showDenyButton: true,
                                //     showCancelButton: true,
                                //     confirmButtonText: 'Ha',
                                //     denyButtonText: `Yo'q`,
                                // }).then((result) => {
                                //     if (result.isConfirmed) {
                                //         axios.delete(`${pathname}/${item?.id}`)
                                //             .then((res) => {
                                //                 if (res.data.result) {
                                //                     Swal.fire({
                                //                         position: 'top-end',
                                //                         icon: 'success',
                                //                         title: "Maxsulot o'chirildi",
                                //                         showConfirmButton: false,
                                //                         timer: 2500
                                //                     })
                                //                     dispatch(deletedispatchFunction(item?.id))
                                //                 }
                                //             })
                                //     }
                                // })
                            }}>
                                <IoMdPrint />
                            </Button>
                            <Button onClick={() => deleteAll(checkData.map((deleteId: any) => deleteId.id))}>
                                <MdDeleteForever />
                            </Button> */}


                        {/* {
                                importFile &&
                                <>
                                    <Button className='relative'>
                                        <label htmlFor="fileUpload" className='w-full h-full top-0 left-0 absolute cursor-pointer'>
                                        </label>
                                        <FaFileUpload />
                                    </Button>
                                    <input type="file" className='hidden' id="fileUpload" name="fileUpload"
                                        // ref={fileInputRef}
                                        onChange={handleFile} onInput={handleFile} accept=".xlsx, .xls, .csv" />
                                </>
                            }
                            {
                                exportFile &&
                                <Button onClick={() => {
                                    excelFileExportFunction(dataSource)

                                }} >
                                    <FaFileDownload />
                                </Button>
                            } */}


                        {/* <Button onClick={() => {
                                handleClick()
                            }}>
                                {screen ? <MdOutlineZoomInMap /> :
                                    <MdOutlineZoomOutMap />
                                }
                            </Button> */}
                        {/* </td> */}
                    </tr>


                </thead>
                <tbody
                >
                    {
                        isLoading &&
                        <tr >
                            <td colSpan={columns?.length + 5} >
                                <TableLoader />
                            </td>
                        </tr>
                    }

                    {
                        errorMassage?.message?.length >= 1 &&
                        <tr className='text-danger'>
                            <td colSpan={columns?.length + 2} className=' p-3 border  ' >
                                <h2 className=' p-2 text-center text-danger' >
                                    <span className='tf-icons bx bx-error tf-2'>

                                    </span>
                                    <span>
                                        {errorMassage?.status}
                                    </span>
                                </h2>
                                <p>
                                    <span className='tf-icons bx bx-message-rounded-detail tf-2'>
                                    </span>
                                    <b>message</b>
                                    <span>

                                        :{
                                            errorMassage.message
                                        }
                                    </span>
                                </p>
                                <p>
                                    <span className='tf-icons bx bx-file tf-2'>
                                    </span>
                                    <b>file</b>:{
                                        errorMassage.file
                                    }
                                </p>
                                <p>
                                    <span className='tf-icons bx bx-terminal tf-2'>
                                    </span>
                                    <b>line</b>:{
                                        errorMassage.line
                                    }
                                </p>
                            </td>
                        </tr>
                    }

                    {
                        (pagination(dataSource)?.length === 0) || !dataSource ?
                            <>
                                {errorMassage !== null && errorMassage !== undefined && (Object?.keys(errorMassage)?.length <= 1 && !isLoading) && <tr>
                                    <td colSpan={columns?.length + 2} className='text-[35px] text-center py-32' >
                                        <p>
                                            <BsDatabaseFillX className='block m-auto ' />
                                        </p>
                                        <p>Malumot yo'q</p>
                                    </td>
                                </tr>}
                            </> :
                            pagination(dataSource)?.map((item: any, index: number) => {
                                let res = [];
                                // if (rowSpanRole) {
                                //     for (let key in item) {
                                //         let res_colums = columnsRes.find((c: any) => c.key === key);
                                //         if (res_colums) {
                                //             let keys = res_colums !== null && res_colums !== undefined ? [...Object?.keys(res_colums)].find((c: any) => c === 'render') : false;
                                //             if (keys) {
                                //                 if (item[key]?.rowSpan) {
                                //                     res.push(
                                //                         <td colSpan={res_colums?.colSpan || 1} rowSpan={item[key]?.rowSpan} key={nanoid()}>
                                //                             {res_colums?.render(item[key], { ...item, index: index })}
                                //                         </td>
                                //                     )
                                //                 }
                                //             }
                                //             else {
                                //                 if (item[key]?.rowSpan) {
                                //                     res.push(
                                //                         <td rowSpan={item[key]?.rowSpan} key={nanoid()}>
                                //                             {item?.[key]}
                                //                         </td>
                                //                     )
                                //                 }
                                //             }


                                //         }

                                //     }
                                //     for (let key of extraKeys) {
                                //         let res_colums = columnsRes.find((c: any) => c.key === key);
                                //         res.push(
                                //             <td key={nanoid()}
                                //                 colSpan={res_colums?.colSpan || 1} rowSpan={res_colums?.rowSpan || 1}
                                //             >
                                //                 {res_colums?.render({ ...item, index: index })}
                                //             </td>
                                //         )

                                //     }
                                // } else {
                                for (let key in item) {
                                    let res_colums = columnsRes.find((c: any) => c.key === key);

                                    if (res_colums) {
                                        let keys = res_colums !== null && res_colums !== undefined ? [...Object?.keys(res_colums)].find((c: any) => c === 'render') : false;
                                        let keysItem = res_colums !== null && res_colums !== undefined ? [...Object?.keys(res_colums)].find((c: any) => c === 'renderItem') : false;

                                        if (!keys && !keysItem) {
                                            res.push(
                                                <td key={nanoid()}>
                                                    {item?.[key]}
                                                </td>
                                            )

                                        }
                                        else if (keys) {
                                            if (res_colums?.condition_role) {
                                                if (res_colums?.condition == key) {
                                                    res.push(
                                                        <td colSpan={res_colums?.colSpan || 1} rowSpan={res_colums?.rowSpan || 1} key={nanoid()}>
                                                            {res_colums?.render(item[key], { ...item, index: index })}
                                                        </td>
                                                    )
                                                }
                                            } else {
                                                res.push(
                                                    <td colSpan={res_colums?.colSpan || 1} rowSpan={res_colums?.rowSpan || 1} key={nanoid()}>
                                                        {res_colums?.render(item[key], { ...item, index: index })}
                                                    </td>
                                                )
                                            }
                                        }
                                        else if (keysItem) {
                                            if (res_colums?.condition_role) {
                                                if (res_colums?.condition == key) {
                                                    res.push(
                                                        <>
                                                            {res_colums?.renderItem(item[key], { ...item, index: index })}
                                                        </>
                                                    )
                                                }
                                            } else {
                                                res.push(
                                                    <>
                                                        {res_colums?.renderItem(item[key], { ...item, index: index })}
                                                    </>
                                                )
                                            }
                                        }
                                        else {
                                            res.push(
                                                <td key={nanoid()}>
                                                    {item?.[key]}
                                                </td>
                                            )
                                        }


                                    }

                                }
                                for (let key of extraKeys) {
                                    let res_colums = columnsRes.find((c: any) => c.key === key);
                                    let keysItem = res_colums !== null && res_colums !== undefined ? [...Object?.keys(res_colums)].find((c: any) => c === 'renderItem') : false;
                                    if (!keysItem) {
                                        if (res_colums?.condition_role) {
                                            if (res_colums?.condition == key) {
                                                res.push(
                                                    <td key={nanoid()}
                                                        colSpan={res_colums?.colSpan || 1} rowSpan={res_colums?.rowSpan || 1}
                                                    >
                                                        {res_colums?.render({ ...item, index: index })}
                                                    </td>
                                                )
                                            }
                                        } else {

                                            res.push(
                                                <td key={nanoid()}
                                                    colSpan={res_colums?.colSpan || 1} rowSpan={res_colums?.rowSpan || 1}
                                                >
                                                    {res_colums?.render({ ...item, index: index })}
                                                </td>
                                            )
                                        }

                                    } else {
                                        if (res_colums?.condition_role) {
                                            if (res_colums?.condition == key) {
                                                res.push(
                                                    <>
                                                        {res_colums?.renderItem(item, { ...item, index: index })}
                                                    </>
                                                )
                                            }
                                        } else {
                                            res.push(
                                                <>
                                                    {res_colums?.renderItem(item, { ...item, index: index })}
                                                </>
                                            )
                                        }
                                    }

                                }
                                // }
                                return (
                                    <tr

                                        onClick={() => {
                                            trClick(item)
                                        }}
                                        className={`${trConditionClassFunction(item)} hover-table`}
                                        // className={item?.id === Number(draggedId) ? 'backdrop-blur-2xl  bg-transparent' : ''}
                                        key={nanoid()}
                                    // draggable="true"
                                    // onDragStart={(e) => handleDragStart(e, item.id)}
                                    // onDragOver={handleDragOver}
                                    // onDrop={(e) => handleDrop(e, item.id)}
                                    >

                                        {/* <td className="p-[16px] flex items-center gap-[10px]">
                                            <span>{index + 1}</span>
                                            {
                                                checkbox ?
                                                    <span>
                                                        <Checkbox key={nanoid()} checked={checkData?.find((item__: any) => item__.id == item.id)} onChange={() => {
                                                            let resultCheck = checkFun(item);
                                                            setCheckData(resultCheck)
                                                            checkboxResult(resultCheck)
                                                        }} />
                                                    </span> : ''
                                            }
                                        </td> */}
                                        {res}
                                        {
                                            (editRole || deleteRole || extraButtonRole) &&
                                            <td className=" h-100 ">
                                                <div className="d-flex gap-2 justify-content-end ">
                                                    {
                                                        extraButton(item)
                                                    }
                                                    {
                                                        (showRole) &&
                                                        <button className='btn btn-primary btn-sm'

                                                            onClick={() => {
                                                                (showFunction(item))
                                                                // path(`${pathname}/edit/${item?.id}`)
                                                            }}>
                                                            {showIcon}
                                                        </button>
                                                    }
                                                    {
                                                        editRole ?
                                                            localEdit ?
                                                                <ButtonLink className='btn btn-primary btn-sm'
                                                                    to={`${pathname}/edit/${item?.id}`} onClick={() => {
                                                                        dispatch(isFindFunction(item))
                                                                        // path(`${pathname}/edit/${item?.id}`)
                                                                    }}>
                                                                    <AiFillEdit />
                                                                </ButtonLink> : <Button onClick={() => {
                                                                    // dispatch(isFindFunction(item))
                                                                    localEditFunction(item)

                                                                }} className='btn btn-primary btn-sm'
                                                                >
                                                                    <AiFillEdit />
                                                                </Button> : ''
                                                    }
                                                    {
                                                        deleteRole &&
                                                        <Button type='button' className='btn btn-sm btn-danger'
                                                            onClick={() => {
                                                                Swal.fire({
                                                                    title: "Ma'lumotni o'chirasizmi?",
                                                                    showDenyButton: true,
                                                                    showCancelButton: true,
                                                                    confirmButtonText: 'Ha',
                                                                    denyButtonText: `Yo'q`,
                                                                }).then((result) => {
                                                                    if (result.isConfirmed) {
                                                                        if (localDelete) {
                                                                            Swal.fire({
                                                                                position: 'top-end',
                                                                                icon: 'success',
                                                                                title: "Malumot o'chirildi",
                                                                                showConfirmButton: false,
                                                                                timer: 2500
                                                                            })
                                                                            Toast.fire("Malumot o'chirildi", '', 'success')
                                                                            if (localFunction) {
                                                                                deleteLocalFunction(item?.id, item)
                                                                            } else {
                                                                                dispatch(deletedispatchFunction(item?.id))
                                                                            }
                                                                        } else {
                                                                            dispatch(deletedispatchFunction({ id: item?.id }))
                                                                        }
                                                                    }
                                                                })
                                                            }}>
                                                            <MdDeleteForever />
                                                        </Button>
                                                    }
                                                </div>
                                            </td>
                                        }
                                    </tr>
                                )
                            }
                            )}
                    {extraTrFunction()}

                </tbody>
            </table>

        </div >
    )
})

export default React.memo(Table)