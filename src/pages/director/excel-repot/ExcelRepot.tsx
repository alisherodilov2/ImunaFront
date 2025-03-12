import React, { useEffect, useState } from 'react'
import Content from '../../../layout/Content'
import Table from '../../../componets/table/Table'
import axios from 'axios'
import { NumericFormat } from 'react-number-format'
import { Input } from 'reactstrap'
import { exportToExcel } from '../../../helper/exportToExcel'

const ExcelRepot = () => {

    const [data, setData] = useState({
        data: [],
        start_date: '',
        end_date: '',
    } as any)
    const [loading, setLoading] = useState(false)
    const getData = async (data: any) => {
        try {
            setLoading(() => true)
            let res = await axios.get('/repot/excel?start_date=' + (data?.start_date ?? '') + '&end_date=' + (data?.end_date ?? ''))
            const { result } = res.data
            setData(() => result)
        } catch (error) {

        }
        finally {
            setLoading(() => false)
        }
    }
    useEffect(() => {
        getData(data)
    }, [])
    const advFun = (data: any, nav = '', key1 = 'adv_analiz__', key2 = 'analiz_adv_', title = 'analiz', item?: any) => {
        if (data?.length == 0) return []
        let result = [] as any;
        if (nav == 'nav') {
            for (let key of data) {
                result.push({
                    title: `${key.name}  ${title}`,
                    key: key1 + key?.id,
                    render: (value: any, data: any) => {
                        return <NumericFormat displayType="text"
                            thousandSeparator
                            decimalScale={2}
                            value={value?.[key2 + key?.id] ?? 0} />
                    }
                },)
            }
            return result
        }
        if (nav == 'excel') {
            let res = {} as any
            for (let key of data) {
                // result.push({
                //     title: `${key.name}  ${title}`,
                //     key: key1 + key?.id,
                //     render: (value: any, data: any) => {
                //         return <NumericFormat displayType="text"
                //             thousandSeparator
                //             decimalScale={2}
                //             value={value?.[key2 + key?.id] ?? 0} />
                //     }
                // },)
                res = {
                    ...res,
                    [`${key?.name} ${key1}`]: item[`${key2}_${key?.id}`] ?? 0
                }
            }
            return res
        }
        for (let key of data) {
            result.push(key1 + key?.id)
        }
        return result
    }
    return (
        <Content>
            <div className="container-fluid flex-grow-1 py-1 size_16 ">
                <div className='d-flex justify-content-between'>
                    <div className="d-flex gap-2 align-items-center">
                        <div className="d-flex gap-2">
                            <Input type='date'
                                disabled={loading ? true : false}
                                onChange={(e: any) => {
                                    let value = e.target.value
                                    if (value && value.length > 0) {
                                        // dispatch(isClientGet(`?start_date=${value}&end_date=${clientData?.end_date}&per_page=50&page=1`))
                                        getData({
                                            ...data,
                                            start_date: value,

                                        })
                                    }
                                }}
                                value={data?.start_date}
                            />
                            <Input type='date'
                                disabled={loading ? true : false}
                                min={data?.start_date} onChange={(e: any) => {
                                    let value = e.target.value
                                    if (value && value.length > 0) {
                                        getData({
                                            ...data,
                                            end_date: value,

                                        })
                                    }
                                }}
                                value={data?.end_date}
                            />
                        </div>
                    </div>
                    <button className="btn btn-success " type="button" onClick={() => {
                        let resultData = [...data.data.map((item: any, index: number) => {
                            const adv = advFun(data?.adv, 'excel', 'analiz ', 'analiz_adv', '', item)
                            const yani = advFun(data?.adv, 'excel', 'yangi bemor ', 'adv_new_client', '', item)
                            console.log('adv', adv);
                            console.log('yani', yani);
                            
                            return {
                                ["№"]: index + 1,
                                ["Sana"]: item?.date,
                                ["Umumiy"]: item?.total_price ?? 0,
                                ["Naqd "]: item?.cash_price ?? 0,
                                ["PLASTIK "]: item?.card_price ?? 0,
                                ["O'TKAZMA "]: item?.transfer_price ?? 0,
                                ["QARZDORLIK "]: item?.debt_price ?? 0,
                                ["DR SINO DORIXONASI "]: item?.pharmacy_product_qty_price ?? 0,
                                ["MP HISSASI "]: item?.kounter_agent_ptice ?? 0,
                                ["KASSADAN NAQT XARAJAT "]: item?.expense_cash_price ?? 0,
                                ["ANALIZLAR SONI "]: item?.analiz_qty ?? 0,
                                ["MUOLAJALAR SONI "]: item?.muolja_qty ?? 0,
                                ["MED PREDSTAVITELDAN YANGI BEMORLAR "]: item?.yollanma_client ?? 0,
                                ["YO'LANMA ANALIZ "]: item?.yollanma_analiz ?? 0,
                                ...adv,
                                ...yani,

                                // ...obj
                            }
                        })]
                        exportToExcel(resultData)
                    }}>Eksport</button>
                </div>
                <div className="card" style={{
                    height: `${window.innerHeight / 1.4}px`,
                    overflow: 'auto'
                }}>


                    <Table



                        paginationRole={false}
                        isLoading={false}
                        isSuccess={true}
                        reloadData={true}
                        reloadDataFunction={() => {
                            getData({
                                start_date: '',
                                end_date: ''
                            })
                        }}
                        top={100}
                        scrollRole={true}
                        editRole={false}
                        deleteRole={false}
                        extraKeys={[
                            'date_',//UMUMIY 
                            'total',//UMUMIY 
                            'cash',///NAQT
                            'card',//otkazma
                            'transfer',//otkazma
                            'debt',///QARZDORLIK 
                            'pharmacy_product_qty_',////DR SINO DORIXONASI
                            // 'pharmacy_store',////SKLAD DOSTAVKA 
                            'kounter_agent_ptice', ///mp-hissasi MP HISSASI
                            'expense_cash_price_',///KASSADAN NAQT XARAJAT
                            'analiz_qty_',///ANALIZLAR SONI
                            // 'new_client',///YANGI BEMORLAR SONI 
                            'muolja_qty_',///MUOLAJALAR SONI 
                            // MED PREDSTAVITELDAN YANGI BEMORLAR 
                            'yollanma_client_', ///YO'LANMA ANALIZ
                            'yollanma_analiz_',///YO'LANMA ANALIZ
                            ...advFun(data?.adv ?? []),
                            ...advFun(data?.adv ?? [], '', 'adv_new_client__')
                            // OTZIV ANALIZ 
                            // BILBORD ANALIZ 
                            // TV ANALIZ 
                            // INSTAGRAM ANALIZ 
                            // /YO'LANMADAN YANGI BEMOR
                            // OTZIVDAN YANGI BEMOR
                            // BILBORD YANGI BEMOR 
                            // TV YANGI BEMOR
                            // INSTAGRAM YANGI BEMOR
                        ]}
                        extraButtonRole={true}

                        columns={[
                            {
                                title: 'Sana',
                                key: 'date_',
                                renderItem: (value: any, data: any) => {

                                    return <td >
                                        <span>
                                            {value?.date}
                                        </span>
                                    </td>
                                }
                            },

                            {
                                title: 'Umumiy',
                                key: 'total',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.total_price ?? 0} />
                                }
                            },
                            {
                                title: 'Naqd',
                                key: 'cash',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.cash_price ?? 0} />
                                }
                            },
                            {
                                title: 'PLASTIK ',
                                key: 'card',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.card_price ?? 0} />
                                }
                            },
                            {
                                title: 'Otkazma',
                                key: 'transfer',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.transfer_price ?? 0} />
                                }
                            },
                            {
                                title: 'QARZDORLIK ',
                                key: 'debt',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.debt_price ?? 0} />
                                }
                            },
                            {
                                title: 'DR SINO DORIXONASI ',
                                key: 'pharmacy_product_qty_',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.pharmacy_product_qty ?? 0} />
                                }
                            },
                            {
                                title: 'MP HISSASI ',
                                key: 'kounter_agent_ptice',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.kounteragent_price ?? 0} />
                                }
                            },
                            {
                                title: 'KASSADAN NAQT XARAJAT ',
                                key: 'expense_cash_price_',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.expense_cash_price ?? 0} />
                                }
                            },
                            {
                                title: 'ANALIZLAR SONI ',
                                key: 'analiz_qty_',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.analiz_qty ?? 0} />
                                }
                            },
                            {
                                title: 'MUOLAJALAR SONI  ',
                                key: 'muolja_qty_',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.muolja_qty ?? 0} />
                                }
                            },
                            {
                                title: 'MED PREDSTAVITELDAN YANGI BEMORLAR   ',
                                key: 'yollanma_client_',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.yollanma_client ?? 0} />
                                }
                            },
                            {
                                title: "YO'LANMA ANALIZ",
                                key: 'yollanma_analiz_',
                                render: (value: any, data: any) => {
                                    return <NumericFormat displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        value={value?.yollanma_analiz ?? 0} />
                                }
                            },
                            ...advFun((data?.adv ?? []), 'nav'),
                            ...advFun(data?.adv ?? [], 'nav', 'adv_new_client__', 'adv_new_client_', 'Yangi bemor'),



                        ]}
                        dataSource={
                            data.data
                        }
                    />
                </div>
            </div>
        </Content>
    )
}

export default ExcelRepot
