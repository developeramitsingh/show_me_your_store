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

export const updateUserData = async(request,response,next) => {
    try{
            const requestBodyData :any = request.swagger.params.body.value;
            let bodyData = {
                ...requestBodyData,
            }
            let data = JSON.parse(JSON.stringify(bodyData));
            delete data.roleId;
            delete data.roleKey;
            delete data.password;
            const updateUserData = await usersService.updateUserByQuery(data,{_id:data.id});
            return response.status(200).send({success:true, data :updateUserData})
    } catch(err) {
      console.error('error in update user details')
      next(err);
    }
}

export const getUserDetailsById = async(request,response,next) => {
    try{
        const userId :string = request.swagger.params.id.value;
        let userDetailsById = await usersService.getUserByQuery({_id:userId});
        userDetailsById = JSON.parse(JSON.stringify(userDetailsById));
        delete userDetailsById.password;
        return response.status(200).send({success:true, data :userDetailsById})

    } catch(err){
        console.error('error in get user details by id')
        next(err);
    }
}