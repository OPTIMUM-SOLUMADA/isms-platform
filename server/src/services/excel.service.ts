import { ExcelUtils } from "@/utils/excel";
import { SofficeUtils } from "@/utils/soffice";
import * as path from "path";

export interface ConvertOptions {
    sheet?: string | number;
    outputDir?: string;
}

export class ExcelService {
    private repo: ExcelUtils;
    private soffice: SofficeUtils;

    constructor() {
        this.repo = new ExcelUtils();
        this.soffice = new SofficeUtils();
    }

    async convertSheetToHtml(inputPath: string, options: ConvertOptions = {}): Promise<string> {
        const wb = await this.repo.readWorkbook(inputPath);
        const sheetNames = wb.worksheets.map(ws => ws.name);

        let sheetName = "";
        if (typeof options.sheet === "number") {
            sheetName = sheetNames[options.sheet]!;
        } else if (typeof options.sheet === "string") {
            sheetName = options.sheet;
        } else {
            sheetName = sheetNames[0]!;
        }

        if (!sheetName) {
            throw new Error("Invalid sheet selection");
        }

        const newWb = await this.repo.extractSheet(wb, sheetName);

        const outputDir = options.outputDir || path.dirname(inputPath);
        const singleSheetPath = path.join(outputDir, `${sheetName}.xlsx`);
        await this.repo.saveWorkbook(singleSheetPath, newWb);

        return this.soffice.convertToHtml(singleSheetPath);
    }
}
