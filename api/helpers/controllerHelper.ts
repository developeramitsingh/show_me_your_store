import * as fs from 'fs';
import ImageKitHelper from '../helpers/imageKitHelper';
const ImageKit = require("imagekit");

import config from '../../config';

const CONFIG_OPTIONS = {
    publicKey: process.env.publicKeyImageKit,
    privateKey: process.env.privateKeyImageKit,
    urlEndpoint: config.imageKit.url,
};

const imageKit = new ImageKit(CONFIG_OPTIONS);

class ControllerHelper {
    public static async uploadImage(request: any, folderToCreate: string): Promise<IUploadImage> {
        const file: any = request.files;
        let finalImageUrl: string = '';
        let finalImageThumbUrl: string = '';
    
        if (file) {
            const fullFileName: string[] = file && file.imgFile ? file.imgFile.name.split('.') : [];
    
            const imgName: string = fullFileName[0] || '';
            const extn: string = fullFileName[fullFileName?.length - 1] || '';
    
            //reading image file from temp folder
            const imgDataStream = fs.createReadStream(String(file.imgFile.tempFilePath));
    
            //final new image name 
            const newImgName: string = `${imgName.toLowerCase()}_${new Date().getTime()}.${extn}`;
    
            //path on which image will be written
            //const folderToCreate: string = `uploads/products/${storeId}`;
    
            const response = await ImageKitHelper.uploadImage({ 
                imageKitInstance: imageKit, file: imgDataStream, fileName: newImgName, folder: folderToCreate 
            });
            
            console.info(response);
    
            if (response) {
                finalImageUrl = response.url;
                finalImageThumbUrl = response.thumbnailUrl;
            }
        }
    
        return { finalImageUrl, finalImageThumbUrl };
    }
}

export default ControllerHelper;