import html2canvas from 'html2canvas';// import { AppDispatch } from '../store/store';
// import { isLoadingApiFunction } from '../reducer/MenuReducer';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import logo from '../../pages/service/logo.jpg'
import { fullName } from './fullName';
import { formatId } from './idGenerate';
import { dateFormat } from '../service/helper/day';
// import { Jinsi } from './Jinsi';
// import { discountQty, payDiscount, paymentDiscount } from './payDiscount';
// import { barcodeView } from './barcodeView';
// import { fulldate } from './fulldate';
export const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: 2,
    // currency: 'So'm'
});


export const generateDoctorTemplate = async ({ target, iframeRef, name = 'Topilmadi' }: {
    target
    ?: any,
    iframeRef?: any,
    name?: string
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

        // const doc = new jsPDF("p", "mm", "a4"); // A4 formatidagi hujjat (210mm x 297mm)
        // // const response = await fetch('/Regular.ttf');
        // // const responseBold = await fetch('/Bold.ttf');
        // // const fontData = await response.arrayBuffer();
        // // doc.addFileToVFS('Bold.ttf', responseBold);
        // // doc.addFileToVFS('Regular.ttf', fontData);
        // // doc.addFont('/Bold.ttf', 'bold', 'normal');
        // // doc.addFont('/Regular.ttf', 'regular', 'normal');

        // const pageHeight = doc.internal.pageSize.height; // Sahifaning balandligi
        // const margin = 10; // Chekka masofalar
        // let y = margin; // Y koordinata boshi

        // const tempElement = document.createElement("div");
        // tempElement.innerHTML = target; // HTML stringni vaqtinchalik DOMga o'rnatish
        // const content = tempElement.querySelectorAll("*");

        // content.forEach((node) => {
        //     const nodeHeight = doc.getTextDimensions(node.textContent || "").h; // Element balandligini hisoblash
        //     if (y + nodeHeight > pageHeight - margin) {
        //         doc.addPage(); // Yangi sahifa
        //         y = margin; // Y koordinata qayta boshlanadi
        //     }
        //     doc.text(node.textContent || "", margin, y); // Matnni joylashtirish
        //     y += nodeHeight; // Y ni yangilash
        // });


        // const pdfDataUri = doc.output('datauristring');
        // const blob = dataURLToBlob(pdfDataUri);
        // const blobUrl = URL.createObjectURL(blob);
        // window.open(blobUrl, '_blank');
        // URL.revokeObjectURL(blobUrl);
        // window.open(doc.output('bloburl'), '_blank'); 
        // const pdfBlob = doc.output('blob');
        // const pdfUrl = URL.createObjectURL(pdfBlob);
        // doc.autoPrint(); // Set to auto-print

        // Generate a Blob URL for the PDF
        // const pdfBlob = doc.output('blob');
        // const pdfUrl = URL.createObjectURL(pdfBlob);

        // // Open the Blob URL in a new window and trigger print
        // const newWindow = window.open(pdfUrl);
        // doc.save("output.pdf"); // PDF saqlash
        // const doc = new jsPDF("p", "mm", "a4"); // A4 format
        // const content = document.createElement("div");

        // // HTML ni vaqtinchalik DOMga qo'shish
        // content.innerHTML = target;
        // content.style.visibility = "hidden";
        // document.body.appendChild(content);

        // // PDF yaratish
        // doc.html(content, {
        //     callback: (doc) => {
        //         // PDFni yangi oynada ochish
        //         const blob = doc.output("blob");
        //         const url = URL.createObjectURL(blob);
        //         window.open(url);

        //         // Qo'shimcha DOMni o'chirish
        //         // document.body.removeChild(content);
        //     },
        //     x: 10,
        //     y: 10,
        //     width: 190, // Chetdan masofa
        // });
        const htmlContent = `
     
        ${target}${target}${target}${target}${target}${target}${target}${target}${target}${target}${target}${target}${target}${target}${target}${target}${target}${target}${target}${target}${target}${target}${target}${target}${target}${target}${target}${target}${target}`;
        const pdf = new jsPDF("p", "mm", "a4"); // A4 format, portret yo‘nalishi
        const pageHeight = pdf.internal.pageSize.height; // PDF sahifasi balandligi (mm)

        // Virtual DOMga HTML ni joylashtirish
        const container = document.createElement("div");
        container.innerHTML = htmlContent;
        document.body.appendChild(container);

        // HTML dan PDF yaratish
        await pdf.html(container, {
            callback: function (pdfInstance) {
                // PDFni yangi oynada ochish
                const pdfBlob = pdfInstance.output("blob");
                const pdfUrl = URL.createObjectURL(pdfBlob);
                window.open(pdfUrl, "_blank");
            },
            x: 10, // Chapdan bo'sh joy
            y: 10, // Yuqoridan bo'sh joy
            width: 190, // Sahifa kengligi (A4 210mm dan 10mm chegara bilan)

        });

        // Virtual DOMni o‘chirish
        document.body.removeChild(container);
    } catch (error) {
        console.log(error);

    }
    finally {
        // isLoadingFunction(false)
    }



}

