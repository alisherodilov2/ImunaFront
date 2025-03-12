import React from 'react'
import { getCurrentDateTime } from '../../../helper/dateFormat';
import { formatId } from '../../../helper/idGenerate';
import { fullName } from '../../../helper/fullName';
import { labaratoryGroup } from '../../../helper/clientHelper';
import red from '../../../assets/red.png'
import green from '../../../assets/green.png'
import black from '../../../assets/black.png'
import { domain } from '../../../main';
const resultImoji = (result: any, normal: any, color: any) => {
    // 🟢⚫🔴
    let res = black
    if (color == 'green') {
        res = green
    }
    if (color == 'red') {
        res = red
    }
    return `
    <span style="color:${color}; font-weight: bolder; padding-right: 25px">
    ${result}
    </span>
    <img src="${res}" style=" position: absolute; top: 3px; right: 3px; width: 20px; height: 20px">
    `

}
export const laboratoryClientHtml = (data: any) => {
    let tableRes = `
 <table>
                <tr>
                    <td>Mijozning F.I.SH</td>
                    <td>${fullName(data?.client)}</td>
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
                        ${data?.client?.data_birth}
                    </td>
                </tr>
                <tr>
                    <td>
                        Kelgan sanasi
                    </td>
                    <td>
                        ${getCurrentDateTime(data?.client?.created_at)}
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
                    <td>${formatId(data?.client?.person_id)}</td>
                </tr>
            </table>
            
    `

    labaratoryGroup(data)?.map((parentItem: any) => {

        const { groups, servicetype } = parentItem
        let htmlRes = '' as any;
        let th = `  <th className=''>
        №
    </th>` as any;
        let tr = `` as any;
        const { laboratory_template, } = groups?.at(0)?.service
        let index_num = 0;
        let header = [] as any
        let chekheadercol = [
            'name',
            'result',
            'normal',
            'extra_column_1',
            'extra_column_2',
        ] as any;
        let headerfind = laboratory_template?.at(0)
        if (headerfind) {
            for (let key in headerfind) {
                let res_colums = chekheadercol.find((c: any) => c === key);
                if ((headerfind[key] != 'null' && headerfind[key] !== '') && (headerfind[key] !== undefined && res_colums)) {
                    th = th + `<th>${headerfind[key]}</th>`
                    header.push({
                        key: key,
                        name: headerfind[key]
                    })
                }
            }

        }
        let result = false;
        groups?.map((item: any) => {

            const { laboratory_template_result } = item
            let client_value_find = laboratory_template_result?.slice(1)?.filter((item22: any) => item22?.client_value_id == item?.id && +item22?.is_print)
            console.log('client_value_find', client_value_find);
            let index = 1;
            if (client_value_find?.length > 0) {
                result = true
            }
            for (let key of client_value_find) {
                index_num = index_num + 1
                let td = `<tr>
                <td>${index_num}</td>
                `
                let res_colums = chekheadercol.find((c: any) => c === key);
                for (let keyItem of header) {
                    td = td + `<td style="position: relative"> ${keyItem?.key == 'result' ? resultImoji(key?.result, key?.normal, key?.color) : key?.[keyItem?.key] || '-'}</td> `
                }

                tr = tr + `<tr>${td}</tr>`
                index++
            }


        })

        tableRes = result ? (tableRes + ` <h3 style='text-align: center;'>${groups?.length > 1 ? servicetype : groups?.at(0)?.service?.name}</h3>
            <table>
                ${th}
                ${tr}
            </table>
            
            `) : tableRes;



    })

    const { files } = data
    if (files?.filter((res: any) => res.type == 'image')?.length > 0) {
        tableRes = tableRes + `
      
        ${files?.filter((res: any) => res.type == 'image')?.map((item: any) => {

            return `
            <div style="width: 100vw; height: calc(100vh - 2rem);  position: relative;" >
             <h3 style='text-align: center; position: absolute; top: 1rem;left: 50%; transform: translateX(-50%);z-index: 999'>${item?.name}</h3>
              <img src="${domain}${item?.file}" alt="" style="width: 100%; height: 80%; margin-top: 10%; object-fit: contain" />
            </div>
          
             
            `
        })}
        <table>
      `
    }

    return tableRes
}

