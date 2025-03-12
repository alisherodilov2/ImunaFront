import React from 'react'
import { AnyIfEmpty } from 'react-redux';
import { read, utils, writeFileXLSX } from 'xlsx'
import * as XLSX from 'xlsx';
export const exportToExcel = (data?: any, marge?: any) => {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    const img = new Image();
    worksheet['!merges'] = marge;
    utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    writeFileXLSX(workbook, 'data.xlsx');
}

export const exportToExcelNested = () => {
    const data = [
        {
            header1: 'Value 1',
            header2: 'Value 2',
            children: [
                {
                    subHeader1: 'SubValue 1',
                    subHeader2: 'SubValue 2',
                },
            ],
        },
        // ... More data
    ];

    // Creating a new workbook and sheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Example: Merging cells (colspan/rowspan)
    ws['!merges'] = [
        // Example: Merge first two cells in the first row
        { s: { r: 1, c: 5 }, e: { r: 0, c: 1 } },
    ];

    // Add the sheet to the workbook
    // for (let r = 1; r <= ws.length; r++) {
    //     const cellRef = XLSX.utils.encode_cell({ r: r, c: columnToChange });
    //     const cellValue = ws[r - 1][columnToChange]; // Get the value of the cell
    //     const textColor = cellValue > 5 ? 'FF0000' : '0000FF'; // Example: Red if > 5, Blue otherwise
    //     wb[cellRef].s = { font: { color: { rgb: textColor } } };
    //   }
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Save the workbook as an XLSX file
    XLSX.writeFile(wb, 'exported_data.xlsx');
}
