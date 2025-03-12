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
import { useNavigate, useParams } from 'react-router-dom'

const LaboratoryTemplateAdd = () => {
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
        let res = [...data].sort((a: any, b: any) => b.id - a.id);
        return res?.map((item: any) => {
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
    const getShow = async (id: any) => {
        try {
            setLoad(true)
            let res = await axios.get('/service/template/' + id)
            const { result } = res.data
            setItem(() => result)
            setModal(() => true)
        } catch (error) {

        }
        finally {
            setLoad(false)
        }
    }
    const { id } = useParams()
    useEffect(() => {
        getShow(id)
    }, [])
    const toggle = () => {
        setModal(!modal)
    }
    const [load, setLoad] = useState(false)
    const path = useNavigate()
    const send = async (item: any) => {
        try {
            setLoad(true)
            const { data } = item
            let fomrdata = new FormData();
            fomrdata.append('labatoratory_template', JSON.stringify(data))
            let res = await axios.post('/service/template/' + id, fomrdata)
            const { result } = res.data
            dispatch(isEditService(result))
            path('/lab-template')
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
    return (
        <Content loading={load}>
            <Navbar />
            <div className="container-fluid flex-grow-1 py-1 size_16 ">
                <h2 className='my-2'>{item?.service?.name}</h2>
                <table className='table table-bordered'>
                    <tbody>
                        {
                            item?.data?.map((res: any, index: number) => {
                                return <tr key={index}>
                                    <td>
                                        {index > 0 ? index + 1 : '№'}
                                    </td>
                                    {/* {
                                                [
                                                    'name',
                                                    'result',
                                                    'normal',
                                                    'extra_column_1',
                                                    'extra_column_2',
                                                ]?.map((colName: any, index: number) => {
                                                    return (
                                                        <textarea
                                                            onKeyDown={(e: any) => {
                                                                let value = e.target.value
                                                                setItem(() => {
                                                                    return {
                                                                        ...item,
                                                                        data: item?.data?.map((res2: any, index: number) => res2.id == res?.id ? { ...res2, [res[colName]]: value } : res2)
                                                                    }
                                                                })
                                                            }}

                                                            className='form-control'>
                                                            {
                                                                res?.[colName]
                                                            }
                                                        </textarea>
                                                    )
                                                })
                                            } */}
                                    <td>

                                        {
                                            index > 0 ?
                                                <textarea
                                                    onKeyDown={(e: any) => {
                                                        setItem(() => {
                                                            return {
                                                                ...item,
                                                                data: item?.data?.map((res2: any) => {
                                                                    return res2.id == res?.id ? { ...res2, name: e.target.value } : res2
                                                                })
                                                            }
                                                        })
                                                    }}

                                                    id={`text_area_${index}`}
                                                    className='form-control'>
                                                    {res?.name}
                                                </textarea>
                                                :
                                                <div className="input-group">
                                                    <input type="text"

                                                        onChange={(e: any) => {
                                                            let value = e.target.value
                                                            setItem(() => {
                                                                return {
                                                                    ...item,
                                                                    data: item?.data?.map((res2: any, index: number) => res2.id == res?.id ? { ...res2, name: value } : res2)
                                                                }
                                                            })
                                                        }}

                                                        className='form-control' value={res?.name} />
                                                    <div className="input-group-text">
                                                        <input type="checkbox" className='form-check-input'
                                                            checked={res?.is_result_name == 'name'}
                                                            onChange={(e: any) => {
                                                                let value = e.target.checked
                                                                setItem(() => {
                                                                    return {
                                                                        ...item,
                                                                        data: item?.data?.map((res2: any, index: number) => res2.id == res?.id ? { ...res2, is_result_name: value ? 'name' : '' } : res2)
                                                                    }
                                                                })
                                                            }}

                                                        />
                                                    </div>
                                                </div>
                                        }

                                    </td>
                                    <td>
                                        {
                                            index > 0 ?
                                                <textarea

                                                    onChange={(e: any) => {
                                                        let value = e.target.value
                                                        setItem(() => {
                                                            return {
                                                                ...item,
                                                                data: item?.data?.map((res2: any, index: number) => res2.id == res?.id ? { ...res2, result: value } : res2)
                                                            }
                                                        })
                                                    }}

                                                    className='form-control'>
                                                    {
                                                        res?.result
                                                    }
                                                </textarea>

                                                :
                                                <div className="input-group">

                                                    <input
                                                        onChange={(e: any) => {
                                                            let value = e.target.value
                                                            setItem(() => {
                                                                return {
                                                                    ...item,
                                                                    data: item?.data?.map((res2: any, index: number) => res2.id == res?.id ? { ...res2, result: value } : res2)
                                                                }
                                                            })
                                                        }}


                                                        type="text" className='form-control' value={res?.result} />
                                                    <div className="input-group-text">
                                                        <input type="checkbox" className='form-check-input'
                                                            checked={res?.is_result_name == 'result'}
                                                            onChange={(e: any) => {
                                                                let value = e.target.checked
                                                                setItem(() => {
                                                                    return {
                                                                        ...item,
                                                                        data: item?.data?.map((res2: any, index: number) => res2.id == res?.id ? { ...res2, is_result_name: value ? 'result' : '' } : res2)
                                                                    }
                                                                })
                                                            }}

                                                        />
                                                    </div>
                                                </div>
                                        }


                                    </td>
                                    <td>
                                        {
                                            index > 0 ?
                                                <textarea
                                                    onChange={(e: any) => {
                                                        let value = e.target.value
                                                        setItem(() => {
                                                            return {
                                                                ...item,
                                                                data: item?.data?.map((res2: any, index: number) => res2.id == res?.id ? { ...res2, normal: value } : res2)
                                                            }
                                                        })
                                                    }}


                                                    className='form-control'>
                                                    {
                                                        res?.normal
                                                    }
                                                </textarea>
                                                :
                                                <div className="input-group">

                                                    <input type="text"
                                                        onChange={(e: any) => {
                                                            let value = e.target.value
                                                            setItem(() => {
                                                                return {
                                                                    ...item,
                                                                    data: item?.data?.map((res2: any, index: number) => res2.id == res?.id ? { ...res2, normal: value } : res2)
                                                                }
                                                            })
                                                        }}

                                                        className='form-control' value={res?.normal} />
                                                    <div className="input-group-text">
                                                        <input type="checkbox" className='form-check-input'
                                                            checked={res?.is_result_name == 'normal'}
                                                            onChange={(e: any) => {
                                                                let value = e.target.checked
                                                                setItem(() => {
                                                                    return {
                                                                        ...item,
                                                                        data: item?.data?.map((res2: any, index: number) => res2.id == res?.id ? { ...res2, is_result_name: value ? 'normal' : '' } : res2)
                                                                    }
                                                                })
                                                            }}

                                                        />
                                                    </div>
                                                </div>
                                        }


                                    </td>
                                    <td>
                                        {
                                            index > 0 ?

                                                <textarea


                                                    onChange={(e: any) => {
                                                        let value = e.target.value
                                                        setItem(() => {
                                                            return {
                                                                ...item,
                                                                data: item?.data?.map((res2: any, index: number) => res2.id == res?.id ? { ...res2, extra_column_1: value } : res2)
                                                            }
                                                        })
                                                    }}
                                                    className='form-control'>
                                                    {
                                                        res?.extra_column_1
                                                    }
                                                </textarea>
                                                :
                                                <div className="input-group">

                                                    <input type="text"
                                                        onChange={(e: any) => {
                                                            let value = e.target.value
                                                            setItem(() => {
                                                                return {
                                                                    ...item,
                                                                    data: item?.data?.map((res2: any, index: number) => res2.id == res?.id ? { ...res2, extra_column_1: value } : res2)
                                                                }
                                                            })
                                                        }}

                                                        className='form-control' value={res?.extra_column_1} />
                                                    <div className="input-group-text">
                                                        <input type="checkbox" className='form-check-input'
                                                            checked={res?.is_result_name == 'extra_column_1'}
                                                            onChange={(e: any) => {
                                                                let value = e.target.checked
                                                                setItem(() => {
                                                                    return {
                                                                        ...item,
                                                                        data: item?.data?.map((res2: any, index: number) => res2.id == res?.id ? { ...res2, is_result_name: value ? 'extra_column_1' : '' } : res2)
                                                                    }
                                                                })
                                                            }}

                                                        />
                                                    </div>
                                                </div>
                                        }


                                    </td>
                                    <td>
                                        {
                                            index > 0 ?

                                                <textarea
                                                    onChange={(e: any) => {
                                                        let value = e.target.value
                                                        setItem(() => {
                                                            return {
                                                                ...item,
                                                                data: item?.data?.map((res2: any, index: number) => res2.id == res?.id ? { ...res2, extra_column_2: value } : res2)
                                                            }
                                                        })
                                                    }}

                                                    className='form-control'>
                                                    {
                                                        res?.extra_column_2
                                                    }
                                                </textarea>
                                                :
                                                <div className="input-group">

                                                    <input
                                                        onChange={(e: any) => {
                                                            let value = e.target.value
                                                            setItem(() => {
                                                                return {
                                                                    ...item,
                                                                    data: item?.data?.map((res2: any, index: number) => res2.id == res?.id ? { ...res2, extra_column_2: value } : res2)
                                                                }
                                                            })
                                                        }}
    
                                                        type="text" className='form-control' value={item?.extra_column_2} />
                                                          <div className="input-group-text">
                                                        <input type="checkbox" className='form-check-input'
                                                            checked={res?.is_result_name == 'extra_column_2'}
                                                            onChange={(e: any) => {
                                                                let value = e.target.checked
                                                                setItem(() => {
                                                                    return {
                                                                        ...item,
                                                                        data: item?.data?.map((res2: any, index: number) => res2.id == res?.id ? { ...res2, is_result_name: value ? 'extra_column_2' : '' } : res2)
                                                                    }
                                                                })
                                                            }}

                                                        />
                                                    </div>
                                                </div>
                                        }

                                    </td>
                                    <td>
                                        <button type='button' className='btn btn-sm btn-danger'
                                            onClick={() => {
                                                Swal.fire({
                                                    title: "Ma'lumotni o'chirasizmi?",
                                                    showDenyButton: true,
                                                    showCancelButton: true,
                                                    confirmButtonText: 'Ha',
                                                    denyButtonText: `Yo'q`,
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        setItem((prev: any) => {
                                                            return {
                                                                ...prev,
                                                                data: prev?.data?.filter((res2: any) => res2?.id != res?.id)
                                                            }
                                                        })
                                                    }
                                                })
                                            }}>
                                            <MdDeleteForever />
                                        </button>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
                <div className="d-flex gap-2">
                    <button className='btn btn-primary d-block mr-auto' onClick={() => {
                        setItem((prev: any) => {
                            return {
                                ...prev,
                                data: [
                                    ...prev?.data,
                                    { id: nanoid(), name: '', result: '', normal: '', extra_column_1: '', extra_column_2: '' }
                                ]
                            }
                        })
                    }}>Qoshish</button>
                    <button

                        onClick={() => {
                            send(item)
                        }}
                        className="btn btn-primary" data-bs-dismiss="modal">
                        Saqlash
                    </button>
                </div>
            </div>

        </Content>
    )
}

export default LaboratoryTemplateAdd
