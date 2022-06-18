import { Types } from 'mongoose';
import * as fs from 'fs';
import Constant from '../constant/constant';
import { IProducts } from "../models/products.model";
import productService from "../services/productsService";
import { getOffset } from '../utils/utils';
import config from '../../config';
import ImageKitHelper from '../helpers/imageKitHelper';
const ImageKit = require("imagekit");

const CONFIG_OPTIONS = {
    publicKey: process.env.publicKeyImageKit,
    privateKey: process.env.privateKeyImageKit,
    urlEndpoint: config.imageKit.url,
};

const imageKit = new ImageKit(CONFIG_OPTIONS);

export const createProduct = async (request: any, response: any, next: any) => {
    try {
        console.info(`calling createProduct...`);
        const requestBody: any = request.body;
        const file: any = request.files;
        
        const storeIds: Types.ObjectId[] = requestBody.storeId ? requestBody.storeId.split(',') : [];

        console.info({storeIds});
        for (const storeId of storeIds) {
            let finalImageUrl: string = '';
            let finalImageThumbUrl: string = '';

            if (file) {
                const imagePaths: IUploadImage = await uploadImage(request, `uploads/products/${storeId}`);
                finalImageUrl = imagePaths.finalImageUrl;
                finalImageThumbUrl = imagePaths.finalImageThumbUrl;
            }
            console.info('final', {finalImageUrl});
            console.info('finalImageThumbUrl', {finalImageThumbUrl});
            const data: IProducts = {
                storeId,
                productName: requestBody.productName,
                productCompany: requestBody.productCompany,
                productDesc: requestBody.productDesc,
                productCategory: requestBody.productCategory,
                warranty: requestBody.warranty,
                price: requestBody.price,
                productImg: finalImageUrl || null,
                productImgThumb: finalImageThumbUrl || null,
                qtyType: requestBody.qtyType,
                quantity: requestBody.quantity,
                searchTags: requestBody.searchTags ? [requestBody.productName, `${requestBody.productName} ${requestBody.quantity || ''}` , requestBody.productCompany, ...(requestBody.productCategory ? [requestBody.productCategory] : []), ...requestBody.searchTags] : [requestBody.productName],
                size: requestBody.size,
            };
    
            productService.createProduct(data);
        }
        

        return response.status(200).send({ success: true });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

export const getProducts = async (request: any, response: any, next: any) => {
    try {
        console.info(`calling getProducts...`);
        const roleKey: string = request.user.roleId.roleKey;
        const isActive: boolean = request.swagger.params.isActive?.value;
        const storeId: string[] = request.user.stores;

        const pageNumber =
            request.swagger.params.page?.value || Constant.PAGINATION.PAGE;
        const pageSize =
            request.swagger.params.size?.value || Constant.PAGINATION.SIZE;
        const sort = request.swagger.params.sort?.value;
        //const forExport = request.swagger.params.forExport?.value;

        const offset = getOffset(pageNumber, pageSize);

        if ([Constant.ROLES.CA, Constant.ROLES.UA].includes(roleKey) && !storeId) {
            throw new Error('store id is required');
        }

        console.info({ roleKey, isActive, storeId, pageNumber, pageSize, sort, offset });
 
        const allProducts: IGetAllData = await productService.getCountAndProductsByQuery({
            query: { ...(storeId && { storeId }), ...(isActive && { isActive }) },
            limit: pageSize,
            offset,
            sort,
        });

        return response.status(200).send({ success: true, data: allProducts });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

export const getProductById = async (request: any, response: any, next: any) => {
 try {
    console.info(`calling getProductById...`);
    const id: Types.ObjectId = request.swagger.params.id?.value;

    const productData: IProducts = await productService.getProductById(id);

    return response.status(200).send({ success: true, data: productData });
 } catch (err) {
     console.error(err);
     next(err);
 }
}

export const updateProduct = async (request: any, response: any, next: any) => {
    try {
        console.info(`calling updateProduct...`);
        const requestBody: any = request.swagger.params.body?.value;

        console.info({requestBody})
        console.info({ files: request.files });
        let finalImageUrl: string = '';
        let finalImageThumbUrl: string = '';

        if (request.files) {
            const imagePaths: IUploadImage = await uploadImage(request, `uploads/products/${requestBody.storeId}`);
            finalImageUrl = imagePaths.finalImageUrl;
            finalImageThumbUrl = imagePaths.finalImageThumbUrl;
        }

        const data: IProducts = {
            storeId: requestBody.storeId,
            productName: requestBody.productName,
            productCompany: requestBody.productCompany,
            productDesc: requestBody.productDesc,
            productCategory: requestBody.productCategory,
            warranty: requestBody.warranty,
            price: requestBody.price,
            ...(finalImageUrl ? { productImg: finalImageUrl } : {}),
            ...(finalImageThumbUrl ? { productImgThumb: finalImageThumbUrl } : {}),
            qtyType: requestBody.qtyType,
            quantity: requestBody.quantity,
            ...(requestBody.searchTags ? { searchTags: requestBody.searchTags.split(',') }: {} ),
            size: requestBody.size,
        };
        const updatedProduct = await productService.updateProductByQuery(data, { _id: requestBody.id });

        return response.status(200).send({ success: true, data: updatedProduct });
    } catch(err) {
        console.error(err);
        next(err);
    }
}

const uploadImage = async (request: any, folderToCreate: string): Promise<IUploadImage> => {
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

export const searchProducts = async (request: any, response: any, next: any) => {
    try {
        console.info(`calling searchProducts...`);
        const storeId: string = request.swagger.params.storeId.value;
        const searchString: string = request.swagger.params.searchString.value;

        console.info({ storeId });
        console.info({ searchString });
        const regx = new RegExp(`${searchString}`, 'i');
        console.info(regx);
        const searchedProducts: IProducts[] = await productService.searchProducts({
            storeId,
            $text: { $search: regx }
        });

        return response.headers().status(200).send({ success: true, data: searchedProducts });
    } catch(err) {
        next(err);
    }
}