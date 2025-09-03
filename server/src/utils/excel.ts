import ExcelJS from 'exceljs';

export class ExcelUtils {
    async readWorkbook(filePath: string): Promise<ExcelJS.Workbook> {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        return workbook;
    }

    async saveWorkbook(filePath: string, workbook: ExcelJS.Workbook): Promise<void> {
        await workbook.xlsx.writeFile(filePath);
    }

    async extractSheet(workbook: ExcelJS.Workbook, sheetName: string): Promise<ExcelJS.Workbook> {
        const worksheet = workbook.getWorksheet(sheetName);
        if (!worksheet) {
            throw new Error(`Sheet "${sheetName}" not found`);
        }

        const newWb = new ExcelJS.Workbook();
        const newSheet = newWb.addWorksheet(sheetName);

        // Clone rows & styles
        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            const newRow = newSheet.getRow(rowNumber);
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                const newCell = newRow.getCell(colNumber);
                newCell.value = cell.value;

                // copy styles
                if (cell.style) {
                    newCell.style = { ...cell.style };
                }
            });
            newRow.commit();
        });

        // Copy column widths
        worksheet.columns?.forEach((col, idx) => {
            if (col.width) {
                newSheet.getColumn(idx + 1).width = col.width;
            }
        });

        return newWb;
    }
}
