import { usersService } from "../services";
import { logInConsole } from "../utils/utils";

export const getAllStoreData = async(request,response,next) => {
    try{

        const getAllStoreData = await storesService.getAllStoreByQuery({isActive:1});
        return response.status(200).send({success:true, data:getAllStoreData});

    } catch(err){
        console.error('error in get all store data ->' ,err);
        next(err);
    }
}