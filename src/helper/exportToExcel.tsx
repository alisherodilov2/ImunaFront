import React from 'react'
import { read, utils, writeFileXLSX } from 'xlsx'
import * as XLSX from 'xlsx';
export const exportToExcel = (data?: any) => {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    const img = new Image();
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
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Save the workbook as an XLSX file
    XLSX.writeFile(wb, 'exported_data.xlsx');
}
