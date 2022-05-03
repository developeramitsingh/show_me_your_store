import { Types } from 'mongoose';
import * as fs from 'fs';
import Constant from '../constant/constant';
import { IProducts } from "../models/products.model";
import productService from "../services/productsService";
import { getOffset } from '../utils/utils';

export const createProduct = async (request: any, response: any, next: any) => {
    try {
        const requestBody: any = request.swagger.params.body?.value;
        const file: any = request.files;

        console.info({ file });
        let productImgPath: any;
        console.info({ files: file });
        if (file) {
            productImgPath = await uploadProductImage(request);
        }

        const data: IProducts = {
            storeId: requestBody.storeId,
            productName: requestBody.productName,
            productCompany: requestBody.productCompany,
            productDesc: requestBody.productDesc,
            productCategory: requestBody.productCategory,
            warranty: requestBody.warranty,
            price: requestBody.price,
            productImg: productImgPath ? productImgPath : null,
            qtyType: requestBody.qtyType,
            quantity: requestBody.quantity,
            searchTags: requestBody.searchTags ? requestBody.searchTags.split(',') : [],
            size: requestBody.size,
        };

        const createdProduct = await productService.createProduct(data);

        return response.status(200).send({ success: true, data: createProduct });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

export const getProducts = async (request: any, response: any, next: any) => {
    try {
        const roleKey: string = request.user.roleId.roleKey;
        const isActive: boolean = request.swagger.params.isActive?.value;
        const storeId: string = request.swagger.params.storeId?.value;

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
    const id: Types.ObjectId = request.swaggar.params.id?.value;

    const productData: IProducts = await productService.getProductById(id);

    return response.status(200).send({ success: true, data: productData });
 } catch (err) {
     console.error(err);
     next(err);
 }
}

export const updateProduct = async (request: any, response: any, next: any) => {
    try {
        const requestBody: any = request.swagger.params.body?.value;

        let productImgPath: any;
        console.info({ files: request.files });
        if (request.files) {
            productImgPath = await uploadProductImage(request);
        }

        const data: IProducts = {
            storeId: requestBody.storeId,
            productName: requestBody.productName,
            productCompany: requestBody.productCompany,
            productDesc: requestBody.productDesc,
            productCategory: requestBody.productCategory,
            warranty: requestBody.warranty,
            price: requestBody.price,
            ...(productImgPath ? { productImg: productImgPath } : {}),
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

const uploadProductImage = async (request: any): Promise<string> => {
    const requestBody: any = request.swagger.params.body?.value;
    const file: any = request.files;

    const fullFileName: string[] = file && file.imgFile ? file.imgFile.name.split('.') : [];
    console.info({fullFileName});
    const imgName: string = fullFileName[0] || '';
    console.info({imgName});
    const extn: string = fullFileName[1] || '';
    console.info({extn});

    //reading image file from temp folder
    const imgData = fs.readFileSync(String(file.imgFile.tempFilePath));
    console.info({imgData});

    //final new image name 
    const newImgName: string = `${imgName.toLowerCase()}_${new Date().getTime()}.${extn}`;

    const storeId: string = requestBody.storeId //single store id;
    console.info({newImgName});

    //path on which image will be written
    const productImgPath: string = `uploads/products/${storeId}/`;

    console.info({productImgPath});

    const folderPath: string = `${global.__basedir}/${productImgPath}`;

    try {
        fs.mkdirSync(folderPath, { recursive: true } );
    } catch (e) {
        console.log('Cannot create folder ', e);
    }
    
    //writing to the uploads folder
    fs.writeFileSync(`${folderPath}/${newImgName}`, imgData);

    return `${productImgPath}${newImgName}`;
}