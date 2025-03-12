import { Modal, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import Table from "../../componets/table/Table";
import { NumericFormat } from "react-number-format";
import { useState } from "react";
import axios from "axios";
import Loader from "../../componets/api/Loader";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../service/store/store";
import { isEditMaster } from "../../service/reducer/MasterReducer";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import classnames from 'classnames';
import ErrorInput from "../../componets/inputs/ErrorInput";
import ButtonLink from "../../componets/buttons/ButtonLink";
import { AiFillEdit } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";

export const OrderShow = ({ data, modal, setModal, setData = function () { }, resetItem = false }: { setData?: any, data?: any, modal?: boolean; setModal?: any, resetItem?: boolean }) => {

    const schema = yup
        .object()
        .shape({
            price: yup.string().required("summa kiriting!"),
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

    const dispatch = useDispatch<AppDispatch>()

    const [load, setLoad] = useState(false)
    const masterPay = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.get('/master-pay/' + id)
            const { result } = res.data
            console.log(result);
            dispatch(isEditMaster(result.master))
            setData(() => {
                return {
                    ...data,
                    order: data?.order?.map((item: any) => item.id == result.order.id ? result.order : item)
                }
            })
            setModal(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
        }
    }
    const [activeTab, setActiveTab] = useState('1');

    const toggleTab = (tab: any) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    const [modal2, setModal2] = useState(false)
    const [item, setItem] = useState({ id: false } as any)
    const toggle2 = () => {
        setModal2(!modal2)

    };
    const toggle = () => {
        setModal(!modal)
        setModal2(!modal)
        setActiveTab(()=>'1')
    };
    const add = async (e: any) => {
        try {
            setLoad(() => true)
            let res = await axios.post('/penalty-amount', {
                price: e.price,
                master_id: e.master_id,
                order_id: e.order_id
            })
            const { result } = res.data
            console.log(result);
            dispatch(isEditMaster(result.master))
            setData(() => {
                return {
                    ...data,
                    order: data?.order?.map((item: any) => item.id == result.order.id ? result.order : item),
                    penalty_amount: [
                        ...data?.penalty_amount,
                        result.data
                    ]
                }
            })
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }
            reset(
                resetObj
            )
            setModal(() => true)

        } catch (error) {

        } finally {
            setLoad(() => false)
            setModal2(() => false)
            toggleTab('2')
        }
    }
    const edit = async (e: any) => {
        try {
            setLoad(() => true)
            let res = await axios.put('/penalty-amount/' + item.id, {
                ...e
            })
            const { result } = res.data
            console.log(result);
            dispatch(isEditMaster(result.master))
            setData(() => {
                return {
                    ...data,
                    order: data?.order?.map((item: any) => item.id == result.order.id ? result.order : item),
                    penalty_amount: data?.penalty_amount?.map((item: any) => item.id == result.data.id ? result.data : item),
                }
            })
            let s = getValues(), resetObj = {};
            for (let key in getValues()) {
                resetObj = {
                    ...resetObj, [key]: ''
                }
            }
            reset(
                resetObj
            )
            setModal(() => true)
        } catch (error) {

        } finally {
            setLoad(() => false)
            setModal2(() => false)

        }
    }
    const penaltydelete = async (id: any) => {
        try {
            setLoad(() => true)
            let res = await axios.delete('/penalty-amount/' + id)
            const { result } = res.data
            console.log(result);
            dispatch(isEditMaster(result.master))
            setData(() => {
                return {
                    ...data,
                    order: data?.order,
                    penalty_amount: data?.penalty_amount?.filter((item: any) => item.id != result?.data),
                }
            })
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: "Malumot o'chirildi",
                showConfirmButton: false,
                timer: 2500
            })

        } catch (error) {

        } finally {
            setLoad(() => false)

        }
    }
    const send = (e: any) => {
        // if (id?.toString()?.length ?? 0 > 0) {
        //   dispatch(isProductEdit({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file, id: id }))
        // } else {
        //   dispatch(isProductAdd({ query: query({ ...data, product_value: JSON.stringify(product_values) }, ['photo']), file: file }))
        // }
        if (item?.id) {
            // dispatch(isCategoryEdit({ query: query({ ...data, ...e }), id: data?.id }))
            /////// dispatch(isCostEdit(data)) 
            edit(e)
        } else {
            add(e)
            // dispatch(isCategoryAdd({ query: query({ ...data, ...e }) }))
        }
    }
    return (
        <>
            <Modal centered={true} isOpen={modal} toggle={toggle} role='dialog' size='xl' backdrop="static" keyboard={false}>
                <div>
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalCenterTitle">
                            {
                                activeTab == '1' ? "Buyurtmalar" : "Jarima"
                            }
                        </h5>
                        <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <Nav tabs >
                            <NavItem>
                                <NavLink
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                    className={classnames({ active: activeTab === '2' })}
                                    onClick={() => toggleTab('1')}
                                >
                                    Buyurtmalar
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                    className={classnames({ active: activeTab === '1' })}
                                    onClick={() => {
                                        toggleTab('2')
                                    }}
                                >
                                    Jarimalar
                                </NavLink>
                            </NavItem>

                        </Nav>
                        <TabContent activeTab={activeTab} className='p-0'>
                            <TabPane tabId="1" >
                                <div className="card" style={{
                                    height: `${window.innerHeight / 2}px`,
                                    overflow: 'auto'
                                }}>
                                    <Table
                                        
                                        paginationRole={false}
                                        localEditFunction={(e: any) => {
                                            setModal(true)
                                        }}
                                        isLoading={false}
                                        isSuccess={true}
                                        reloadData={true}
                                        top={100}
                                        scrollRole={true}
                                        extraKeys={['Shtraf', 'jarayon']}
                                        columns={[
                                            {
                                                title: '№',
                                                key: 'id',
                                                render: (value: any, data: any) => {
                                                    return <div key={data.index} className='d-flex  align-items-center gap-1'>
                                                        <span>
                                                            {data?.index + 1}
                                                        </span>
                                                    </div>
                                                }
                                            },
                                            {
                                                title: 'Mijoz',
                                                key: 'full_name',
                                            },
                                            {
                                                title: 'Telefon',
                                                key: 'phone',
                                            },
                                            {
                                                title: 'soni',
                                                key: 'qty',
                                                render: (e: any, item: any) => {
                                                    return <>
                                                        <div className="btn-group btn-primary ">
                                                            <div
                                                                className="btn text-white fw-bold  gap-1  d-flex align-items-center">
                                                                <span className='badge bg-white text-primary'>
                                                                    <NumericFormat displayType="text"
                                                                        thousandSeparator
                                                                        decimalScale={2}

                                                                        value={e|| 0} /> dona
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </>

                                                    // `${e}/${item?.price}/${item.master_salary}`
                                                }
                                            },
                                          
                                            {
                                                title: 'Xizmat haqqi/Jami',
                                                key: 'master_salary',
                                                render: (e: any, item: any) => {
                                                    return <>
                                                        <div className="btn-group btn-primary ">
                                                            <div
                                                                className="btn text-white fw-bold  gap-1  d-flex align-items-center">
                                                                <span className='badge bg-white text-primary'>
                                                                    <NumericFormat displayType="text"
                                                                        thousandSeparator
                                                                        decimalScale={2}

                                                                        value={e ||0} /> $
                                                                </span>
                                                            </div>
                                                            <div
                                                                className="btn text-white fw-bold  gap-1  d-flex align-items-center">
                                                                <span className='badge bg-white text-primary'>
                                                                    <NumericFormat displayType="text"
                                                                        thousandSeparator
                                                                        decimalScale={2}

                                                                        value={(e * item?.qty)|| 0} /> $
                                                                </span>
                                                            </div>


                                                        </div>
                                                    </>

                                                    // `${e}/${item?.price}/${item.master_salary}`
                                                }
                                            },

                                            {
                                                title: 'usta',
                                                key: 'master',
                                                render: (e: any, item: any) => {
                                                    return e?.id ? <>
                                                    {e?.full_name} <br />
                                                    @{e?.username}
                                                    </> : '-'
                                                }
                                            },
                                            {
                                                title: 'Izoh',
                                                key: 'comment',
                                                render: (e: any, item: any) => {
                                                    return <>
                                                    <p className='comment_ pointer'
                                                    onClick={()=>{
                                                        Swal.fire({
                                                            title: "Batafsil",
                                                            text:e,
                                                            // icon: "address",
                                                            confirmButtonText:'Ortga',
                                                            showCancelButton: false,
                                                            showCloseButton: false,
                
                                                          });
                                                    }}
                                                    
                                                    >
                                                      {e?.slice(0,20)}...  
                                                    </p>
                                                    </>
                                                }
                                            },
                                            {
                                                title: "O'rnatish vaqti",
                                                key: 'installation_time',

                                            },
                                            {
                                                title: 'Jarima',
                                                key: 'Shtraf',
                                                render: (e: any, item: any) => {
                                                    return <button onClick={() => {
                                                        let s = getValues(), resetObj = {};
                                                        for (let key in getValues()) {
                                                            resetObj = {
                                                                ...resetObj, [key]: ''
                                                            }
                                                        }
                                                        reset(
                                                            resetObj
                                                        )

                                                        setValue('order_id', e.id, {
                                                            shouldValidate: true,
                                                        });
                                                        setValue('master_id', e.master_id, {
                                                            shouldValidate: true,
                                                        });
                                                        setItem(() => {
                                                            return {
                                                                id: false
                                                            }
                                                        })
                                                        setModal2(() => true)
                                                    }} className="btn btn-danger btn-sm">kirtish</button>
                                                }
                                            },
                                            {
                                                title: 'jarayon',
                                                key: 'jarayon',
                                                render: (e: any, item: any) => {
                                                    if (e?.master_salary - e.master_salary_pay == 0) {
                                                        return <span className="badge bg-success">Yakunlandi</span>
                                                    }
                                                    return <button
                                                        onClick={() => {
                                                            // dispatch(isOrderEdit(
                                                            //     {
                                                            //         id: e?.id,
                                                            //         query:  query({ 
                                                            //             is_check: '1',
                                                            //             status:'is_pay',
                                                            //             master_salary_pay:e.master_salary
                                                            //         })
                                                            //     }
                                                            // ))
                                                            masterPay(e.id)
                                                        }}
                                                        className='btn btn-danger btn-sm'>
                                                        To'lash
                                                    </button>
                                                }
                                            },

                                        ]}
                                        dataSource={
                                            data?.order
                                        }
                                    />
                                </div>
                                <br />
                                {/* <div className="d-flex">
                                    <p>Jami buyurtma soni: {data.length}</p>
                                    <p>Balans: </p>
                                    <p>Topilgan summa: </p>
                                    <p>Shtraf: </p>
                                </div> */}
                            </TabPane>
                            <TabPane tabId="2" >
                                <div className="card" style={{
                                    height: `${window.innerHeight / 2}px`,
                                    overflow: 'auto'
                                }}>
                                    <Table
                                       
                                        paginationRole={false}
                                        localEditFunction={(e: any) => {
                                            setModal(true)
                                        }}
                                        isLoading={false}
                                        isSuccess={true}
                                        reloadData={true}
                                      
                                        top={100}
                                        scrollRole={true}
                                        extraKeys={['order_idd', "master_id_", "price_", 'Holat']}
                                        columns={[
                                            {
                                                title: '№',
                                                key: 'id',
                                                render: (value: any, data: any) => {
                                                    return <div key={data.index} className='d-flex  align-items-center gap-1'>
                                                        <span>
                                                            {data?.index + 1}
                                                        </span>
                                                    </div>
                                                }
                                            },
                                            {
                                                title: 'Buyurtma id',
                                                key: 'order_idd',
                                                render: (e: any, item: any) => {
                                                    return e?.order_id
                                                }
                                            },

                                            {
                                                title: 'usta',
                                                key: 'master_id_',
                                                // render: (e: any, item: any) => {
                                                //     return e?.master?.full_name
                                                // }
                                                render: (e: any, item: any) => {
                                                    return e?.master?.id ? <>
                                                    {e?.master?.full_name} <br />
                                                    @{e?.master?.username}
                                                    </> : '-'
                                                }
                                            },
                                            {
                                                title: 'Jarima',
                                                key: 'price_',
                                                render: (e: any, item: any) => {
                                                    return <>
                                                        <div className="btn-group btn-primary ">
                                                            <div
                                                                className="btn text-white fw-bold  gap-1  d-flex align-items-center">
                                                                <span className='badge bg-white text-danger'>
                                                                    <NumericFormat displayType="text"
                                                                        thousandSeparator
                                                                        decimalScale={2}

                                                                        value={e.price ?? 0} /> $
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </>

                                                    // `${e}/${item?.price}/${item.master_salary}`
                                                }
                                            },
                                            {
                                                title: 'Holat',
                                                key: 'Holat',
                                                render: (e: any, item: any) => {
                                                    return <div className="d-flex gap">
                                                        <button className='btn btn-info btn-sm'
                                                            onClick={() => {
                                                                // dispatch(isFindFunction(item))
                                                                // path(`${pathname}/edit/${item?.id}`)
                                                                setItem(() => {
                                                                    return {
                                                                        id: e.id,

                                                                    }
                                                                })
                                                                setValue('order_id', e.id, {
                                                                    shouldValidate: true,
                                                                });
                                                                setValue('master_id', e.master_id, {
                                                                    shouldValidate: true,
                                                                });
                                                                setValue('price', e.price, {
                                                                    shouldValidate: true,
                                                                });
                                                                setModal2(() => true)
                                                            }}>
                                                            <AiFillEdit />
                                                        </button>
                                                        <button type='button' className='btn btn-sm btn-danger'
                                                            onClick={() => {
                                                                Swal.fire({
                                                                    title: "Ma'lumotni o'chirasizmi?",
                                                                    showDenyButton: true,
                                                                    showCancelButton: true,
                                                                    confirmButtonText: 'Ha',
                                                                    denyButtonText: `Yo'q`,
                                                                }).then((result: any) => {
                                                                    if (result.isConfirmed) {
                                                                        penaltydelete(e.id)

                                                                    }
                                                                })
                                                            }}>
                                                            <MdDeleteForever />
                                                        </button>
                                                    </div>

                                                    // `${e}/${item?.price}/${item.master_salary}`
                                                }
                                            },


                                        ]}
                                        dataSource={
                                            data?.penalty_amount || []
                                        }
                                    />
                                </div>
                            </TabPane>
                        </TabContent>

                    </div>
                </div>
            </Modal>
            <Loader loading={load} />
            <Modal centered={true} isOpen={modal2} toggle={toggle2} role='dialog' size='lg'>
                <div className="modal-header">
                    <h5 className="modal-title text-danger" id="modalCenterTitle">Jarima kiritsh</h5>
                    <button onClick={toggle2} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <form onSubmit={handleSubmit(send)} className="size_16">
                    <div className="modal-body">

                        <div className=" mb-1">
                            <label className="form-label">Summa</label>
                            <input type="hidden"
                                {...register('price')} name='price'

                            />
                            <NumericFormat

                                value={getValues('price')}
                                // prefix="Uzs"
                                thousandSeparator
                                onChange={(e: any) => {
                                    setValue('price', e.target.value.replace(/,/g, ''), {
                                        shouldValidate: true,
                                    });

                                }}
                                className='form-control'
                            />
                            <ErrorInput>
                                {errors.price?.message?.toString()}
                            </ErrorInput>

                        </div>

                    </div>
                    <div className="modal-footer">
                        <button
                            className="btn btn-primary" data-bs-dismiss="modal">
                            Saqlash
                        </button>
                        <button type="button" className="btn btn-danger" onClick={toggle2}>Ortga</button>
                    </div>
                </form>
            </Modal>
        </>

    )
}