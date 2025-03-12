import { domain } from "../main"
import { dateFormat } from "../service/helper/day"
import { getCurrentDateTime } from "./dateFormat"
import { fullName } from "./fullName"
import { formatId } from "./idGenerate"

export const dateFilterUniqe = (data: any) => {
    let dateData = [...new Set(data?.map((item: any) => dateFormat(item?.client_item?.at(-1)?.created_at)))]
    let res = data as any
    for (let key of dateData) {
        let find = data?.find((item: any) => dateFormat(item?.client_item?.at(-1)?.created_at) == key)
        if (find) {
            res = res?.map((item: any) => {
                return item?.id == find?.id ? {
                    ...find,
                    date: key
                } : item
            })
        }
    }
    return res
}

export const numberStatus = (status: any) => {
    switch (status) {
        case 1:

            return 'waiting'
        case 2:

            return 'in_room'
        case 3:

            return 'finish'

        default:
            return 'mix'
    }
}

export function referringDoctoGroupByDate(data: any) {
    let res = data.reduce((acc: any, entry: any) => {
        const dateKey = entry.date.split(' ')[0]; // Extract only the date part
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(entry);
        return acc;
    }, {} as any);
    const result = Object.keys(res).map((date) => ({
        date: date,
        data: res[date],
    }));

    return result
}
export const docregprintheader = (data: any) => {
    return `
                                                                                   <table>
            <tr>
                <td>Mijozning F.I.SH</td>
                <td>${fullName(data)}</td>
                <td
                rowspan="2"
                colspan="2"
                >TEKSHIRUV
                    <br>
                    NATIJALARI
                </td>
            </tr>
            <tr>
                <td>
                    Tug'ilgan yili
                </td>
                <td>
                    ${data?.data_birth}
                </td>
            </tr>
            <tr>
                <td>
                    Kelgan sanasi
                </td>
                <td>
                    ${getCurrentDateTime(data?.created_at)}
                </td>
                <td>Namuna</td>
                <td>0</td>
            </tr>
            <tr>
                <td>
                    Manzil
                </td>
                <td>-</td>
                <td>ID</td>
                <td>${formatId(data?.person_id)}</td>
            </tr>
        </table>
                                                                                    
                                                                                    `
}
const aylanastatus = (value: any, data: any) => {
    switch (value) {
        case data?.items[0]?.value_1:
            return 1
        case data?.items[0]?.value_2:
            return 2
        default:
            return 3

    }
}
export const docregprintselect = (checkboxData: any, templateResult: any, parentItem: any, role?: any) => {
    const { date, index, full_name } = role
    let tr = '' as any
    // <table className="table table-bordered">
    // <tbody>
    {
        checkboxData?.map((res: any, index: number) => {
            let findtarget = templateResult?.find((resItem: any) => resItem?.template_item_id == res?.items[0]?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'select') ?? false
            console.log('findtarget', findtarget);

            let findtargetrow = templateResult?.filter((resItem: any) => resItem?.template_id == parentItem?.template_id && resItem?.value?.length > 0)
            let findtargetphoto = templateResult?.find((resItem: any) => resItem?.template_id == parentItem?.template_id && resItem?.status == 'photo') ?? false
            let findtargetcomment = templateResult?.find((resItem: any) => resItem?.template_id == parentItem?.template_id && resItem?.status == 'comment')
            let idPhoito = 1
            tr += `

            <tr>
              <td>
                            ${res?.category_name}
                        </td>
                            <td>
                            ${findtarget?.value ?? '-'}
                        </td>
                        ${+parentItem?.template?.is_photo && index == 0 ?
                    `<td rowSpan="3"> <img src="${domain}/${findtargetphoto?.value}" alt="user-avatar" className="d-block rounded object-contain" height="100" width="100" id="uploadedAvatar" /></td>` : (!+parentItem?.template?.is_photo ?
                        ` <td style="width: 24px; height: 24px; background-color: #ff3e1d; border-radius: 50%;" >
                                  ${aylanastatus(findtarget?.value, res)}
                                </td>` : '')
                }
            </tr>
                ${+parentItem?.template?.is_comment && index == checkboxData?.length - 1 ? `<tr>
                     <td colSpan="${+parentItem?.template?.is_photo ? 2 : 3}">
                            ${findtargetcomment?.value ?? '-'}
                    </tr>`: ''}
            
            `

        })
    }


    //     </tbody >
    // </table > 
    return `

    <div>
    ${index > 0 ? `<p>${date ?? '-'}</p>` : ''}
  
  <div style="display:flex; align-items: center; gap: 10px;justify-content: space-between;">
  <p>${index > 0 ? `${index} - kun` : date ?? '-'}</p>
  <p>${full_name ?? ''}</p>
  </div>

                                                                                   <table>
                                                                                         <tbody>
                                                                                        ${tr} 
                                                                                         </tbody>
           
        </table>
    </div>
                                                                                    
                                                                                    `
}

