// import { AppDispatch } from '../store/store';
// import { isLoadingApiFunction } from '../reducer/MenuReducer';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import logo from '../../pages/service/logo.jpg'
import { fullName } from './fullName';
import { formatId } from './idGenerate';
import { dateFormat } from '../service/helper/day';
import { chegirmaHisobla } from './cashRegHelper';
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
export const generateJavonChek = async ({ target, iframeRef }: {
    target
    ?: any,
    iframeRef?: any,

}) => {

    try {
        // isLoadingFunction(true)




        const pageWidth = 56;
        let pageHeight = 40; //
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
        doc.setFont('regular');
        doc.setFontSize(10);
        let x = 5;
        let y = 5;
        y = y + 1;
        doc.setFontSize(10);
        doc.text(`${dateFormat(target?.created_at)}`, x, y)
        y += 8;
        doc.setFont('bold');
        doc.setFontSize(14);
        const xPosition = pageWidth / 2;
        const departmentNameSplit = doc.splitTextToSize(fullName(target), 30);
        departmentNameSplit.map((line: any) => {
            const textWidth = doc.getTextDimensions(line).w;
            // doc.text(line, x, y);
            doc.text(line, x, y, { align: 'left' });
            y = y + 5;
        });
        doc.setFont('regular');
        doc.setFontSize(15);
        // let xPosition = pageWidth / 2;
        const textWidth2 = doc.getTextDimensions(`Javon `).w;
        doc.setLineWidth(1);
        y = y + 4
        doc.rect(3, y - 3, pageWidth - 23, 25);
        doc.text("Javon", (xPosition - textWidth2 / 2), y + 3, { align: 'center' });
        y = y + 15
        doc.setFontSize(50);
        let shelf_number = `${target?.shelf_number > 0 ? target?.shelf_number : '0'}`;
        const textWidth3 = doc.getTextDimensions(shelf_number).w;

        doc.text(shelf_number, (xPosition - textWidth3 / 2)+5, y + 3, { align: 'center' });
        // doc.setLineWidth(1.5);
        // doc.rect(1, 1, pageWidth - 1, pageHeight-1);


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

