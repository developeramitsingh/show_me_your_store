import { rolesService } from "../services";

export const getAllRoles = async (request, response, next) => {
    try {
        let allRoles = await rolesService.getAllRoleByQuery({ isActive:1 });
        allRoles = JSON.parse(JSON.stringify(allRoles));

        return response.status(200).send({ success:true, data: allRoles });
    } catch(err){
        console.error('error in get all active users data ->' ,err);
        next(err);
    }
}
