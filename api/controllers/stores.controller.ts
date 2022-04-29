import { storesService } from "../services";
import { logInConsole } from "../utils/utils";

export const createStore = async (request, response, next) => {
    const requestBody: any = request.swagger.params.body.value;
    logInConsole(requestBody);

    try {
        let data = {
            ...requestBody,
        }

        data = JSON.parse(JSON.stringify(data));
        console.info(data);
       const newStore = await storesService.createStore(data);
        logInConsole(newStore);

        return response.status(200).send({ success: true, data: newStore });
    } catch (err) {
        console.error(`error in createStore ->`, err);
        next(err);
    }
}

export const getAllStoreData = async(request,response,next) => {
    try{

        const getAllStoreData = await storesService.getAllStoreByQuery({isActive:1});
        return response.status(200).send({success:true, data:getAllStoreData});

    } catch(err){
        console.error('error in get all store data ->' ,err);
        next(err);
    }
}

export const updateStoreData = async(request,response,next) => {
    try{
         
        const requestBodyData :any = request.swagger.params.body.value;
        let bodyData = {
            ...requestBodyData,
        }
        let data = JSON.parse(JSON.stringify(bodyData));
        const updateData = await storesService.updateStoreByQuery(data,{_id:data.id});
        return response.status(200).send({success:true, data :updateData})

    } catch(err){
        console.error('error in update store data ->' ,err);
        next(err);
    }
}