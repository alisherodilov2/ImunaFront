import React, { useEffect, useState } from 'react'
import Content from '../../../layout/Content'
import { Navbar } from 'reactstrap'
import axios from 'axios'
import { NumericFormat } from 'react-number-format'
import Table from '../../../componets/table/Table'

const RemainingBranches = () => {
    const [data, setData] = React.useState<any>({
        data: [],
        branch: [],
        branch_id: 0
    })
    const [load, setLoad] = React.useState(false)
    const getData = async (data?: any) => {
        try {
            setData(() => { return { data: [], branch: [], branch_id: 0 } })
            setLoad(() => true)
            let res = await axios.get(`/branch/remaining-branches?branch_id=${data?.branch_id > 0 ? data?.branch_id : 0}`)
            const { result } = res.data
            setData(() => result)
            console.log(result);
        } catch (error) {

        } finally {
            setLoad(() => false)

        }
    }
    useEffect(() => {
        getData(data)
    }, [])
    const [search, setSearch] = useState({
        name: '',
        product_category_id: {
            label: 'Barchasi',
            value: 0
        },
    } as any)
    const filter = (data: any, serachData: any) => {
        let response = data as any;
        if (serachData?.name?.trim()?.length > 0) {
            response = response.filter((item: any) => item?.name?.toLowerCase().includes(serachData?.name?.toLowerCase()))
        }
        if (+serachData?.product_category_id?.value > 0) {
            response = response?.filter((item: any) => item?.prodcut_category
                ?.id === serachData?.product_category_id?.value)
        }
        return response

        // if (serachData?.length > 0) {
        //     return (data.filter((item: any) => (item?.name?.toString().toLowerCase().includes(serachData) || item?.phone?.toString().toLowerCase().includes(serachData)) || item?.target_adress?.toString().toLowerCase().includes(serachData) || item?.address?.toString().toLowerCase().includes(serachData)))
        // } else
        //     return (data)
    }
    return (
        <Content loading={load}>
            <Navbar />

            <div className="container-fluid flex-grow-1 container-p-y size_16 ">
                <div className="btn-group">
                    <button type="button" className={`btn btn-${data?.main_branch?.id === data?.branch_id ? 'primary' : 'secondary'}`}
                        onClick={() => {
                            getData({
                                branch_id: 0
                            })
                        }}
                    >
                        {data?.main_branch
                            ?.name}
                    </button>
                    {data?.branch?.branch_items
                        ?.map((item: any) => {
                            return (
                                <button type="button"
                                    onClick={() => {
                                        getData({
                                            branch_id: item?.target_branch?.id
                                        })
                                    }}
                                    className={`btn btn-${item?.target_branch?.id === +data?.branch_id ? 'primary' : 'secondary'}`} key={item.id}>
                                    {item?.target_branch
                                        ?.name}
                                </button>
                            )
                        })}
                </div>

                <div className="card" style={{
                    height: `${window.innerHeight / 1.7}px`,
                    overflow: 'auto'
                }}>
                    <Table

                        paginationRole={false}

                        isLoading={load}
                        isSuccess={true}
                        reloadData={true}
                        reloadDataFunction={() => {
                            getData({
                                branch_id: data?.branch_id
                            })
                        }}
                        top={100}
                        scrollRole={true}





                        extraKeys={['muddat_status', 'alert_min_qty_']}
                        columns={[
                            {
                                title: '№',
                                key: 'id',
                                render: (value: any, data: any) => {
                                    return <div key={data.index} className='d-flex  align-items-center gap-1'>

                                        {data?.index + 1}
                                    </div>
                                }
                            },
                            {
                                title: 'Nomi',
                                key: 'name',
                                renderItem: (value: any, data: any) => {
                                    return <td
                                        onClick={() => {
                                            // show(data.id)
                                        }}
                                    >
                                        {value}
                                    </td>
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
                                title: 'Kategoriya',
                                key: 'prodcut_category',
                                render: (value: any, data: any) => {
                                    return <>
                                        {value?.name}
                                    </>
                                }
                            },

                            {
                                title: 'Sonı ',
                                key: 'qty',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value} />
                                }
                            },
                            {
                                title: 'Qoldi ',
                                key: 'use_qty',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={data.qty - value} />
                                }
                            },

                            {
                                title: 'Saqlash muudati ',
                                key: 'expiration_day',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value} />
                                }
                            },
                            {
                                title: 'Ogohlatirish muudati ',
                                key: 'alert_dedline_day',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value} />
                                }
                            },
                            {
                                title: 'muddat status ',
                                key: 'muddat_status',
                                render: (value: any, data: any) => {
                                    return <button className="btn btn-danger"
                                        onClick={() => {
                                            // show(value.id, 'danger')
                                        }}
                                    >
                                        <NumericFormat displayType="text"
                                            thousandSeparator
                                            decimalScale={2}
                                            value={value?.danger_qty} />
                                    </button>
                                }
                            },
                            {
                                title: 'Minumum ',
                                key: 'alert_min_qty_',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.alert_min_qty} />
                                }
                            },


                        ]}
                        dataSource={
                            filter(data?.data, search)
                        }
                    />
                </div>
            </div>
        </Content>



    )
}

export default RemainingBranches