export const docregprintcheckbox = (checkboxData: any, templateResult: any, parentItem: any, role?: any) => {
    let tr = '' as any
    // <table className="table table-bordered">
    // <tbody>
    const { date, index, full_name } = role
    {
        checkboxData?.map((item: any, index: number) => {
            let commentData = item
                ?.items?.filter((res: any) => +res?.is_comment)
            let notCommentData = item
                ?.items?.filter((res: any) => !new Set(commentData?.map((item: any) => item?.id))?.has(res?.id))
            let leftData = [...notCommentData]?.slice(0, notCommentData?.length / 2 + (notCommentData?.length % 2 == 0 ? 0 : 1))
            let rightData = [...notCommentData]?.slice(notCommentData?.length / 2 + (notCommentData?.length % 2 == 0 ? 0 : 1))
            let result = `` as any;
            let rightGrid = `` as any;
            let leftGrid = `` as any;
            //    <p>{dateFormat(item?.created_at, '/', false)}</p>

            {
                commentData
                    // ?.slice(0, item?.items?.length / 2 + (item?.items?.length % 2 == 0 ? 0 : 1))
                    ?.map((res: any) => {
                        let findcheckbox = templateResult?.find((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'checkbox')
                        let findcomment = templateResult?.find((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'is_comment')
                        result += `
                       
                                                                                         <tr>
                                                                                              <td>
                                <input className="form-check-input" type="checkbox"  ${+findcheckbox?.value ? 'checked' : ''}/>
                                <label  className='checkbox_label'>${res?.value_1 ?? '-'} </label>
                                                                                              </td>
                                                                                              <td>
                                                                                              ${(findcomment?.value?.length > 0 ? `<b>${findcomment?.value ?? '-'}</b> ` : `<b>${findcomment?.value ?? '-'}</b>`)}
                                                                                              </td>
                                                                                         </tr>
                                                                                       
                        `

                    })
            }
            {
                leftData
                    // ?.slice(0, item?.items?.length / 2 + (item?.items?.length % 2 == 0 ? 0 : 1))
                    ?.map((res: any) => {
                        let findcheckbox = templateResult?.find((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'checkbox')
                        let findcomment = templateResult?.find((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'is_comment')
                        leftGrid += `
                        
                       <div style="display: flex; align-items: center; gap: 10px">
                       <div style="display: flex; align-items: center; gap: 10px">
                       <input className="form-check-input" type="checkbox"  ${+findcheckbox?.value ? 'checked' : ''}/>
                       <label  className='checkbox_label'>${res?.value_1 ?? '-'} </label>
                       </div>
                       
                    
                       ${+res?.is_comment ? (findcomment?.value?.length > 0 ? `<b>${findcomment?.value ?? '-'}</b> ` : `<b>${findcomment?.value ?? '-'}</b>`) : ''
                            }
                       </div>
                        `

                    })
            }
            {
                rightData
                    // ?.slice(0, item?.items?.length / 2 + (item?.items?.length % 2 == 0 ? 0 : 1))
                    ?.map((res: any) => {
                        let findcheckbox = templateResult?.find((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'checkbox')
                        let findcomment = templateResult?.find((resItem: any) => resItem?.template_item_id == res?.id && resItem?.template_id == parentItem?.template_id && resItem?.status == 'is_comment')
                        rightGrid += `
                        
                       <div style="display: flex; align-items: center; gap: 10px">
                       <div style="display: flex; align-items: center; gap: 10px">
                       <input className="form-check-input" type="checkbox"  ${+findcheckbox?.value ? 'checked' : ''}/>
                       <label  className='checkbox_label'>${res?.value_1 ?? '-'} </label>
                       </div>
                       
                    
                       ${+res?.is_comment ? (findcomment?.value?.length > 0 ? `<b>${findcomment?.value ?? '-'}</b> ` : `<b>${findcomment?.value ?? '-'}</b>`) : ''
                            }
                       </div>
                        `

                    })
            }



            tr += `
                  
                    
               <h3 className='text-center my-2'>${item?.category_name}</h3>
                   <table>
                                                                                         <tbody>
                ${result}
                  </tbody>
                                                                                             </table>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
                   <idv>
                     ${leftGrid}
                    </idv>
                   <div>
                     ${rightGrid}
                   </div>
                    </div>

                
          `
        })
    }



    return `
   
 
      <div>
       <div style="display:flex; align-items: center; gap: 10px;justify-content: space-between;">
  <p>${date ?? '-'}  ${index > 0 ? `|| ${index} - kun` : ''}</p>
  <p>${full_name ?? ''}</p>
  </div>
    ${tr}
        </div>
    `
}
