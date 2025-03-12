import React, { useEffect, useState } from 'react'
import Content from '../../../layout/Content'
import Navbar from '../../../layout/Navbar'
import axios from 'axios'
import { Input } from 'reactstrap'
import Table from '../../../componets/table/Table'
import { fullName } from '../../../helper/fullName'
import { getCurrentDateTime } from '../../../helper/dateFormat'
import Pagination from '../../../componets/pagination/Pagination'

const ReferringDoctorChangeArchive = () => {
    const [data, setData] = useState({
        data: []
    } as any)
    const [loading, setLoading] = useState(false)
    const [serachText, setSerachText] = useState('')
    const getData = async (data?: any) => {
        try {
            setLoading(() => true)
            setData(() => { 
             return {
                data:[]
             }
            })
            let res = await axios.get(`/referring-doctor/change-archive?${data ?? ''}`)
            setData(() => res.data.result)
        } catch (error) {

        } finally {
            setLoading(() => false)
        }

    }
    useEffect(() => {
        getData()
    }, [])
    return (
        <Content  >
            <Navbar />
            <div className="container-fluid flex-grow-1 container-p-y size_16 ">
                <div className="d-flex my-2 gap-3">
                    {/* <form className='w-100'>
                        <Input placeholder='Izlash...' onChange={(e: any) => {
                            setSerachText(e.target.value)
                        }}
                            value={serachText}
                        />
                    </form> */}

                </div>
                <div className="card" style={{
                    height: `${window.innerHeight / 1.7}px`,
                    overflow: 'auto'
                }}>
                    <Table
                        // page={page}
                        //  exportFile={true}
                        //  importFile={true}
                        // deletedispatchFunction={isReferringDoctorDelete}
                        // setNumberOfPages={setNumberOfPages}
                        paginationRole={false}
                        // localEditFunction={(e: any) => {
                        //     setItem(() => e)
                        //     console.log();

                        //     setModal(true)
                        // }}
                        isLoading={loading}
                        isSuccess={true}
                        reloadData={true}
                        reloadDataFunction={() => {
                            getData()
                        }}
                        top={100}
                        scrollRole={true}
                        editRole={true}
                        deleteRole={true}
                        extraKeys={['klient', 'old_doc', 'change_doc', 'vaqti']}
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
                                title: "Mijoz",
                                key: 'klient',
                                renderItem: (value: any, data: any) => {
                                    return <td onClick={() => {

                                    }}>

                                        <b>{fullName(value.client)}</b>

                                    </td>
                                }
                            },
                            {
                                title: "Oldingi doktor",
                                key: 'old_doc',
                                renderItem: (value: any, data: any) => {
                                    return <td onClick={() => {

                                    }}>

                                        <b>{value.from_referring_doctor ? fullName(value.from_referring_doctor) : '-'}</b>

                                    </td>
                                }
                            },
                            {
                                title: "O'zgarish doktor",
                                key: 'change_doc',
                                renderItem: (value: any, data: any) => {
                                    return <td onClick={() => {

                                    }}>

                                        <b>{value.to_referring_doctor ? fullName(value.to_referring_doctor) : '-'}</b>

                                    </td>
                                }
                            },
                            {
                                title: "Vaqti",
                                key: 'vaqti',
                                renderItem: (value: any, data: any) => {
                                    return <td onClick={() => {

                                    }}>

                                        {getCurrentDateTime(value?.created_at)}

                                    </td>
                                }
                            },



                        ]}
                        dataSource={
                            data?.data
                        }
                    />
                </div>
                <br />
                {
                    loading ? '' :
                        <Pagination
                            setPageLimit={(e: any) => {
                                // // setNumberOfPages(Math.ceil(referringDoctorData?.length / e))
                                // // setPageLimit(e)
                                // dispatch(isReferringDoctorCurrentPage(1))
                                // dispatch(isReferringDoctorPageLimit(e))
                                getData(`per_page=${e}`)
                            }}
                            pageLmit={data?.per_page}
                            current={data?.current_page} total={data?.last_page} count={(e: any) => {
                                console.log(e);
                                getData(`per_page=${data?.per_page}&page=${e}`)
                            }} />
                }
            </div>
        </Content>
    )
}

export default ReferringDoctorChangeArchive
