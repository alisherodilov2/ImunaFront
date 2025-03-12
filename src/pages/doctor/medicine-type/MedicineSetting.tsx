import React, { useEffect, useRef, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { read, utils, writeFileXLSX } from 'xlsx'

import { NumericFormat, PatternFormat } from 'react-number-format';

import axios from 'axios';
import { MdDeleteForever } from 'react-icons/md';
import Swal from 'sweetalert2';
import { json } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';
import { ReducerType } from '../../../interface/interface';
import { AppDispatch } from '../../../service/store/store';
import { isComplaintTarget, isMedicineTypeAdd, isMedicineTypeDefaultApi, isMedicineTypeEdit } from '../../../service/reducer/MedicineTypeReducer';
import { queryObj } from '../../../componets/api/Query';
import Loader from '../../../componets/api/Loader';
import Input from '../../../componets/inputs/Input';
import { AiFillEdit } from 'react-icons/ai';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    timer: 2000,
    showConfirmButton: false,
    timerProgressBar: true
})

// import { isAddMedicineType, isEditMedicineType } from '../../service/reducer/MedicineTypeReducer';
const MedicineSetting = ({ data, modal, setModal, setData = function () { }, extraFun = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean, extraFun?: any }) => {
    const { findData } = useSelector((state: ReducerType) => state.MenuReducer)
    const { isLoading, sendLoading, isSuccessApi, hasError, complaintTarget } = useSelector((state: ReducerType) => state.MedicineTypeReducer)
    const dispatch = useDispatch<AppDispatch>()
    const schema = yup
        .object()
        .shape({
            name: yup.string().required("Shikoyat nomini kiriting!"),
            // floor: yup.string().required("Bo'lim qavati kiriting!"),
            // main_room: yup.string().required("Asosiy xona kiriting!"),
            // letter: yup.string().required("Harf kiriting!"),

        })
        .required();
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            ...data
        }

    });
    const [status, setStatus] = useState({
        is_certificate: false,
        probirka: false
    });
    const [sendLoad, setSendLoad] = useState(false);
    const [item, setItem] = useState({} as any)
    const [dataResult, setDataResult] = useState([] as any)
    useEffect(() => {
        setDataResult(() => data.data)
    }, [])
    const toggle = () => {
        setModal(!modal)
        setStatus(() => {
            return {
                is_certificate: false,
                probirka: false
            }
        })
        let s = getValues(), resetObj = {};
        for (let key in getValues()) {
            resetObj = {
                ...resetObj, [key]: ''
            }
        }
        setMedicineTypeValue(() => [])
        setData(() => { })
    };
    const [medicineTypeValue, setMedicineTypeValue] = useState<any>([])
    const send = async (e: any) => {
        try {
            e.preventDefault();
            setSendLoad(() => true)
            let formdata = new FormData()
            for (let key in item) {
                formdata.append(key, item[key])
            }
            formdata.append('medicine_type_id', `${data?.id}`)

            if (item?.id > 0) {
                let res = await axios.post(`/medicine-type/item/${item?.id}`, formdata)
                const { result } = res.data
                setDataResult((prev: any) => prev.map((item2: any, index: number) => {
                    if (item2?.id === result?.id) {
                        return result
                    }
                    return item2
                }))
                Toast.fire("Ma'lumot tahrirlandi!", '', 'success')
            } else {
                let res = await axios.post(`/medicine-type/item`, formdata)
                const { result } = res.data
                setDataResult((prev: any) => [...prev, result])
                Toast.fire("Ma'lumot qo'shildi!", '', 'success')
            }
            for (let key in item) {
                setItem((prev: any) => {
                    return {
                        ...prev,
                        [key]: ''
                    }
                })
            }
        } catch (error) {
            Toast.fire("Ma'lumot kirishda xatolik!", '', 'error')

        }
        finally {
            setSendLoad(() => false)
        }
    }
    const itemDelete = async (id: any) => {
        try {
            setSendLoad(() => true)
            let res = await axios.delete(`/medicine-type/item/${id}`)
            const { result } = res.data
            setDataResult((prev: any) => prev.filter((item2: any, index: number) => item2?.id !== id))
            Toast.fire("Ma'lumot o'chirildi!", '', 'success')
        } catch (error) {
            Toast.fire("Ma'lumot kirishda xatolik!", '', 'error')
        }
        finally {
            setSendLoad(() => false)
        }
    }
    const itemExcel = async (data: any) => {
        try {
            setSendLoad(() => true)
            let formdata = new FormData()
            formdata.append('dataExcel', JSON.stringify(data))
            let res = await axios.post(`/medicine-type/item-excel`, formdata)
            const { result } = res.data
            setDataResult((prev: any) => [...prev, ...result])
            Toast.fire("Ma'lumot yuklandi!", '', 'success')

        } catch (error) {
            Toast.fire("Ma'lumot kirishda xatolik!", '', 'error')
        }
        finally {
            setSendLoad(() => false)
        }
    }


    const cardRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        if (cardRef.current) {
            // Scroll to the bottom of the card
            cardRef.current.scrollTo({
                top: cardRef.current.scrollHeight - cardRef.current.clientHeight,
                behavior: 'smooth', // Enables smooth scrolling
            });
        }
    };
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
                    name: item?.at(1),
                    type: item?.at(2),
                    day: item?.at(3),
                    many_day: item?.at(4) ?? '-',
                    qty: item?.at(5) ?? '-',
                    comment: item?.at(6) ?? '-',
                    medicine_type_id: data?.id
                }
            })
            itemExcel(resultData)
            // dispatch(isServiceAddExcelFile({ dataExcel: JSON.stringify(resultData) }))
            e.target.value = '';
        };

        reader.readAsArrayBuffer(file);
    }
    return (
        <>
            <Loader loading={sendLoading || sendLoad} />
            <Modal
                fullscreen
                centered={true} isOpen={modal} toggle={toggle} role='dialog' size='lg' backdrop="static" keyboard={false}>
                <div className="size_16">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalCenterTitle">Dorilar</h5>
                        <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body p-0 px-4">
                        <form onSubmit={send} className='row' >
                            <div className="col-3 mb-1">
                                <label className="form-label">Dori nomi</label>
                                <input className='form-control' type="text" placeholder="Dori nomi"
                                    name='name'
                                    value={item?.name}
                                    onChange={(e: any) => {
                                        setItem({ ...item, [e.target.name]: e.target.value })
                                    }}
                                    required
                                />

                            </div>
                            <div className="col-2 mb-1">
                                <label className="form-label">Qabul qilinishi</label>
                                <input className='form-control' type="text" placeholder="Dori nomi"

                                    name='type'
                                    value={item?.type}
                                    onChange={(e: any) => {
                                        setItem({ ...item, [e.target.name]: e.target.value })
                                    }}
                                    required
                                />

                            </div>
                            <div className="col-1 mb-1">
                                <label className="form-label">Kun</label>
                                <input className='form-control' type="text" placeholder="Dori nomi"
                                    name='day'
                                    value={item?.day}
                                    onChange={(e: any) => {
                                        setItem({ ...item, [e.target.name]: e.target.value })
                                    }}
                                    required
                                />

                            </div>
                            <div className="col-1 mb-1">
                                <label className="form-label">Mahal</label>
                                <input className='form-control' type="text" placeholder="Dori nomi"
                                    name='many_day'
                                    value={item?.many_day}
                                    onChange={(e: any) => {
                                        setItem({ ...item, [e.target.name]: e.target.value })
                                    }}
                                    required
                                />

                            </div>
                            <div className="col-1 mb-1">
                                <label className="form-label">Soni</label>
                                <input className='form-control' type="text" placeholder="Dori nomi"
                                    name='qty'
                                    value={item?.qty}
                                    onChange={(e: any) => {
                                        setItem({ ...item, [e.target.name]: e.target.value })
                                    }}
                                    required
                                />

                            </div>
                            <div className="col-4 mb-1">
                                <label className="form-label">Izoh</label>
                                <div className="input-group">
                                    <input className='form-control' type="text" placeholder="Dori nomi"
                                        name='comment'
                                        value={item?.comment}
                                        onChange={(e: any) => {
                                            setItem({ ...item, [e.target.name]: e.target.value })
                                        }}
                                        required
                                    />
                                    <button
                                        className="btn btn-primary" data-bs-dismiss="modal">
                                        {
                                            item?.id ? 'O\'zgartirish' : 'Qo\'shish'
                                        }
                                    </button>
                                    <button className="btn btn-info fileUpload_" type="button" onClick={() => {
                                    }}>
                                        <input type="file" id="fileUpload" name="fileUpload"
                                            // ref={fileInputRef}
                                            onChange={handleFile} accept=".xlsx, .xls, .csv" />
                                        import</button>


                                </div>
                            </div>

                        </form>
                        <div style={{
                            height: `${window.innerHeight / 1.6}px`,
                            overflow: 'auto'
                        }}>
                            <table className='table table-bordered'


                            >
                                <thead className='sticky-top blur'>
                                    <tr>
                                        <th>Dori nomi</th>
                                        <th>Qabul qilinishi</th>
                                        <th>Kun</th>
                                        <th>Mahal</th>
                                        <th>Soni</th>
                                        <th>Izoh</th>
                                        <th>Amallar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        dataResult?.map((res: any, index: number) => (
                                            <tr key={index}>
                                                <td>{res?.name}</td>
                                                <td>{res?.type}</td>
                                                <td>{res?.day}</td>
                                                <td>{res?.many_day}</td>
                                                <td>{res?.qty}</td>
                                                <td>{res?.comment}</td>
                                                <td className='d-flex justify-content-end gap-2'>
                                                    <button className='btn btn-primary btn-sm'
                                                        onClick={() => {
                                                            setItem(() => res)
                                                        }}
                                                    >
                                                        <AiFillEdit />
                                                    </button>
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
                                                                    itemDelete(res?.id);
                                                                }
                                                            })
                                                        }}
                                                    >
                                                        <MdDeleteForever />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }

                                </tbody>
                            </table>
                        </div>

                        <div
                            ref={cardRef}
                            style={{
                                maxHeight: `${window.innerHeight / 2.2}px`,
                                overflowY: 'auto',
                                overflowX: 'hidden',
                                padding: '0.5rem 0.5rem 0.5rem 0.5rem',
                                border: '1px solid #dee2e6',
                                marginTop: '0.5rem',
                                display: medicineTypeValue?.length > 0 ? 'block' : 'none'
                            }}>

                            {
                                medicineTypeValue?.map((item: any, i: number) => {
                                    return (
                                        <div className="row d-relative my-2" key={i}>
                                            <button className="d-absolute btn btn-sm btn-danger"
                                                type='button'
                                                onClick={() => {
                                                    Swal.fire({
                                                        title: "Ma'lumotni o'chirasizmi?",
                                                        showDenyButton: true,
                                                        showCancelButton: true,
                                                        confirmButtonText: 'Ha',
                                                        denyButtonText: `Yo'q`,
                                                    }).then((result: any) => {
                                                        if (result.isConfirmed) {
                                                            setMedicineTypeValue(medicineTypeValue?.filter((_: any, index: number) => _.id !== item?.id))
                                                            Swal.fire({
                                                                position: 'top-end',
                                                                icon: 'success',
                                                                title: "Malumot o'chirildi",
                                                                showConfirmButton: false,
                                                                timer: 2500
                                                            })
                                                        }
                                                    })
                                                }}

                                            >
                                                <MdDeleteForever />
                                            </button>
                                            <div className="col-6">
                                                <label className="form-label">Xona nomeri</label>
                                                <Input type="text" value={item.room_number} placeholder="Xona nomeri" required={true} onChange={(e: any) => {
                                                    setMedicineTypeValue(medicineTypeValue?.map((_: any, index: number) => {
                                                        if (_.id == item?.id) {
                                                            return {
                                                                ..._,
                                                                room_number: e.target.value
                                                            }
                                                        }
                                                        return _
                                                    }))
                                                }}
                                                />
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label">
                                                    Xona turi</label>
                                                <Input type="text" required={true} value={item.room_type} placeholder="Xona turi"
                                                    onChange={(e: any) => {
                                                        setMedicineTypeValue(medicineTypeValue?.map((_: any, index: number) => {
                                                            if (_.id == item?.id) {
                                                                return {
                                                                    ..._,
                                                                    room_type: e.target.value
                                                                }
                                                            }
                                                            return _
                                                        }))
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                    </div>
                    {/* <div className="modal-footer">
                        <button
                            onClick={() => setEnter(() => false)}
                            className="btn btn-primary" data-bs-dismiss="modal">
                            Saqlash
                        </button>

                        <button type="button" className="btn btn-danger" onClick={toggle}>Ortga</button>
                    </div> */}
                </div>

            </Modal>

        </>
    )
}

export default MedicineSetting