import { storesService } from "../services";
import { logInConsole } from "../utils/utils";
import {Types} from "mongoose";
import { IStores } from "../models/stores.model";
import config from '../../config';

import ImageKitHelper from '../helpers/imageKitHelper';
import ControllerHelper from "../helpers/controllerHelper";
const ImageKit = require("imagekit");

const CONFIG_OPTIONS = {
    publicKey: process.env.publicKeyImageKit,
    privateKey: process.env.privateKeyImageKit,
    urlEndpoint: config.imageKit.url,
};

const imageKit = new ImageKit(CONFIG_OPTIONS);

export const createStore = async (request, response, next) => {
    const requestBody: any = request.body;
    const file: any = request.files;
    logInConsole(requestBody);

    try {
        let data = {
            ...requestBody,
        }

        data = JSON.parse(JSON.stringify(data));

        delete data._id;
        const newStore = await storesService.createStore(data);
        console.info(`Store created`);

        const storeId: Types.ObjectId = newStore?._id;
        let finalImageUrl: string = '';
        let finalImageThumbUrl: string = '';

        if (file && storeId) {            
            const imagePaths: IUploadImage = 
                await ControllerHelper.uploadImage(request, `uploads/stores/${storeId}`);
            finalImageUrl = imagePaths.finalImageUrl;
            finalImageThumbUrl = imagePaths.finalImageThumbUrl;/*  */

            const imageUpdate: IStores = {
                storeImg: finalImageUrl,
                storeImgThumb: finalImageThumbUrl,
            }

            await storesService.updateStoreByQuery(imageUpdate, { _id: storeId });
            console.info(`store image updated: ${storeId}`);
        }

        return response.status(200).send({ success: true, data: newStore });
    } catch (err) {
        console.error(`error in createStore ->`, err);
        next(err);
    }
}

export const getAllStoreData = async (request, response, next) => {
    try {
        console.info(`getAllStoreData called...`);
        let query: any = request.swagger.params.query.value;

        
        console.info({query});

        query = JSON.parse(query);

        console.info({query});

        const getAllStoreData: IStores[] | any = await storesService.getAllStoreByQuery(query);

        return response.status(200).send({ success: true, data: getAllStoreData });

    } catch(err){
        console.error('error in get all store data ->' ,err);
        next(err);
    }
}

export const getAllStoresUnassigned = async (request, response, next) => {
    try {
        console.info(`getAllStoresUnassigned called...`);
        let query: any = request.swagger.params.query.value;
        query = JSON.parse(query);

        const getAllStoreData: IStores[] | any = 
            await storesService.getAllStoresUnassignedByQuery(query);        

        return response.status(200).send({ success: true, data: getAllStoreData });

    } catch(err){
        console.error('error in getAllStoresUnassigned ->' ,err);
        next(err);
    }
}

export const updateStoreData = async(request, response, next) => {
    try {
        const requestBody: any = request.body;
        const file: any = request.files;
        const storeId: Types.ObjectId = requestBody.id;
        logInConsole(requestBody);

        
        
        let bodyData = {
            ...requestBody,
        }
        let data = JSON.parse(JSON.stringify(bodyData));


        if (file) {        
            let finalImageUrl: string = '';
            let finalImageThumbUrl: string = '';    
            const imagePaths: IUploadImage = 
                await ControllerHelper.uploadImage(request, `uploads/stores/${storeId}`);
            finalImageUrl = imagePaths.finalImageUrl;
            finalImageThumbUrl = imagePaths.finalImageThumbUrl;

            data.storeImg = finalImageUrl;
            data.storeImgThumb = finalImageThumbUrl;
        }

        delete data.id
        const updateData = await storesService.updateStoreByQuery(data, {_id: storeId});
        return response.status(200).send({success:true, data :updateData})

    } catch(err){
        console.error('error in update store data ->' ,err);
        next(err);
    }
}

export const getStoreDetailsById = async(request,response,next) => {
    try{
        const storeId :Types.ObjectId = request.swagger.params.id.value;
        let storeDetailsById = await storesService.getStoreById(storeId);
        //userDetailsById = JSON.parse(JSON.stringify(userDetailsById));
        //delete userDetailsById.password;
        return response.status(200).send({success:true, data :storeDetailsById})

    } catch(err){
        console.error('error in get store details by id')
        next(err);
    }
}