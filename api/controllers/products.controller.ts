import { Types } from 'mongoose';
import Constant from '../constant/constant';
import ControllerHelper from '../helpers/controllerHelper';
import { IProducts } from "../models/products.model";
import productService from "../services/productsService";
import { getOffset, logInConsole } from '../utils/utils';

export const createProduct = async (request: any, response: any, next: any) => {
    try {
        console.info(`calling createProduct...`);
        const requestBody: any = request.body;
        const file: any = request.files;
        
        const storeIds: Types.ObjectId[] = requestBody.storeId ? requestBody.storeId.split(',') : [];

        for (const storeId of storeIds) {
            let finalImageUrl: string = '';
            let finalImageThumbUrl: string = '';

            if (file) {
                const imagePaths: IUploadImage = await ControllerHelper.uploadImage(request, `uploads/products/${storeId}`);
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
        let query: any = request.swagger.params.query.value;

        
        console.info({query});

        query = JSON.parse(query);

        console.info({query});

        const pageNumber = query.page || Constant.PAGINATION.PAGE;
        const pageSize = query.size || Constant.PAGINATION.SIZE;
        const sort = query.sort;
        //const forExport = request.swagger.params.forExport?.value;

        const offset = getOffset(pageNumber, pageSize);

        if ([Constant.ROLES.CA, Constant.ROLES.UA].includes(roleKey) && !query?.storeId) {
            throw new Error('store id is required');
        }

        console.info({ roleKey, storeId: query.storeId, pageNumber, pageSize, sort, offset });
 
        const allProducts: IGetAllData = await productService.getCountAndProductsByQuery({
            query,
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
        const requestBody: any = request.body;

        logInConsole(requestBody)
        console.info({ files: request.files });
        let finalImageUrl: string = '';
        let finalImageThumbUrl: string = '';

        if (request.files) {
            const imagePaths: IUploadImage = await ControllerHelper.uploadImage(request, `uploads/products/${requestBody.storeId}`);
            console.info({imagePaths});
            finalImageUrl = imagePaths.finalImageUrl;
            finalImageThumbUrl = imagePaths.finalImageThumbUrl;
        }

        const data: IProducts = {
            storeId: requestBody.storeId,
            isAvailable: requestBody.isAvailable,
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

        console.info('data ---> final', {data});
        console.info('requestBody.id ---> requestBody.id', {data: requestBody._id});
        const updatedProduct = await productService.updateProductByQuery(data, { _id: requestBody._id });

        return response.status(200).send({ success: true, data: updatedProduct });
    } catch(err) {
        console.error(err);
        next(err);
    }
}

export const searchProducts = async (request: any, response: any, next: any) => {
    try {
        console.info(`calling searchProducts...`);
        const storeId: string = request.swagger.params.storeId.value;
        const searchString: string = request.swagger.params.searchString.value;

        console.info({ storeId });
        console.info({ searchString });

        let searchedProducts: IProducts[];
        if(searchString) {
            const regx = new RegExp(`${searchString}`, 'i');
            console.info(regx);
            searchedProducts = await productService.searchProducts({
                storeId,
                $text: { $search: regx }
            });
        } else {
            searchedProducts = await productService.getProducts({
                storeId,
            });
        }
        

        return response.status(200).send({ success: true, data: searchedProducts });
    } catch(err) {
        next(err);
    }
}