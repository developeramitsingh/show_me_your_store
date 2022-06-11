import * as fs from 'fs';
class ImageKitHelper {
    public static async createFolder(imageKitInstance: any, folderName: string, parentFolderPath: string) {
        return await imageKitInstance.createFolder(folderName, parentFolderPath);
    }

    public static async uploadImage(params: ImageKitUploadImageParams) {
        const { imageKitInstance,
            file,
            fileName,
            folder } = params;
        return await imageKitInstance.upload({ file, fileName, folder, useUniqueFileName: false });
    }
}

export default ImageKitHelper;