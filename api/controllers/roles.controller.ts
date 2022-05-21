import Constant from "../constant/constant";
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

export const createRole = async (request, response, next) => {
    try {
        const requestBody: any = request.swagger.params.body.value;

        const roleKey: string = requestBody.roleKey;

        const data = {
            "roleDesc": requestBody.roleDesc,
            "roleKey": roleKey,
            "roleName": requestBody.roleName
        };
        let newRole = await rolesService.createRole(data);

        return response.status(200).send({ success:true, data: newRole });
    } catch(err){
        console.error('error in createRole ->' ,err);
        next(err);
    }
}