import fs from "fs";
import path from "path";

export class FileService {
    static async deleteFile(...filePath: string[]) {
        try {
            fs.unlinkSync(path.join(...filePath));
        } catch (err) {
            console.error(err);
        }
    }

}
