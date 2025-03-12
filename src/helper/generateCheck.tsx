// import { AppDispatch } from '../store/store';
// import { isLoadingApiFunction } from '../reducer/MenuReducer';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import logo from '../assets/immuno-logo.jpg'
import { fullName } from './fullName';
import { formatId } from './idGenerate';
import { dateFormat } from '../service/helper/day';
import { chegirmaHisobla } from './cashRegHelper';
import { domain } from '../main';
import { phoneFormatNumber } from './graphHelper';
import { addDaysToDate, statitionarDate } from './clientHelper';
// import { Jinsi } from './Jinsi';
// import { discountQty, payDiscount, paymentDiscount } from './payDiscount';
// import { barcodeView } from './barcodeView';
// import { fulldate } from './fulldate';
export const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: 2,
    // currency: 'So'm'
});

export const checkNull = (data: any) => {
    if ((data == null || data == undefined || data == '') || (data == '-' || data == 'null' || data == 'undefined')) {
        return false
    }
    return true
}
export const generateCheck = async ({ target, iframeRef, name = 'Topilmadi', client_time = [], user }: {
    target
    ?: any,
    iframeRef?: any,
    name?: string,
    client_time?: any,
    user?: any
}) => {
    function dataURLToBlob(dataURL: any) {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new Blob([u8arr], { type: mime });
    }
    try {
        // isLoadingFunction(true)


        const data = target?.client_value.reduce((acc: any, item: any) => {
            const departmentId = item.service.department.id;
            if (!acc[departmentId]) {
                acc[departmentId] = [];
            }
            acc[departmentId].push(item);
            return acc;
        }, {});

        console.log(data);

        const pageWidth = 70;
        let pageHeight = 100; //
        var doc = new jsPDF({
            unit: 'mm',
            format: [pageWidth, pageHeight],
        }) as any;
        // doc.autoPrint();
        const response = await fetch('/Regular.ttf');
        const responseBold = await fetch('/Bold.ttf');
        const fontData = await response.arrayBuffer();
        doc.addFileToVFS('Bold.ttf', responseBold);
        doc.addFileToVFS('Regular.ttf', fontData);
        doc.addFont('/Bold.ttf', 'bold', 'normal');
        doc.addFont('/Regular.ttf', 'regular', 'normal');
        let x = 5, y = 5, offsetX = 25;
        let drowData = [

        ] as any
        let index = 0;
        if (+user?.setting?.is_logo_chek) {
            let centerX = pageWidth / 2 - user?.setting?.logo_width / 2;
            doc.addImage(`${domain}/api/v3/file?url=${user?.logo_photo}`, "JPEG", centerX, 3, +user?.setting?.logo_width, +user?.setting?.logo_height);
            y = +user?.setting?.logo_height + 5;
        } else {
            y = 5;
        }
        if (target?.client_value?.length == 0) {
            let saveObject = {} as any
            doc.setFontSize(10);
            // title

            if (!user?.setting?.is_logo_chek) {
                doc.setFont('bold');
                doc.splitTextToSize(name, 70).map((line: any) => {
                    doc.text(line, x, y);
                    y = y + 5;
                });
            }

            y = y + 5
            const xPosition = pageWidth / 2;
            // bolim
            doc.setFont('bold');
            doc.text('STATSIONAR', xPosition, y, { align: 'center', });
            const lineY = y + 1; // The Y position of the line, slightly below the text
            doc.setLineWidth(0.5);
            doc.line(5, lineY, 65, lineY);

            y = y + 10;
            // ism familyasi
            doc.setFont('regular');
            doc.text('Mijoz:', x, y)

            doc.setFont('regular');
            doc.setFontSize(10);
            const textLines1 = doc.splitTextToSize(fullName(target).toUpperCase(), 40);
            textLines1.map((line: any) => {
                doc.text(line, x + offsetX, y);
                y = y + 5;
            });
            // idsi
            doc.text('ID', x, y)
            doc.text(formatId(target?.person_id), x + offsetX, y)
            y = y + 5
            // tugulgan sana
            if (checkNull(target?.data_birth)) {
                doc.text("Tugulgan sana", x, y)
                saveObject = {
                    ...saveObject,
                    data_birth_title: {
                        text: "Tugulgan sana",
                        y: y,
                        x: x,
                        size: 10,
                    }
                }
                doc.text(dateFormat(target?.data_birth, '/', false), x + offsetX, y)
                saveObject = {
                    ...saveObject,
                    person_id: {
                        text: target?.data_birth,
                        y: y,
                        x: x + offsetX,
                        size: 10,
                    }
                }
                y = y + 5
            }
            doc.text('Qabul sanasi:', x, y)
            doc.text(target?.admission_date, x + offsetX, y)
            y = y + 5
            doc.text('Ketish sanasi:', x, y)
            if (+target.day_qty > 0) {
                doc.text(addDaysToDate(target.admission_date, +target.day_qty), x + offsetX, y)
            } else {
                doc.text(target.admission_date, x + offsetX, y)
            }

            doc.setLineWidth(0.5);

            doc.rect(5, y + 4, 60, 30);
            y = y + 10
            doc.text('Xona:', x + 5, y)
              doc.text(`${target.statsionar_room.type} ${target.statsionar_room.number}-xona`, x + 5 + 10, y)
            y = y + 5
            doc.text("o'rin:", x + 5, y)
            doc.text(target.statsionar_room.room_index, x + 5 + 10, y)
            y = y + 5
            doc.text("Narxi:", x + 5, y)
            doc.text(target.statsionar_room.price, x + 5 + 10, y)
            y = y + 5
            doc.text("Kun:", x + 5, y)
            let dats = target.day_qty > 0 ? target.day_qty : statitionarDate({
                admission_date: target.admission_date ?? user?.graph_format_date,
            }, user?.graph_format_date, true)
            doc.text(`${dats}`, x + 5 + 10, y)
            y = y + 5
          let   extraPrice = dats * target.statsionar_room.price
            doc.text("Jami:", x + 5, y)
        
            doc.text(formatter.format(extraPrice), x + 5 + 10, y)
            y = y + 5
        } else {
            for (let key in data) {
                index = index + 1;
                let saveObject = {} as any
                let response = data[key]
                doc.setFontSize(10);
                if (!user?.setting?.is_logo_chek) {
                    doc.setFont('bold');
                    doc.splitTextToSize(name, 70).map((line: any) => {
                        doc.text(line, x, y);
                        y = y + 5;
                    });
                }
                // title

                saveObject = {
                    ...saveObject,
                    title: {
                        name: name,
                        y: y,
                        x: x
                    }
                }
                y = y + 5
                let departmentName = response?.at(0).service.department
                const textWidth = doc.getTextDimensions(departmentName.name).w;
                const xPosition = pageWidth / 2;
                // bolim

                const departmentNameSplit = doc.splitTextToSize((departmentName.name).toUpperCase(), 65);
                departmentNameSplit.map((line: any) => {
                    // doc.text(line, x, y);
                    doc.text(line, xPosition, y, { align: 'center', });
                    y = y + 5;
                });


                saveObject = {
                    ...saveObject,
                    department: {
                        name: departmentName.name,
                        y: y,
                        width: textWidth,
                        x: xPosition,
                        style: {
                            align: 'center',
                        }
                    }
                }
                const lineY = y + 1; // The Y position of the line, slightly below the text
                doc.setLineWidth(0.5);
                doc.line(xPosition - textWidth, lineY, xPosition + textWidth, lineY);
                saveObject = {
                    ...saveObject,
                    department_line: {
                        x1: xPosition - textWidth,
                        y1: lineY,
                        x2: xPosition + textWidth,
                        y2: lineY,
                        lineSize: 0.5
                    }
                }
                y = y + 10;
                // ism familyasi
                doc.setFont('regular');
                doc.text('Mijoz:', x, y)
                saveObject = {
                    ...saveObject,
                    full_name_title: {
                        text: 'Mijoz:',
                        y: y,
                        x: x,
                        size: 10,
                    }
                }
                doc.setFont('regular');
                doc.setFontSize(10);
                saveObject = {
                    ...saveObject,
                    full_name: {
                        text: fullName(target).toUpperCase(),
                        textLine: 40,
                        y: y,
                        x: x + offsetX,
                        offsetY: 5,
                        size: 10,
                    }
                }
                const textLines1 = doc.splitTextToSize(fullName(target).toUpperCase(), 40);
                textLines1.map((line: any) => {
                    doc.text(line, x + offsetX, y);
                    y = y + 5;
                });
                // idsi
                doc.text('id', x, y)
                saveObject = {
                    ...saveObject,
                    person_id_title: {
                        text: "ID",
                        y: y,
                        x: x,
                        size: 10,
                    }
                }
                doc.text(formatId(target?.person_id), x + offsetX, y)
                saveObject = {
                    ...saveObject,
                    person_id: {
                        text: formatId(target?.person_id),
                        y: y,
                        x: x + offsetX,
                        size: 10,
                    }
                }

                y = y + 5
                if (target?.probirka_id > 0 && + departmentName.probirka) {
                    doc.text('Probirka', x, y)
                    saveObject = {
                        ...saveObject,
                        person_id_title: {
                            text: "ID",
                            y: y,
                            x: x,
                            size: 10,
                        }
                    }
                    doc.text((target?.probirka_id), x + offsetX, y)
                    saveObject = {
                        ...saveObject,
                        person_id: {
                            text: formatId(target?.person_id),
                            y: y,
                            x: x + offsetX,
                            size: 10,
                        }
                    }
                    y = y + 5
                }

                // tugulgan sana
                if (checkNull(target?.data_birth)) {
                    doc.text("Tugulgan sana", x, y)
                    saveObject = {
                        ...saveObject,
                        data_birth_title: {
                            text: "Tugulgan sana",
                            y: y,
                            x: x,
                            size: 10,
                        }
                    }
                    doc.text((target?.data_birth), x + offsetX, y)
                    saveObject = {
                        ...saveObject,
                        person_id: {
                            text: target?.data_birth,
                            y: y,
                            x: x + offsetX,
                            size: 10,
                        }
                    }
                    y = y + 5
                }
                // kelgan sana
                doc.text('Kelgan sana', x, y)
                saveObject = {
                    ...saveObject,
                    kelgan_sana_title: {
                        text: 'Kelgan sana',
                        y: y,
                        x: x,
                        size: 10,
                    }
                }
                doc.text(formatId(target?.person_id), x + offsetX, y)
                saveObject = {
                    ...saveObject,
                    kelgan_sana: {
                        text: formatId(target?.person_id),
                        y: y,
                        x: x + offsetX,
                        size: 10,
                    }
                }
                y = y + 8
                // tortbuchkak xona raqmi
                let floor = `${departmentName?.letter} - ${departmentName?.floor}`
                const textWidth2 = doc.getTextDimensions(floor).w;
                doc.setLineWidth(0.5);

                doc.rect((xPosition - textWidth2 / 2) - 5, y - 4, textWidth2 + 10, 6);
                saveObject = {
                    ...saveObject,
                    tortburchak: {
                        x1: (xPosition - textWidth2 / 2) - 5,
                        y1: y - 4,
                        x2: textWidth2 + 10,
                        y2: 6,
                        lineSize: 0.5
                    }
                }
                doc.text(floor, xPosition, y, { align: 'center', });
                saveObject = {
                    ...saveObject,
                    tortburchak_title: {
                        text: floor,
                        y: y,
                        x: xPosition,
                        size: 10,
                        style: {
                            align: 'center'
                        }
                    }
                }
                y = y + 8
                // qavat boyicha batafsil
                const qavat = `${departmentName?.floor} | ${departmentName?.room_number} - Xona`;
                doc.text(qavat, xPosition, y, { align: 'center', });
                saveObject = {
                    ...saveObject,
                    qavat: {
                        text: qavat,
                        y: y,
                        x: xPosition,
                        size: 10,
                        style: {
                            align: 'center'
                        }
                    }
                }
                y = y + 10
                // y = 20;
                // xizmatlar
                console.log(data[key]);
                let res = data[key].map((item: any) => {
                    return [item?.service?.name, item?.price, item?.qty];
                });
                saveObject = {
                    ...saveObject,
                    xizmatlar: {
                        data: res,
                        y: y,
                        x: x,
                        size: 10,
                    }
                }
                for (let item of res) {
                    const serviceName = doc.splitTextToSize((item[0]).toUpperCase(), 65);
                    serviceName.map((line: any) => {
                        doc.text(line, x, y);
                        y = y + 5;
                    });
                    doc.text(formatter.format(item[1]), pageWidth - x, y, { align: 'right', });
                    y = y + 5
                }

                doc.text('Summa', x, y);
                saveObject = {
                    ...saveObject,
                    total_price_title: {
                        text: 'Summa',
                        y: y,
                        x: x,
                        size: 10,
                    }
                }
                let price = data[key]?.reduce((a: any, b: any) => a + +b.price * +b.qty, 0);

                doc.text(`${formatter.format(price)}`, x + offsetX, y);
                // chegirma

                if (index == Object.keys(data).length) {
                    let extraPrice = 0;
                    if (+target.is_statsionar) {
                        y = y + 10
                        doc.setFont('bold');
                        doc.text('STATSIONAR', xPosition, y, { align: 'center', });
                        const lineY = y + 1; // The Y position of the line, slightly below the text
                        doc.setLineWidth(0.5);
                        doc.line(5, lineY, 65, lineY);
                        doc.setFont('regular');
                        y = y + 10
                        doc.text('Qabul sanasi:', x, y)
                        doc.text(target?.admission_date, x + offsetX, y)
                        y = y + 5
                        doc.text('Ketish sanasi:', x, y)
                        if (+target.day_qty > 0) {
                            doc.text(addDaysToDate(target.admission_date, +target.day_qty), x + offsetX, y)
                        } else {
                            doc.text(target.admission_date, x + offsetX, y)
                        }

                        doc.setLineWidth(0.5);

                        doc.rect(5, y + 4, 60, 30);
                        y = y + 10
                        doc.text('Xona:', x + 5, y)
                          doc.text(`${target.statsionar_room.type} ${target.statsionar_room.number}-xona`, x + 5 + 10, y)
                        y = y + 5
                        doc.text("o'rin:", x + 5, y)
                        doc.text(target.statsionar_room.room_index, x + 5 + 10, y)
                        y = y + 5
                        doc.text("Narxi:", x + 5, y)
                        doc.text(target.statsionar_room.price, x + 5 + 10, y)
                        y = y + 5
                        doc.text("Kun:", x + 5, y)
                        let dats = target.day_qty > 0 ? target.day_qty : statitionarDate({
                            admission_date: target.admission_date ?? user?.graph_format_date,
                        }, user?.graph_format_date, true)
                        doc.text(`${dats}`, x + 5 + 10, y)
                        y = y + 5
                        extraPrice = dats * target.statsionar_room.price
                        doc.text("Jami:", x + 5, y)
                    
                        doc.text(formatter.format(extraPrice), x + 5 + 10, y)
                        y = y + 5
                    }

                    console.log('target', target);
                    if (+user?.setting?.is_chek_rectangle) {

                        y = y + 8
                        // tortbuchkak xona raqmi

                        let totalPrice = `Umumiy to'lov: ${formatter.format(+target?.total_price + +extraPrice)}`;

                        let payTotal = `To'langan: ${formatter.format(target?.pay_total_price)}`;
                        let discountTotal = '';
                        let debtTotal = ''
                        if (+target?.discount > 0) discountTotal = `Chegirma: ${formatter.format(target?.discount)}`
                        if (target?.total_price - target?.discount - target?.pay_total_price > 0) {
                            debtTotal = `Qarz: ${formatter.format(target?.total_price - target?.discount - target?.pay_total_price)}`
                        }
                        const totalPriceWidth = doc.getTextDimensions(totalPrice).w;
                        const payTotalWidth = doc.getTextDimensions(payTotal).w;
                        const discountTotalWidth = doc.getTextDimensions(discountTotal).w;
                        const debtTotalWidth = doc.getTextDimensions(debtTotal).w;
                        doc.setLineWidth(0.5);
                        let rectHeigth = 0;
                        let max = Math.max(totalPriceWidth, payTotalWidth, discountTotalWidth, debtTotalWidth);
                        if (discountTotalWidth > 0) {
                            rectHeigth = rectHeigth + 10
                        }
                        if (debtTotalWidth > 0) {
                            rectHeigth = rectHeigth + 10
                        }

                        doc.rect((xPosition - max / 2) - 5, y - 4, max + 10, (6) + 5 + 5 + rectHeigth);
                        y = y + 2
                        doc.text(`${totalPrice}`, xPosition, y, { align: 'center', });
                        y = y + 5
                        doc.text(`${payTotal}`, xPosition, y, { align: 'center', });
                        if (discountTotalWidth > 0) {
                            y = y + 5
                            doc.text(`${discountTotal}`, xPosition, y, { align: 'center', });
                        }
                        if (debtTotalWidth > 0) {
                            y = y + 5
                            doc.text(`${debtTotal}`, xPosition, y, { align: 'center', });
                        }
                    } else
                        if (+user?.setting?.is_chek_total_price) {
                            y = y + 8
                            // tortbuchkak xona raqmi
                            let totalPrice = `Umumiy to'lov: ${formatter.format(target?.total_price)}`;
                            const totalPriceWidth = doc.getTextDimensions(totalPrice).w;
                            doc.setLineWidth(0.5);
                            let rectHeigth = 0;
                            let max = Math.max(totalPriceWidth);

                            doc.rect((xPosition - max / 2) - 5, y - 4, max + 10, (6) + 5 + 5 + rectHeigth);
                            y = y + 2
                            doc.text(`${totalPrice}`, xPosition, y, { align: 'center', });
                            y = y + 5

                        }

                    if (+user?.setting?.is_qr_chek) {
                        y = y + 10
                        const clientId = target?.client_value?.at(0)?.client_id || "default_client_id";
                        const baseUrl = user?.setting?.result_domain;
                        // const dataString = `${baseUrl}?client_id=${clientId}&department_id=1`;

                        // QR kod uchun to'liq URL
                        const dataString = `${baseUrl}?client_id=${clientId}`;
                        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(dataString)}&size=150x150`;
                        doc.addImage(qrCodeUrl, "JPEG", 16, y - 5, 35, 35);
                        y = y + 35
                        doc.text(`Скачать результаты`, xPosition, y, { align: 'center', });
                        y = y + 5
                        doc.text(` Natijalarni olish`, xPosition, y, { align: 'center', });
                        y = y + 5
                        if (user?.owner?.phone_1?.length == 9) {
                            doc.text(`+998 ${phoneFormatNumber(user?.owner?.phone_1)}`, xPosition, y, { align: 'center', });
                            y = y + 5
                        }
                        if (user?.owner?.phone_2?.length == 9) {
                            doc.text(`+998 ${phoneFormatNumber(user?.owner?.phone_2)}`, xPosition, y, { align: 'center', });
                            y = y + 5
                        }
                        if (user?.owner?.phone_3?.length == 9) {
                            doc.text(`+998 ${phoneFormatNumber(user?.owner?.phone_3)}`, xPosition, y, { align: 'center', });
                            y = y + 5
                        }
                    }
                }
                saveObject = {
                    ...saveObject,
                    total_price_title: {
                        text: `${formatter.format(price)}`,
                        y: y,
                        x: x + offsetX,
                        size: 10,
                    }


                }
                y = y + 10
                doc.setLineWidth(1.5);
                // const baseUrl = "https://clinic-certificate.netlify.app";

                doc.line(5, y, pageWidth - 5, y);
                saveObject = {
                    ...saveObject,
                    total_price_line: {
                        x1: 5,
                        y1: y,
                        x2: pageWidth - 5,
                        y2: y,
                        linesize: 1.5,
                    }
                }
                y = y + 10
                drowData.push(saveObject);
            }

            // doc.setPage(1);
            doc.internal.pageSize.height = y;
            doc.deletePage(1);
            doc.addPage([pageWidth, y]);

            // const currentHeight = doc.internal.pageSize.height;
            // doc.text(`${y}`, 5, y+10, { align: 'center', });
            // console.log(y);
            // // pageHeight = y + 10; // Add some padding to the bottom

            if (+user?.setting?.is_logo_chek) {
                let centerX = pageWidth / 2 - user?.setting?.logo_width / 2;
                doc.addImage(`${domain}/api/v3/file?url=${user?.logo_photo}`, "JPEG", centerX, 3, +user?.setting?.logo_width, +user?.setting?.logo_height);
                y = +user?.setting?.logo_height + 3;
            } else {
                y = 5;
            }
            index = 0;


            for (let key in data) {
                index = index + 1
                let saveObject = {} as any
                let response = data[key]
                doc.setFontSize(10);
                // title

                if (!user?.setting?.is_logo_chek) {
                    doc.setFont('bold');
                    doc.splitTextToSize(name, 70).map((line: any) => {
                        doc.text(line, x, y);
                        y = y + 5;
                    });
                }
                saveObject = {
                    ...saveObject,
                    title: {
                        name: name,
                        y: y,
                        x: x
                    }
                }
                y = y + 5
                let departmentName = response?.at(0).service.department
                const textWidth = doc.getTextDimensions(departmentName.name).w;
                const xPosition = pageWidth / 2;
                // bolim
                doc.setFont('bold');

                const departmentNameSplit = doc.splitTextToSize((departmentName.name).toUpperCase(), 65);
                departmentNameSplit.map((line: any) => {
                    // doc.text(line, x, y);
                    doc.text(line, xPosition, y, { align: 'center', });
                    y = y + 5;
                });

                saveObject = {
                    ...saveObject,
                    department: {
                        name: departmentName.name,
                        y: y,
                        width: textWidth,
                        x: xPosition,
                        style: {
                            align: 'center',
                        }
                    }
                }
                const lineY = y + 1; // The Y position of the line, slightly below the text
                doc.setLineWidth(0.5);
                doc.line(xPosition - textWidth, lineY, xPosition + textWidth, lineY);
                saveObject = {
                    ...saveObject,
                    department_line: {
                        x1: xPosition - textWidth,
                        y1: lineY,
                        x2: xPosition + textWidth,
                        y2: lineY,
                        lineSize: 0.5
                    }
                }
                y = y + 10;
                // ism familyasi
                doc.setFont('regular');
                doc.text('Mijoz:', x, y)
                saveObject = {
                    ...saveObject,
                    full_name_title: {
                        text: 'Mijoz:',
                        y: y,
                        x: x,
                        size: 10,
                    }
                }
                doc.setFont('regular');
                doc.setFontSize(10);
                saveObject = {
                    ...saveObject,
                    full_name: {
                        text: fullName(target).toUpperCase(),
                        textLine: 40,
                        y: y,
                        x: x + offsetX,
                        offsetY: 5,
                        size: 10,
                    }
                }
                const textLines1 = doc.splitTextToSize(fullName(target).toUpperCase(), 40);
                textLines1.map((line: any) => {
                    doc.text(line, x + offsetX, y);
                    y = y + 5;
                });
                // idsi
                doc.text('ID', x, y)
                saveObject = {
                    ...saveObject,
                    person_id_title: {
                        text: "ID",
                        y: y,
                        x: x,
                        size: 10,
                    }
                }
                doc.text(formatId(target?.person_id), x + offsetX, y)
                saveObject = {
                    ...saveObject,
                    person_id: {
                        text: formatId(target?.person_id),
                        y: y,
                        x: x + offsetX,
                        size: 10,
                    }
                }
                y = y + 5
                if (target?.probirka_id > 0 && + departmentName.probirka) {
                    doc.text('Probirka', x, y)
                    saveObject = {
                        ...saveObject,
                        person_id_title: {
                            text: "ID",
                            y: y,
                            x: x,
                            size: 10,
                        }
                    }
                    doc.text((target?.probirka_id), x + offsetX, y)
                    saveObject = {
                        ...saveObject,
                        person_id: {
                            text: (target?.person_id),
                            y: y,
                            x: x + offsetX,
                            size: 10,
                        }
                    }
                    y = y + 5
                }
                // tugulgan sana
                if (checkNull(target?.data_birth)) {
                    doc.text("Tugulgan sana", x, y)
                    saveObject = {
                        ...saveObject,
                        data_birth_title: {
                            text: "Tugulgan sana",
                            y: y,
                            x: x,
                            size: 10,
                        }
                    }
                    doc.text(dateFormat(target?.data_birth, '/', false), x + offsetX, y)
                    saveObject = {
                        ...saveObject,
                        person_id: {
                            text: target?.data_birth,
                            y: y,
                            x: x + offsetX,
                            size: 10,
                        }
                    }
                    y = y + 5
                }
                // kelgan sana
                doc.text('Kelgan sana', x, y)
                saveObject = {
                    ...saveObject,
                    kelgan_sana_title: {
                        text: 'Kelgan sana',
                        y: y,
                        x: x,
                        size: 10,
                    }
                }
                doc.text(dateFormat(target?.created_at, '/', false), x + offsetX, y)
                saveObject = {
                    ...saveObject,
                    kelgan_sana: {
                        text: formatId(target?.person_id),
                        y: y,
                        x: x + offsetX,
                        size: 10,
                    }
                }
                y = y + 8
                // tortbuchkak xona raqmi
                doc.setFont('bold');
                doc.setFontSize(16);
                let timeFind = client_time?.find((item: any) => item?.department_id === departmentName?.id && +departmentName?.is_reg_time)
                let floor = timeFind ? timeFind?.agreement_time : ` ${departmentName?.letter} - ${response?.at(0)?.queue_number}`
                const textWidth2 = doc.getTextDimensions(floor).w;
                doc.setLineWidth(0.5);

                doc.rect((xPosition - textWidth2 / 2) - 5, y - 6, textWidth2 + 10, 8);
                saveObject = {
                    ...saveObject,
                    tortburchak: {
                        x1: (xPosition - textWidth2 / 2) - 5,
                        y1: y - 4,
                        x2: textWidth2 + 10,
                        y2: 6,
                        lineSize: 0.5
                    }
                }
                doc.text(floor, xPosition, y, { align: 'center', });
                doc.setFontSize(10);
                saveObject = {
                    ...saveObject,
                    tortburchak_title: {
                        text: floor,
                        y: y,
                        x: xPosition,
                        size: 10,
                        style: {
                            align: 'center'
                        }
                    }
                }
                y = y + 8
                // qavat boyicha batafsil
                const qavat = `${departmentName?.floor} | ${departmentName?.main_room} - Xona`;
                doc.text(qavat, xPosition, y, { align: 'center', });
                saveObject = {
                    ...saveObject,
                    qavat: {
                        text: qavat,
                        y: y,
                        x: xPosition,
                        size: 10,
                        style: {
                            align: 'center'
                        }
                    }
                }
                doc.setFont('regular');
                y = y + 10
                // y = 20;
                // xizmatlar
                console.log(data[key]);
                let res = data[key].map((item: any) => {
                    return [item?.service?.name, item?.price, item?.qty];
                });
                saveObject = {
                    ...saveObject,
                    xizmatlar: {
                        data: res,
                        y: y,
                        x: x,
                        size: 10,
                    }
                }
                for (let item of res) {
                    doc.setFont('regular');
                    const serviceName = doc.splitTextToSize((item[0]).toUpperCase(), 65);
                    serviceName.map((line: any) => {
                        doc.text(line, x, y);
                        y = y + 5;
                    });
                    doc.setFont('bold');
                    doc.text(formatter.format(item[1]), pageWidth - x, y, { align: 'right', });
                    y = y + 5
                }
                doc.setFont('regular');
                doc.text('Summa', x, y,);
                saveObject = {
                    ...saveObject,
                    total_price_title: {
                        text: 'Summa',
                        y: y,
                        x: x,
                        size: 10,
                    }
                }
                doc.setFont('bold');
                let price = data[key]?.reduce((a: any, b: any) => a + +b.price * +b.qty, 0);

                doc.text(`${formatter.format(price)}`, x + offsetX, y);
                if (index == Object.keys(data).length) {
                    let extraPrice = 0;
                    console.log('target', target);
                    if (+target.is_statsionar) {
                        y = y + 10
                        doc.setFont('bold');
                        doc.text('STATSIONAR', xPosition, y, { align: 'center', });
                        const lineY = y + 1; // The Y position of the line, slightly below the text
                        doc.setLineWidth(0.5);
                        doc.line(5, lineY, 65, lineY);
                        doc.setFont('regular');
                        y = y + 10
                        doc.text('Qabul sanasi:', x, y)
                        doc.text(target?.admission_date, x + offsetX, y)
                        y = y + 5
                        doc.text('Ketish sanasi:', x, y)
                        if (+target.day_qty > 0) {
                            doc.text(addDaysToDate(target.admission_date, +target.day_qty), x + offsetX, y)
                        } else {
                            doc.text(target.admission_date, x + offsetX, y)
                        }

                        doc.setLineWidth(0.5);

                        doc.rect(5, y + 4, 60, 30);
                        y = y + 10
                        doc.text('Xona:', x + 5, y)
                          doc.text(`${target.statsionar_room.type} ${target.statsionar_room.number}-xona`, x + 5 + 10, y)
                        y = y + 5
                        doc.text("o'rin:", x + 5, y)
                        doc.text(target.statsionar_room.room_index, x + 5 + 10, y)
                        y = y + 5
                        doc.text("Narxi:", x + 5, y)
                        doc.text(target.statsionar_room.price, x + 5 + 10, y)
                        y = y + 5
                        doc.text("Kun:", x + 5, y)
                        let dats = target.day_qty > 0 ? target.day_qty : statitionarDate({
                            admission_date: target.admission_date ?? user?.graph_format_date,
                        }, user?.graph_format_date, true)
                        doc.text(`${dats}`, x + 5 + 10, y)
                        y = y + 5
                        extraPrice = dats * target.statsionar_room.price
                        doc.text("Jami:", x + 5, y)
                    
                        doc.text(formatter.format(extraPrice), x + 5 + 10, y)
                        y = y + 5
                    }
                    if (+user?.setting?.is_chek_rectangle) {
                        y = y + 8
                        // tortbuchkak xona raqmi
                        let totalPrice = `Umumiy to'lov: ${formatter.format(+target?.total_price + +extraPrice)}`;
                        let payTotal = `To'langan: ${formatter.format(target?.pay_total_price)}`;
                        let discountTotal = '';
                        let debtTotal = ''
                        if (+target?.discount > 0) discountTotal = `Chegirma: ${formatter.format(target?.discount)}`
                        if (target?.total_price - target?.discount - target?.pay_total_price > 0) {
                            debtTotal = `Qarz: ${formatter.format(target?.total_price - target?.discount - target?.pay_total_price)}`
                        }
                        const totalPriceWidth = doc.getTextDimensions(totalPrice).w;
                        const payTotalWidth = doc.getTextDimensions(payTotal).w;
                        const discountTotalWidth = doc.getTextDimensions(discountTotal).w;
                        const debtTotalWidth = doc.getTextDimensions(debtTotal).w;
                        doc.setLineWidth(0.5);
                        let rectHeigth = 0;
                        let max = Math.max(totalPriceWidth, payTotalWidth, discountTotalWidth, debtTotalWidth);
                        if (discountTotalWidth > 0) {
                            rectHeigth = rectHeigth + 5
                        }
                        if (debtTotalWidth > 0) {
                            rectHeigth = rectHeigth + 5
                        }




                        doc.rect(x, y - 4, pageWidth - 10, (6) + 5 + 5 + rectHeigth);
                        y = y + 2
                        doc.text(`${totalPrice}`, x + 10, y);
                        y = y + 5
                        doc.text(`${payTotal}`, x + 10, y);
                        if (discountTotalWidth > 0) {
                            y = y + 5
                            doc.text(`${discountTotal}`, x + 10, y);
                        }
                        if (debtTotalWidth > 0) {
                            y = y + 5
                            doc.text(`${debtTotal}`, x + 10, y);
                        }

                        y = y + 5
                    } else

                        if (+user?.setting?.is_chek_total_price) {
                            y = y + 8
                            // tortbuchkak xona raqmi
                            let totalPrice = `Umumiy to'lov: ${formatter.format(target?.total_price)}`;
                            const totalPriceWidth = doc.getTextDimensions(totalPrice).w;
                            doc.setLineWidth(0.5);
                            let rectHeigth = 0;
                            let max = Math.max(totalPriceWidth);

                            doc.rect((xPosition - max / 2) - 5, y - 4, max + 10, 10 + rectHeigth);
                            y = y + 2
                            doc.text(`${totalPrice}`, xPosition, y, { align: 'center', });
                            y = y + 5

                        }

                    if (+user?.setting?.is_qr_chek) {
                        y = y + 10
                        const clientId = target?.client_value?.at(0)?.client_id || "default_client_id";
                        const baseUrl = user?.setting?.result_domain;
                        // const dataString = `${baseUrl}?client_id=${clientId}&department_id=1`;

                        // QR kod uchun to'liq URL
                        const dataString = `${baseUrl}?client_id=${clientId}`;
                        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(dataString)}&size=150x150`;
                        doc.addImage(qrCodeUrl, "JPEG", 16, y - 5, 35, 35);
                        y = y + 35
                        doc.text(`Скачать результаты`, xPosition, y, { align: 'center', });
                        y = y + 5
                        doc.text(` Natijalarni olish`, xPosition, y, { align: 'center', });
                        y = y + 5
                        if (user?.owner?.phone_1?.length == 9) {
                            doc.text(`+998 ${phoneFormatNumber(user?.owner?.phone_1)}`, xPosition, y, { align: 'center', });
                            y = y + 5
                        }
                        if (user?.owner?.phone_2?.length == 9) {
                            doc.text(`+998 ${phoneFormatNumber(user?.owner?.phone_2)}`, xPosition, y, { align: 'center', });
                            y = y + 5
                        }
                        if (user?.owner?.phone_3?.length == 9) {
                            doc.text(`+998 ${phoneFormatNumber(user?.owner?.phone_3)}`, xPosition, y, { align: 'center', });
                            y = y + 5
                        }
                    }
                }
                // chegirma
                // let discount = data[key]?.reduce((a: any, b: any) => a + chegirmaHisobla(b), 0);
                // if (discount > 0) {
                //     y = y + 5;
                //     doc.setFont('regular');
                //     doc.text('chegirma', x, y);
                //     doc.setFont('bold');
                //     doc.text(`${formatter.format(discount)}`, x + offsetX, y);
                // }
                // let debt = data[key]?.reduce((a: any, b: any) => a + !(+b.is_active) ? 0 : +b.total_price - (+b.pay_price + chegirmaHisobla(b)), 0) as any
                // console.log('debt', debt);
                // console.log('data[key]', debt);

                // if (debt > 0) {
                //     y = y + 5;
                //     doc.setFont('regular');
                //     doc.text('Umuiy Qarz', x, y);
                //     doc.setFont('bold');
                //     doc.text(`${formatter.format(debt)}`, x + offsetX, y);
                // }
                saveObject = {
                    ...saveObject,
                    total_price_title: {
                        text: `${formatter.format(price)}`,
                        y: y,
                        x: x + offsetX,
                        size: 10,
                    }
                }
                y = y + 10
                doc.setLineWidth(1.5);


                const departmentId = departmentName?.id || 1;
                // const baseUrl = "https://clinic-certificate.netlify.app";
                // const baseUrl = "https://sertificat.immuno-lab.uz";


                doc.line(5, y, pageWidth - 5, y);
                saveObject = {
                    ...saveObject,
                    total_price_line: {
                        x1: 5,
                        y1: y,
                        x2: pageWidth - 5,
                        y2: y,
                        linesize: 1.5,
                    }
                }
                y = y + 10
                drowData.push(saveObject);
            }
        }





        doc.autoPrint();

        // Convert PDF to a Blob and set it as the source for the iframe
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);

        if (iframeRef.current) {
            iframeRef.current.src = pdfUrl;
            iframeRef.current.onload = () => {
                iframeRef.current?.contentWindow?.print();
            };
        }
    } catch (error) {
        console.log(error);

    }
    finally {
        // isLoadingFunction(false)
    }



}

export const testGenerateCheck = async ({ target, iframeRef, name = 'Topilmadi', client_time = [], user }: {
    target
    ?: any,
    iframeRef?: any,
    name?: string,
    client_time?: any,
    user?: any,


}) => {
    console.log('testGenerateCheck user', user);

    function dataURLToBlob(dataURL: any) {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new Blob([u8arr], { type: mime });
    }
    try {
        // isLoadingFunction(true)


        const data = target?.client_value.reduce((acc: any, item: any) => {
            const departmentId = item.service.department.id;
            if (!acc[departmentId]) {
                acc[departmentId] = [];
            }
            acc[departmentId].push(item);
            return acc;
        }, {});

        console.log(data);

        const pageWidth = 70;
        let pageHeight = +user?.setting?.logo_height + 100; //
        var doc = new jsPDF({
            unit: 'mm',
            format: [pageWidth, pageHeight],
        }) as any;
        // doc.autoPrint();
        const response = await fetch('/Regular.ttf');
        const responseBold = await fetch('/Bold.ttf');
        const fontData = await response.arrayBuffer();
        doc.addFileToVFS('Bold.ttf', responseBold);
        doc.addFileToVFS('Regular.ttf', fontData);
        doc.addFont('/Bold.ttf', 'bold', 'normal');
        doc.addFont('/Regular.ttf', 'regular', 'normal');
        let x = 5, y = 5, offsetX = 25;
        let drowData = [

        ] as any
        let index = 0;
        if (+user?.setting?.is_logo_chek) {
            y = 20;
            let centerX = pageWidth / 2 - user?.setting?.logo_width / 2;
            doc.addImage(`${domain}/api/v3/file?url=${user?.logo_photo}`, "JPEG", centerX, 3, +user?.setting?.logo_width, +user?.setting?.logo_height);
            y += 3;
        }

        doc.autoPrint();

        // Convert PDF to a Blob and set it as the source for the iframe
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);

        if (iframeRef.current) {
            iframeRef.current.src = pdfUrl;
            iframeRef.current.onload = () => {
                iframeRef.current?.contentWindow?.print();
            };
        }
    } catch (error) {
        console.log(error);

    }
    finally {
        // isLoadingFunction(false)
    }



}
