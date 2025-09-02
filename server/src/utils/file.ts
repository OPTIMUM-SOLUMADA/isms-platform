import fs from "fs";
import path from "path";

export class FileUtils {
    static ensureDirExists(dir: string): void {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    }

    static resolveOutputDir(subDir: string): string {
        const dir = path.resolve(subDir);
        this.ensureDirExists(dir);
        return dir;
    }

    static deleteFile(...filePath: string[]) {
        try {
            fs.unlinkSync(path.join(...filePath));
        } catch (err) {
            console.error(err);
        }
    }
}
