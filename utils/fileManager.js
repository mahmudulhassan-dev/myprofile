import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_UPLOAD_PATH = path.join(__dirname, '../../public/uploads');

// Ensure base path exists
if (!fs.existsSync(BASE_UPLOAD_PATH)) {
    fs.mkdirSync(BASE_UPLOAD_PATH, { recursive: true });
}

class FileManagerUtil {
    static getFullPath(relativePath) {
        // Prevent directory traversal
        const safePath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');
        return path.join(BASE_UPLOAD_PATH, safePath);
    }

    static async listFiles(reqPath = '') {
        const fullPath = this.getFullPath(reqPath);

        if (!fs.existsSync(fullPath)) return [];

        const items = await fs.promises.readdir(fullPath, { withFileTypes: true });

        const fileList = await Promise.all(items.map(async (item) => {
            const itemPath = path.join(fullPath, item.name);
            const stats = await fs.promises.stat(itemPath);
            const relativePath = path.relative(BASE_UPLOAD_PATH, itemPath).replace(/\\/g, '/');

            return {
                name: item.name,
                type: item.isDirectory() ? 'folder' : 'file',
                path: relativePath,
                size: stats.size,
                modified: stats.mtime,
                url: item.isDirectory() ? null : `/uploads/${relativePath}`
            };
        }));

        // Sort: Folders first, then files
        return fileList.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'folder' ? -1 : 1;
        });
    }

    static async createFolder(name, currentPath = '') {
        const fullPath = path.join(this.getFullPath(currentPath), name);
        if (fs.existsSync(fullPath)) throw new Error('Folder already exists');
        await fs.promises.mkdir(fullPath, { recursive: true });
        return true;
    }

    static async deleteItem(itemPath) {
        const fullPath = this.getFullPath(itemPath);
        if (!fs.existsSync(fullPath)) throw new Error('Item not found');

        const stats = await fs.promises.stat(fullPath);
        if (stats.isDirectory()) {
            await fs.promises.rm(fullPath, { recursive: true, force: true });
        } else {
            await fs.promises.unlink(fullPath);
        }
        return true;
    }

    static async renameItem(oldPath, newName) {
        const fullOldPath = this.getFullPath(oldPath);
        const dir = path.dirname(fullOldPath);
        const fullNewPath = path.join(dir, newName);

        if (!fs.existsSync(fullOldPath)) throw new Error('Item not found');
        if (fs.existsSync(fullNewPath)) throw new Error('Name already exists');

        await fs.promises.rename(fullOldPath, fullNewPath);
        return true;
    }

    static async moveItem(itemPath, destinationPath) {
        const sourcePath = this.getFullPath(itemPath);
        const fileName = path.basename(sourcePath);
        const targetDir = this.getFullPath(destinationPath);
        const targetPath = path.join(targetDir, fileName);

        if (!fs.existsSync(sourcePath)) throw new Error('Source not found');
        if (!fs.existsSync(targetDir)) throw new Error('Destination folder not found');
        if (fs.existsSync(targetPath)) throw new Error('File already exists in destination');

        await fs.promises.rename(sourcePath, targetPath);
        return true;
    }

    static async copyItem(itemPath, destinationPath) {
        const sourcePath = this.getFullPath(itemPath);
        const fileName = path.basename(sourcePath);
        const targetDir = this.getFullPath(destinationPath);
        const targetPath = path.join(targetDir, fileName);

        if (!fs.existsSync(sourcePath)) throw new Error('Source not found');
        if (!fs.existsSync(targetDir)) throw new Error('Destination folder not found');

        // Handle duplication if file exists
        let finalTargetPath = targetPath;
        if (fs.existsSync(finalTargetPath)) {
            const ext = path.extname(fileName);
            const name = path.basename(fileName, ext);
            finalTargetPath = path.join(targetDir, `${name}-${Date.now()}${ext}`);
        }

        const stats = await fs.promises.stat(sourcePath);
        if (stats.isDirectory()) {
            await fs.promises.cp(sourcePath, finalTargetPath, { recursive: true });
        } else {
            await fs.promises.copyFile(sourcePath, finalTargetPath);
        }
        return true;
    }

    static async getStats() {
        // Simplified recursive size calculation
        let totalSize = 0;
        let fileCount = 0;

        const calculate = async (dirPath) => {
            const items = await fs.promises.readdir(dirPath, { withFileTypes: true });
            for (const item of items) {
                const fullPath = path.join(dirPath, item.name);
                if (item.isDirectory()) {
                    await calculate(fullPath);
                } else {
                    const stats = await fs.promises.stat(fullPath);
                    totalSize += stats.size;
                    fileCount++;
                }
            }
        };

        if (fs.existsSync(BASE_UPLOAD_PATH)) {
            await calculate(BASE_UPLOAD_PATH);
        }

        return { size: totalSize, count: fileCount };
    }
}

export default FileManagerUtil;
