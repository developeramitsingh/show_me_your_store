import { usersService } from "../services";
import { logInConsole } from "../utils/utils";

export const getAllUserData = async(request, response, next) => {
    try{

        let allUserData = await usersService.getAllUserByQuery({isActive:1});
        allUserData = JSON.parse(JSON.stringify(allUserData));
        
        for (const user of allUserData) {
            delete user.password;
        }

        return response.status(200).send({success:true, data: allUserData});
    } catch(err){
        console.error('error in get all active users data ->' ,err);
        next(err);
    }
}