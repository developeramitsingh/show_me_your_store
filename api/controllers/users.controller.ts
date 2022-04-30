import { usersService } from "../services";

export const getAllUsersData = async(request, response, next) => {
    try{

        const getAllUsersData = await usersService.getAllUserByQuery({isActive:1});
        return response.status(200).send({success:true, data: getAllUsersData});

    } catch(err){
        console.error('error in get all users data ->' ,err);
        next(err);
    }
}