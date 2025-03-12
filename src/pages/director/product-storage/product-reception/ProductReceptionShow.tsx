import React, { useEffect, useRef, useState } from 'react'
// import Layout from '../layouts/Layout'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../service/store/store';
import { query } from '../../../../componets/api/Query';
import { isProductReceptionAdd, isProductReceptionEdit, isProductReceptionDefaultApi, isProductReceptionChange } from '../../../../service/reducer/ProductReceptionReducer';
import { ReducerType } from '../../../../interface/interface';
import Loader from '../../../../componets/api/Loader';
import { isFindFunction } from '../../../../service/reducer/MenuReducer';
import Input from '../../../../componets/inputs/Input';
import { NumericFormat, PatternFormat } from 'react-number-format';
import ErrorInput from '../../../../componets/inputs/ErrorInput';
import axios from 'axios';
import { MdDeleteForever } from 'react-icons/md';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { json } from 'react-router-dom';
import ProductCategoryAdd from '../product-category/ProductCategoryAdd';
import ProductAdd from '../product/ProductAdd';
import Table from '../../../../componets/table/Table';
import ReProductReceptionAdd from './ReProductReceptionAdd';
import { dateFormat } from '../../../../service/helper/day';
import { getCurrentDateTime } from '../../../../helper/dateFormat';
// import { isAddProductReception, isEditProductReception } from '../../service/reducer/ProductReceptionReducer';
const ProductReceptionShow = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {
    const { findData } = useSelector((state: ReducerType) => state.MenuReducer)
    const { productCategoryData } = useSelector((state: ReducerType) => state.ProductCategoryReducer)
    const { productData,
    } = useSelector((state: ReducerType) => state.ProductReducer)
    const [productReceptionItem, setProductReceptionItem] = useState([] as any)
    const [modal2, setModal2] = useState(false);
    const [modal3, setModal3] = useState(false);
    const { isLoading, sendLoading, isSuccessApi, hasError } = useSelector((state: ReducerType) => state.ProductReceptionReducer)
    const dispatch = useDispatch<AppDispatch>()
    const [enter, setEnter] = useState(false);
    useEffect(() => {
        // if (Object.keys(data ?? {})?.length > 0) {
        //     alert(JSON.stringify(data))
        //     for (let keys in data) {
        //         setValue(keys, data[keys], {
        //             shouldValidate: true,
        //         });
        //     }
        // }
        if (Object.keys(data ?? {})?.length > 0) {
            if (data?.product_reception_item?.length > 0) {
                setProductReceptionItem(() => data?.product_reception_item)
            }
        }
    }, [modal, data, isLoading, isSuccessApi])
    const toggle = () => {
        setModal(!modal)
        setEnter(() => false)
        setData({})
        setSelectData({
            ...selectData,
            product_id: false,
            product_category_id: false
        })
        setProductReceptionItem([])
    };
    const [productReceptionValue, setProductReceptionValue] = useState<any>([])
    const send = (e: any) => {
        // if (id?.toString()?.length ?? 0 > 0) {
        //   dispatch(isProductEdit({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file, id: id }))
        // } else {
        //   dispatch(isProductAdd({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file }))
        // }
        if (data?.id?.toString()?.length ?? 0 > 0) {
            dispatch(isProductReceptionEdit({ query: query({ ...data, ...e, product_category_id: `${e.product_category_id}`, product_id: `${e.product_id}` }), id: data?.id }))
            /////// dispatch(isCostEdit(data)) 
        } else {
            dispatch(isProductReceptionAdd({ query: query({ ...data, ...e, product_category_id: `${e.product_category_id}`, product_id: `${e.product_id}` }) }))
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
    const dataSelect = (data: any) => {
        if (data?.length > 0) {
            return data?.map((item: any) => {
                return {
                    value: item?.id, label: item?.name,
                    data: item
                }
            })
        }
        return []
    }
    const [selectData, setSelectData] = useState({
        pay_type: {
            value: 'Tolov turini tanlang',
            label: ''
        },
        customer_target: {
            value: '',
            label: ''
        },
        branch: {
            value: '',
            label: ''
        },
        status: {
            value: 'all', label: "Barchasi"
        },
        payment_type: {
            label: "To'lov turlari ",
            value: 'all'
        },
    } as any)
    const [item, setItem] = useState({} as any)
    const [load, setLoad] = useState(false)
    const deleteItem = async (id: any, parentId: any) => {
        try {
            setLoad(true)
            let res = await axios.delete(`/product-reception/item/[${id}]/${parentId}`)
            const { result } = res.data
            setProductReceptionItem(() => result?.product_reception_item)
            dispatch(isProductReceptionChange(result))
        } catch (error) {
        }
        finally {
            setLoad(false)
        }
    }
    const [checkAll, setCheckAll] = useState(false)

    const [checkData, setCheckData] = useState([] as any)
    const checkFun = (item: any) => {
        let resultCheck = checkData?.find((checkItem: any) => checkItem?.id === item?.id);
        if (resultCheck) {
            return checkData.filter((checkItem: any) => checkItem?.id !== item?.id)
        }
        return [...checkData, item]
    }
    const deleteAll = () => {
        Swal.fire({
            title: "Ma'lumotni o'chirasizmi?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Ha',
            denyButtonText: `Yo'q`,
        }).then((result: any) => {
            if (result.isConfirmed) {
                deleteItem([...new Set(checkData?.map((idAll: any) => idAll?.id))], data?.id)
                setCheckData([])
                setCheckAll(() => false)
            }
        })
        // dispatch(deletedispatchFunction(id))

    }
    return (
        <>
            <Loader loading={load} />
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='xl' backdrop="static" keyboard={false}>
                <div className="size_16">
                    <div className="modal-header">
                        <div className='d-flex align-items-center justify-content-between w-100'>
                            <h5 className="modal-title" id="modalCenterTitle">Maxsulot qabul qilish</h5>
                            <div className="d-flex gap-2">
                                {
                                    checkData?.length > 0 ?
                                        <button className="btn btn-danger " type="button" onClick={() => {
                                            deleteAll()
                                        }}>O'chirish</button> : ''
                                }
                                <button className='btn btn-primary'
                                    onClick={() => {
                                        setItem(() => {
                                            return {
                                                date: dateFormat(data?.created_at),
                                                product_reception_id: data?.id
                                            }
                                        })
                                        setModal2(true)

                                        // MdSettingsRemote
                                    }}
                                >Qoshish</button>
                            </div>
                        </div>
                        <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className="card" style={{
                            height: `${window.innerHeight / 1.7}px`,
                            overflow: 'auto'
                        }}>
                            <Table
                                allCheckId='id'
                                allCheckRoleFun={
                                    (e: any) => {
                                        return <>
                                            {" "}
                                            <input className="form-check-input" type="checkbox" onChange={(e: any) => {
                                                const target = !checkAll
                                                setCheckAll(() => target)
                                                if (target) {
                                                    setCheckData(() => productReceptionItem)
                                                } else {
                                                    setCheckData(() => [])
                                                }
                                            }} checked={checkAll} />
                                            {" "}

                                        </>
                                    }
                                }
                                paginationRole={false}
                                isLoading={false}
                                isSuccess={true}
                                top={100}
                                scrollRole={true}
                                deleteRole={true}
                                editRole={true}
                                localEditFunction={(e: any) => {
                                    setItem(() => {
                                        return {
                                            ...e,
                                            product_reception_id: data?.id
                                        }
                                    })
                                    console.log();
                                    setModal2(true)
                                }}
                                extraKeys={[
                                    'name_',
                                    'type_',
                                    'price_',
                                    'count_',
                                    'total_',
                                    'expired_',
                                    'manufacture_date_',
                                    'create_at_'
                                ]}
                                localDelete={true}
                                localFunction={true}
                                deleteLocalFunction={(e: any) => {
                                    console.log('e', e);
                                    deleteItem(e, data?.id)
                                }}
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
                                                    {data?.index + 1}
                                                </span>
                                            </div>
                                        },
                                    },
                                    {
                                        title: 'Nomi',
                                        key: 'name_',
                                        render: (value: any, data: any) => {
                                            return <>
                                                {value?.prodcut?.name}
                                            </>
                                        }
                                    },
                                    {
                                        title: 'Turi',
                                        key: 'type_',
                                        render: (value: any, data: any) => {
                                            return <>
                                                {value?.prodcut_category?.name}
                                            </>
                                        }
                                    },
                                    {
                                        title: 'Narxi',
                                        key: 'price_',
                                        render: (value: any, data: any) => {
                                            return <NumericFormat displayType="text"
                                                thousandSeparator
                                                decimalScale={2}
                                                value={value.price} />
                                        }
                                    },
                                    {
                                        title: 'Soni',
                                        key: 'count_',
                                        render: (value: any, data: any) => {
                                            return <NumericFormat displayType="text"
                                                thousandSeparator
                                                decimalScale={2}
                                                value={value.qty} />
                                        }
                                    },
                                    {
                                        title: 'Umuumiy summasi',
                                        key: 'total_',
                                        render: (value: any, data: any) => {
                                            return <NumericFormat displayType="text"
                                                thousandSeparator
                                                decimalScale={2}
                                                value={value.qty * value.price} />
                                        }
                                    },
                                    {
                                        title: 'ishlab chiqarilgan sana',
                                        key: 'expired_',
                                        render: (value: any, data: any) => {
                                            return <>
                                                {value?.manufacture_date }
                                            </>
                                        }
                                    },
                                    {
                                        title: 'eskriish sanasi',
                                        key: 'manufacture_date_',
                                        render: (value: any, data: any) => {
                                            return <>
                                                {value?.expiration_date}
                                            </>
                                        }
                                    },
                                    {
                                        title: 'Kiritilgan sana',
                                        key: 'create_at_',
                                        render: (value: any, data: any) => {
                                            return <>

                                                {getCurrentDateTime(value?.created_at)}
                                            </>
                                        }
                                    },
                                ]}
                                dataSource={
                                    productReceptionItem?.length > 0 ? productReceptionItem : data?.product_reception_item
                                }
                            />
                        </div>


                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" onClick={toggle}>Ortga</button>
                    </div>
                </div>

            </Modal>


            <ReProductReceptionAdd
                changeData={setProductReceptionItem}
                modal={modal2} setModal={setModal2}
                data={item}
            />
        </>
    )
}

export default ProductReceptionShow