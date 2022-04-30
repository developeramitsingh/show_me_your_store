import { usersService } from "../services";

export const getAllUserData = async(request,response,next) => {
    try{

        const getAllUserData = await usersService.getAllUserByQuery({isActive:1});
        return response.status(200).send({success:true, data:getAllUserData});

    } catch(err){
        console.error('error in get all active users data ->' ,err);
        next(err);
    }
}